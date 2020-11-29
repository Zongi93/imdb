import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { delay, map, switchMap, takeWhile } from 'rxjs/operators';
import { Film } from '../shared/models/film';
import { PersistanceService } from '../shared/services/persistance.service';
import { MoviesListService } from './movies-list.service';

const ORDERS = ['asc', 'desc', 'watchlisted', 'off'] as const;
type Orders = typeof ORDERS[number];

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements AfterViewInit {
  @ViewChild('filmsList') filmsList: ElementRef;

  private readonly sortOrderEmitter = new BehaviorSubject<Orders>('off');
  private readonly SORT_ORDER_KEY = 'movies-list--sort-by';

  get sortOrder(): Orders {
    return this.sortOrderEmitter.value;
  }

  readonly latestFilms$ = combineLatest([
    this.sortOrderEmitter,
    this.service.latestFilms$,
  ]).pipe(switchMap(([order, arr]) => this.sortLatestFilmsByOrder(arr, order)));

  constructor(
    private readonly service: MoviesListService,
    private readonly persistanceService: PersistanceService
  ) {
    const persistedOrder = persistanceService.get<Orders>(
      this.SORT_ORDER_KEY,
      'off'
    );

    if (ORDERS.includes(persistedOrder)) {
      this.sortOrderEmitter.next(persistedOrder);
    }

    this.sortOrderEmitter.subscribe((order) =>
      persistanceService.set(this.SORT_ORDER_KEY, order)
    );
  }

  ngAfterViewInit(): void {
    const filmListDiv = this.filmsList.nativeElement as HTMLDivElement;
    const isScrollBarNotPresent = () =>
      filmListDiv.scrollHeight < window.innerHeight;

    this.latestFilms$
      .pipe(delay(50), takeWhile(isScrollBarNotPresent))
      .subscribe(
        () => this.service.requestNextPage(),
        () => undefined,
        () => this.service.requestNextPage()
      );
  }

  updateOrder(sortBy: Orders): void {
    const prevValue = this.sortOrderEmitter.value;
    const nextValue = prevValue === sortBy ? 'off' : sortBy;
    this.sortOrderEmitter.next(nextValue);
  }

  onScroll(): void {
    this.service.requestNextPage();
  }

  private sortLatestFilmsByOrder(
    films: Array<Film>,
    order: Orders
  ): Observable<Array<Film>> {
    switch (order) {
      case 'asc':
        return of(films.sort((a, b) => Film.compareByDate(a, b) * -1)); // we could also swap to (b,a)
      case 'desc':
        return of(films.sort(Film.compareByDate));
      case 'watchlisted':
        return this.service.watchListArray$.pipe(
          map((watchlistArray) =>
            films.sort((a, b) => {
              const isA = watchlistArray.includes(a.id) ? -1 : 1;
              const isB = watchlistArray.includes(b.id) ? -1 : 1;
              return isA - isB;
            })
          )
        );
      case 'off':
      default:
        return of(films);
    }
  }
}

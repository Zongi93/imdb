import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { delay, map, takeWhile } from 'rxjs/operators';
import { Film } from '../shared/models/film';
import { MoviesListService } from './movies-list.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements AfterViewInit {
  @ViewChild('filmsList') filmsList: ElementRef;

  private readonly sortOrderEmitter = new BehaviorSubject<'asc' | 'desc'>(
    'desc'
  );

  get sortOrder(): string {
    return this.sortOrderEmitter.value;
  }

  readonly latestFilms$ = combineLatest([
    this.sortOrderEmitter.pipe(map((order) => (order === 'desc' ? 1 : -1))),
    this.service.latestFilms$,
  ]).pipe(
    map(([order, arr]) => arr.sort((a, b) => Film.compareByDate(a, b) * order))
  );

  constructor(private readonly service: MoviesListService) {}

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

  flipOrder(): void {
    const nextOrder = this.sortOrderEmitter.value === 'desc' ? 'asc' : 'desc';
    this.sortOrderEmitter.next(nextOrder);
  }

  onScroll(): void {
    this.service.requestNextPage();
  }
}

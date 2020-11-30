import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, scan, switchMap } from 'rxjs/operators';
import { RestControllerService } from '../shared';
import { Film } from '../shared/models/film';
import { AuthenticationService } from '../shared/services/authentication.service';
import { PersistanceService } from '../shared/services/persistance.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesListService {
  private readonly requestNextLatestFilmsPage = new BehaviorSubject<undefined>(undefined);

  readonly latestFilms$: Observable<Array<Film>> = this.requestNextLatestFilmsPage.pipe(
    scan((prev, curr: void) => prev + 1, 0),
    switchMap((nextPage) => this.restController.getLatestFilms(nextPage)),
    map((res) => res.results),
    scan((prev, current) => [...prev, ...current], [] as Array<Film>) // There are more efficient solutions
  );

  private readonly filmWatchlistedEmitter = new BehaviorSubject<Array<number>>([]);
  private readonly WATCHLIST_KEY = 'movies-list--watchlist';

  readonly watchListArray$: Observable<Array<number>> = this.filmWatchlistedEmitter;

  constructor(
    private readonly restController: RestControllerService,
    private readonly persistanceService: PersistanceService,
    private readonly authService: AuthenticationService,
    private readonly router: Router
  ) {
    authService.login$.subscribe(() => this.startUp());
  }

  requestNextPage(): void {
    this.requestNextLatestFilmsPage.next(undefined);
  }

  updateWatchlist(film: Film): void {
    const watchlist = this.filmWatchlistedEmitter.value;
    const filmAlreadyOnWatchlist = watchlist.includes(film.id);

    if (filmAlreadyOnWatchlist) {
      this.filmWatchlistedEmitter.next(watchlist.filter((id) => id !== film.id));
    } else {
      this.filmWatchlistedEmitter.next([...watchlist, film.id]);
    }
  }

  isFilmOnWatchlist(film: Film): Observable<boolean> {
    return this.filmWatchlistedEmitter.pipe(map((arr) => arr.includes(film.id), distinctUntilChanged()));
  }

  navigateToFilmDetailsPage(film: Film): void {
    this.router.navigate(['/details'], { queryParams: { id: film.id } });
  }

  private startUp(): void {
    const persistedWatchList = this.persistanceService.getFromLocalStorage<Array<number>>(this.WATCHLIST_KEY, []);
    this.filmWatchlistedEmitter.next(persistedWatchList);

    this.filmWatchlistedEmitter.subscribe((arr) => this.persistanceService.setToLocalStorage(this.WATCHLIST_KEY, arr));
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, scan, switchMap, tap } from 'rxjs/operators';
import { RestControllerService } from '../shared';
import { Film } from '../shared/models/film';

@Injectable({
  providedIn: 'root',
})
export class MoviesListService {
  private readonly requestNextLatestFilmsPage = new BehaviorSubject<undefined>(
    undefined
  );

  readonly latestFilms$: Observable<
    Array<Film>
  > = this.requestNextLatestFilmsPage.pipe(
    scan((prev, curr: void) => prev + 1, 0),
    switchMap((nextPage) => this.restController.getLatestFilms(nextPage)),
    map((res) => res.results),
    scan((prev, current) => [...prev, ...current], [])
  );

  constructor(private readonly restController: RestControllerService) {}

  requestNextPage(): void {
    this.requestNextLatestFilmsPage.next(undefined);
  }
}

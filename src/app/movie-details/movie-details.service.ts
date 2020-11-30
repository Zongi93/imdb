import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, scan, switchMap } from 'rxjs/operators';
import { RestControllerService } from '../shared';
import { FilmReview } from '../shared/models/film-review';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailsService implements CanActivate {
  private movieIdEmitter = new BehaviorSubject<number>(undefined);
  readonly movieId$ = this.movieIdEmitter.pipe(filter((o) => !!o));
  readonly movieDetails$ = this.movieId$.pipe(switchMap((id) => this.restController.getFilmDetails(id)));

  private readonly requestNextReviewsPageEmitter = new BehaviorSubject<undefined>(undefined);

  readonly reviews$: Observable<Array<FilmReview>> = combineLatest([
    this.movieId$,
    this.requestNextReviewsPageEmitter.pipe(scan((prev, curr: void) => prev + 1, 0)),
  ]).pipe(
    switchMap(([id, nextPage]) => this.restController.getFilmReviews(id, nextPage)),
    scan((prev, current) => [...prev, ...current], [] as Array<FilmReview>) // There are more efficient solutions;
  );

  constructor(private readonly router: Router, private readonly restController: RestControllerService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const id = route.queryParams['id'];

    if (!id) {
      this.router.navigate(['movies']);
    }

    this.movieIdEmitter.next(id);
    return true;
  }

  requestNextReviewsPage(): void {
    this.requestNextReviewsPageEmitter.next(undefined);
  }

  castVote(vote: number): void {
    const id = this.movieIdEmitter.value;
    this.restController.postVoteOnMovie(id, vote).subscribe(
      () => alert('Vote successful!'),
      (error) => {
        alert('Voting was unsuccessful.');
        console.log({ e: error });
      }
    );
  }
}

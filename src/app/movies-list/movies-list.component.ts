import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, takeWhile } from 'rxjs/operators';
import { Film } from '../shared/models/film';
import { MoviesListService } from './movies-list.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements AfterViewInit {
  @ViewChild('filmsList') filmsList: ElementRef;
  readonly latestFilms$: Observable<Array<Film>> = this.service.latestFilms$;

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

  onScroll() {
    this.service.requestNextPage();
  }
}

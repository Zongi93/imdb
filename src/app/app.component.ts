import { Component } from '@angular/core';
import { MovieDetailsService } from './movie-details';
import { MoviesListService } from './movies-list/movies-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly moviesService: MoviesListService,
    private readonly detailsService: MovieDetailsService
  ) {}
}

import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Film } from 'src/app/shared/models/film';
import { ImageLoaderService } from 'src/app/shared/services/image-loader.service';
import { MoviesListService } from '../movies-list.service';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
})
export class MovieItemComponent implements OnInit {
  @Input() film: Film;

  posterUrl$: Observable<string>;

  isWatchlisted$: Observable<boolean>;

  constructor(private readonly imageLoader: ImageLoaderService, private readonly service: MoviesListService) {}

  ngOnInit(): void {
    this.posterUrl$ = this.imageLoader.getImageUrl$(this.film.posterPath);
    this.isWatchlisted$ = this.service.isFilmOnWatchlist(this.film);
  }

  updateWatchlist(): void {
    this.service.updateWatchlist(this.film);
  }
}

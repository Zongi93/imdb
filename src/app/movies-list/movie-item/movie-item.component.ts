import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Film } from 'src/app/shared/models/film';
import { ImageLoaderService } from 'src/app/shared/services/image-loader.service';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
})
export class MovieItemComponent implements OnInit {
  @Input() film: Film;

  posterUrl$: Observable<string>;

  constructor(private readonly imageLoader: ImageLoaderService) {}

  ngOnInit(): void {
    this.posterUrl$ = this.imageLoader.getImageUrl$(this.film.posterPath);
  }
}

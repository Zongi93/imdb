import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ImageLoaderService } from '../shared/services/image-loader.service';
import { MovieDetailsService } from './movie-details.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  readonly movieDetails$ = this.service.movieDetails$;
  readonly reviews$ = this.service.reviews$;

  castedRating = 5;

  constructor(private readonly service: MovieDetailsService, private readonly imageService: ImageLoaderService) {}

  getImageUrl(imageUrl: string): Observable<string> {
    return this.imageService.getImageUrl$(imageUrl);
  }

  getReviewerImageUrl(imageUrl: string): Observable<string> {
    if (imageUrl?.includes('http')) {
      const urlStart = imageUrl.indexOf('http');
      return of(imageUrl.substring(urlStart));
    } else {
      return this.getImageUrl(imageUrl);
    }
  }

  onScroll(): void {
    this.service.requestNextReviewsPage();
  }

  castVote(vote: number): void {
    this.service.castVote(vote);
  }
}

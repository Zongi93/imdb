import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LatestFilmsResponse,
  LatestFilmsResponseDto,
  Configuration,
  ConfigurationDto,
  FilmDetail,
  FilmReview,
  FilmReviewsResultDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class RestControllerService {
  private readonly tmdb = (target: string) => `https://api.themoviedb.org/3${target}`;

  constructor(private readonly http: HttpClient) {
    this.getConfiguration();
  }

  getLatestFilms(page = 1): Observable<LatestFilmsResponse> {
    return this.http
      .get<LatestFilmsResponseDto>(this.tmdb(`/movie/now_playing?page=${page}`))
      .pipe(map(LatestFilmsResponse.fromDto));
  }

  getConfiguration(): Observable<Configuration> {
    return this.http.get<ConfigurationDto>(this.tmdb('/configuration')).pipe(map(Configuration.fromDto));
  }

  getFilmDetails(id: number): Observable<FilmDetail> {
    return combineLatest([
      this.http.get(this.tmdb(`/movie/${id}`)),
      this.http.get(this.tmdb(`/movie/${id}/credits`)),
    ]).pipe(map(FilmDetail.fromDto));
  }

  getFilmReviews(id: number, page = 1): Observable<Array<FilmReview>> {
    return this.http
      .get<FilmReviewsResultDto>(this.tmdb(`/movie/${id}/reviews?page=${page}`))
      .pipe(map((dto) => dto.results.map(FilmReview.fromDto)));
  }
}

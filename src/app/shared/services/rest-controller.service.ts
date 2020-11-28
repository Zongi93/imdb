import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LatestFilmsResponse,
  LatestFilmsResponseDto,
} from '../models/latest-films-response';
import { map } from 'rxjs/operators';
import { Configuration, ConfigurationDto } from '../models/configuration';

@Injectable({
  providedIn: 'root',
})
export class RestControllerService {
  private readonly tmdb = (target: string) =>
    `https://api.themoviedb.org/3${target}`;

  constructor(private readonly http: HttpClient) {
    this.getConfiguration();
  }

  getLatestFilms(page = 1): Observable<LatestFilmsResponse> {
    return this.http
      .get<LatestFilmsResponseDto>(this.tmdb(`/movie/now_playing?page=${page}`))
      .pipe(map(LatestFilmsResponse.fromDto));
  }

  getConfiguration(): Observable<Configuration> {
    return this.http
      .get<ConfigurationDto>(this.tmdb('/configuration'))
      .pipe(map(Configuration.fromDto));
  }
}

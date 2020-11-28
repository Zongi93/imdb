import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ImageConfiguration } from '../models/configuration';
import { RestControllerService } from './rest-controller.service';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {
  private readonly configurationEmitter = new BehaviorSubject<ImageConfiguration>(
    undefined
  );

  private readonly configuration$ = this.configurationEmitter.pipe(
    filter((config) => !!config)
  );

  constructor(private readonly restService: RestControllerService) {
    this.restService
      .getConfiguration()
      .subscribe((config) =>
        this.configurationEmitter.next(config.imageConfiguration)
      );
  }

  getImageUrl$(posterPath: string): Observable<string> {
    return this.configuration$.pipe(
      take(1),
      map(({ baseUrl, posterSizes }) => {
        const sizes = posterSizes.length;
        const myPosterSizeIndex = Math.ceil(sizes / 2) - 1; // could be more sophisticated
        return `${baseUrl}${posterSizes[myPosterSizeIndex]}${posterPath}`;
      })
    );
  }
}

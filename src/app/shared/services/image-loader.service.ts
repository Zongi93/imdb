import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';
import { ImageConfiguration } from '../models/configuration';
import { RestControllerService } from './rest-controller.service';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {
  private readonly configurationEmitter = new BehaviorSubject<ImageConfiguration>(undefined);

  private readonly configuration$ = this.configurationEmitter.pipe(filter((config) => !!config));

  constructor(private readonly restService: RestControllerService) {
    this.restService
      .getConfiguration()
      .subscribe((config) => this.configurationEmitter.next(config.imageConfiguration));
  }

  getImageUrl$(imagePath: string): Observable<string> {
    return this.configuration$.pipe(
      take(1),
      map(({ baseUrl, posterSizes }) => {
        const sizes = posterSizes.length;
        const myPosterSizeIndex = Math.ceil(sizes / 2) - 1; // could be more sophisticated
        if (!!imagePath) {
          return `${baseUrl}${posterSizes[myPosterSizeIndex]}${imagePath}`;
        }
        throw Error('Image path is null!');
      }),
      catchError(() => of('assets/picture-not-available.jpg'))
    );
  }
}

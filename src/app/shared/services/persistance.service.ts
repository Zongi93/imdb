import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersistanceService {
  constructor() {}

  get<T>(key: string, returnOnError: T, ctor = (dto: any) => dto as T): T {
    const dtoStringified = localStorage.getItem(key);

    if (!!dtoStringified) {
      try {
        const dto = JSON.parse(dtoStringified);
        return ctor(dto);
      } catch (e) {
        console.warn(
          'An error has occured when trying to read data from local storage',
          e
        );
        localStorage.removeItem(key);
        return returnOnError;
      }
    } else {
      return returnOnError;
    }
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

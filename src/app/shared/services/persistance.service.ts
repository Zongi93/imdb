import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersistanceService {
  readonly LOGGEDIN_KEY = 'auth-logged_in'; //It's here to avoid circular dependencies with auth service (not ideal)

  constructor() {}

  getFromLocalStorage<T>(key: string, returnOnError: T, addPrefix = true, ctor = (dto: any) => dto as T): T {
    return this.get(localStorage, key, returnOnError, addPrefix, ctor);
  }

  setToLocalStorage(key: string, value: any, addPrefix = true): void {
    this.set(localStorage, key, value, addPrefix);
  }

  getFromSessionStorage<T>(key: string, returnOnError: T, addPrefix = true, ctor = (dto: any) => dto as T): T {
    return this.get(sessionStorage, key, returnOnError, addPrefix, ctor);
  }

  setToSessionStorage(key: string, value: any, addPrefix = true): void {
    this.set(sessionStorage, key, value, addPrefix);
  }

  private get<T>(
    storage: Storage,
    key: string,
    returnOnError: T,
    addPrefix: boolean,
    ctor = (dto: any) => dto as T
  ): T {
    const namespacedKey = addPrefix ? this.namespaceKey(key) : key;
    const dtoStringified = storage.getItem(namespacedKey);

    if (!!dtoStringified) {
      try {
        const dto = JSON.parse(dtoStringified);
        return ctor(dto);
      } catch (e) {
        console.warn('An error has occured when trying to read data from local storage', e);
        storage.removeItem(namespacedKey);
        return returnOnError;
      }
    } else {
      return returnOnError;
    }
  }

  private set(storage: Storage, key: string, value: any, addPrefix: boolean): void {
    const namespacedKey = addPrefix ? this.namespaceKey(key) : key;
    if (!!value) {
      storage.setItem(namespacedKey, JSON.stringify(value));
    } else {
      storage.removeItem(namespacedKey);
    }
  }

  private namespaceKey(key: string): string {
    const prefixDto = sessionStorage.getItem(this.LOGGEDIN_KEY);

    if (!!prefixDto && prefixDto.length > 0) {
      const prefix = JSON.parse(prefixDto);
      return `${prefix}--${key}`;
    }
    return key;
  }
}

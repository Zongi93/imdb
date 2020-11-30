import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { User } from '../models';
import { PersistanceService } from './persistance.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements CanActivate {
  private readonly LOGGEDIN_KEY = this.persistenceService.LOGGEDIN_KEY;
  private readonly USERS_KEY = 'auth-users';

  private registeredUsersEmitter = new BehaviorSubject<Array<User>>([]);
  private loggedInUserEmitter = new BehaviorSubject<User>(undefined);

  readonly isLoggedIn$ = this.loggedInUserEmitter.pipe(map((u) => !!u));

  readonly login$ = this.isLoggedIn$.pipe(filter((isLoggedIn) => isLoggedIn === true));

  private get registeredUsers(): Array<User> {
    return this.registeredUsersEmitter.value;
  }

  get username(): string {
    return this.loggedInUserEmitter.value?.username;
  }

  constructor(private readonly persistenceService: PersistanceService, private readonly router: Router) {
    const persistedUsers = persistenceService.getFromLocalStorage(this.USERS_KEY, [], false).map(User.fromDto);
    const persistedLogIn = persistenceService.getFromSessionStorage(this.LOGGEDIN_KEY, undefined, false);

    this.registeredUsersEmitter.next(persistedUsers);
    this.loggedInUserEmitter.next(!!persistedLogIn ? this.getUserByName(persistedLogIn) : undefined);

    this.registeredUsersEmitter.subscribe((users) =>
      persistenceService.setToLocalStorage(this.USERS_KEY, users, false)
    );
    this.loggedInUserEmitter.subscribe((user) =>
      persistenceService.setToSessionStorage(this.LOGGEDIN_KEY, user?.username, false)
    );
  }

  login(username: string, password: string): boolean {
    const targetUser = this.getUserByName(username);
    const canLogIn = targetUser?.checkPassword(password);

    if (canLogIn) {
      this.loggedInUserEmitter.next(targetUser);
    }
    return canLogIn;
  }

  register(username: string, password: string, email: string): boolean {
    const isUsernameTaken = !!this.getUserByName(username);

    if (isUsernameTaken) {
      return false;
    } else {
      const newUser = User.register(username, password, email);
      this.loggedInUserEmitter.next(newUser);
      this.registeredUsersEmitter.next([...this.registeredUsers, newUser]);

      return true;
    }
  }

  logout(): void {
    this.loggedInUserEmitter.next(undefined);
    this.router.navigate(['login']);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = !!this.loggedInUserEmitter.value;

    if (route.routeConfig.path === 'login') {
      if (isLoggedIn) {
        this.router.navigate(['movies']);
      }
    } else if (!isLoggedIn) {
      this.router.navigate(['login']);
    }

    return true;
  }

  private getUserByName(username: string): User {
    return this.registeredUsers.find((user) => user.username === username);
  }
}

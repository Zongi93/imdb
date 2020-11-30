import { Component } from '@angular/core';
import { MovieDetailsService } from './movie-details';
import { MoviesListService } from './movies-list/movies-list.service';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  get username(): string {
    return this.authService.username;
  }

  constructor(
    private readonly moviesService: MoviesListService,
    private readonly detailsService: MovieDetailsService,
    private readonly authService: AuthenticationService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}

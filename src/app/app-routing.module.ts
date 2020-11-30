import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MovieDetailsService, MovieDetailsComponent } from './movie-details';
import { MoviesListComponent } from './movies-list';
import { AuthenticationService } from './shared/services/authentication.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthenticationService],
  },
  {
    path: 'movies',
    component: MoviesListComponent,
    canActivate: [AuthenticationService],
  },
  {
    path: 'details',
    component: MovieDetailsComponent,
    canActivate: [MovieDetailsService, AuthenticationService],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

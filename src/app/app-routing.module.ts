import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieDetailsService, MovieDetailsComponent } from './movie-details';
import { MoviesListComponent } from './movies-list';

const routes: Routes = [
  {
    path: 'movies',
    component: MoviesListComponent,
  },
  {
    path: 'details',
    component: MovieDetailsComponent,
    canActivate: [MovieDetailsService],
  },
  {
    path: '**',
    redirectTo: 'movies',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

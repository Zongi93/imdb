import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared';
import { MoviesListComponent, MovieItemComponent } from './movies-list';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MovieDetailsComponent } from './movie-details';

@NgModule({
  declarations: [AppComponent, MoviesListComponent, MovieItemComponent, MovieDetailsComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule, InfiniteScrollModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

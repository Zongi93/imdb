import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared';
import { MoviesListComponent } from './movies-list';
import { MovieItemComponent } from './movies-list/movie-item/movie-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [AppComponent, MoviesListComponent, MovieItemComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule, InfiniteScrollModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

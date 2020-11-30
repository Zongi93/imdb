# My IMDB clone

This is an example project written in Angular, the purpose of it is to showcase my understanding of the framework and other used tools.

## About the project

This is an IMDB clone with very limited/basic functionality. Currently we support the following features:

- Ability to view the latest films in a list.
- Ability to sort films by release date.
- Ability to view a film's details and its posted reviews.
- Ability to create account and log in.
- Ability to create watchlist per account.

## How to run

Run `npm install` to install dependencies. Then run `npm run start` and navigate to `http://localhost:4200/`. You will need to provide your own API read access token in `src/app/shared/interceptors/authorization.interceptor.ts:10`. [Click here to read how you can get an API read access token.](https://developers.themoviedb.org/3/getting-started/authentication)

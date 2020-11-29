export type FilmDto = {
  readonly id: number;
  readonly title: string;
  readonly vote_average: number;
  readonly release_date: Date;
  readonly backdrop_path: string;
  readonly poster_path: string;
};

export class Film {
  private constructor(
    readonly id: number,
    readonly title: string,
    readonly voteAverage: number,
    readonly releaseDate: Date,
    readonly backdropPath: string,
    readonly posterPath: string
  ) {}

  static fromDto(dto: FilmDto): Film {
    return new Film(
      dto.id,
      dto.title,
      dto.vote_average,
      new Date(dto.release_date),
      dto.backdrop_path,
      dto.poster_path
    );
  }

  static compareByDate(a: Film, b: Film): number {
    return a.releaseDate > b.releaseDate
      ? -1
      : a.releaseDate === b.releaseDate
      ? 0
      : 1;
  }
}

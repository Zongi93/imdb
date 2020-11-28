import { Film, FilmDto } from './film';

export type LatestFilmsResponseDto = {
  readonly page: number;
  readonly total_pages: number;
  readonly results: Array<FilmDto>;
};

export class LatestFilmsResponse {
  private constructor(
    readonly page: number,
    readonly totalPages: number,
    readonly results: Array<Film>
  ) {}

  static fromDto(dto: LatestFilmsResponseDto): LatestFilmsResponse {
    return new LatestFilmsResponse(
      dto.page,
      dto.total_pages,
      dto.results.map(Film.fromDto)
    );
  }
}

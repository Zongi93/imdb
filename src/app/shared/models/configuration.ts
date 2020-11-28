export type ConfigurationDto = {
  readonly images: ImageConfigurationDto;
};

export class Configuration {
  private constructor(readonly imageConfiguration: ImageConfiguration) {}

  static fromDto(dto: ConfigurationDto): Configuration {
    return new Configuration(ImageConfiguration.fromDto(dto.images));
  }
}

export type ImageConfigurationDto = {
  readonly base_url: string;
  readonly poster_sizes: Array<string>;
};

export class ImageConfiguration {
  constructor(readonly baseUrl: string, readonly posterSizes: Array<string>) {}

  static fromDto(dto: ImageConfigurationDto): ImageConfiguration {
    return new ImageConfiguration(dto.base_url, dto.poster_sizes);
  }
}

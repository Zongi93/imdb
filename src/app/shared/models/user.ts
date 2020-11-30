export type UserDto = {
  readonly username: string;
  readonly passwordHash: string;
  readonly email: string;
};

export class User {
  private constructor(readonly username: string, readonly passwordHash: string, readonly email: string) {}

  static fromDto(dto: UserDto): User {
    return new User(dto.username, dto.passwordHash, dto.email);
  }

  static register(username: string, password: string, email: string): User {
    return new User(username, this.hashPassword(password), email);
  }

  private static hashPassword(password: string): string {
    const asCharCodeArr = password.split('').map((c) => c.charCodeAt(0));
    const asHashArray = asCharCodeArr.map((n, index) =>
      n % 2 === 0
        ? String.fromCharCode(100 + n + index * 2)
        : String.fromCharCode(1000 + n + index * 5) + String.fromCharCode(100 + n + index * 10)
    );
    return asHashArray.join('');
  }

  checkPassword(passwordGiven: string): boolean {
    return this.passwordHash === User.hashPassword(passwordGiven);
  }
}

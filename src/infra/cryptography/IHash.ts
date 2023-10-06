export interface IHash {
  hashPassword: (password: string, saltRounds: number) => Promise<string>
  comparePasswords: (plainPassword: string, hashedPassword: string) => Promise<boolean>
}

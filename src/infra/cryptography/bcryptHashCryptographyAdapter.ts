import bcrypt from 'bcrypt';
import { type IHash } from './IHash';

export class BcryptAdapter implements IHash {
  async hashPassword (password: string, saltRounds: number): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords (plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

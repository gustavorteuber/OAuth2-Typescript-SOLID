import jwt from 'jsonwebtoken';
import { type IJwt } from './IJwt';

export class JwtAdapter implements IJwt {
  sign (payload: any, secret: string, options?: any): string {
    return jwt.sign(payload, secret, options);
  }

  async verify (token: string, secret: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

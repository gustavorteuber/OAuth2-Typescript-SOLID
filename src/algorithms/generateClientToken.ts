import { type IJwt } from '../infra/cryptography/IJwt';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function generateClientToken (clientId: any, jwtService: IJwt) {
  const secret = 'garuvoWORKINSILENCE';
  const token = jwtService.sign({ clientId }, secret, { expiresIn: '1h' });
  return token;
}

import ExpressAdapter from './infra/http/expressAdapter';
import { AuthService } from './services/oAuthServices';
import HttpController from './controllers/httpController';
import { UserRepository } from './repositories/userAuthRepository';
import { RevokedTokenRepository } from './repositories/revokedTokenRepository';
import { BcryptAdapter } from './infra/cryptography/bcryptHashCryptographyAdapter';
import { JwtAdapter } from './infra/cryptography/jwtCryptographyAdapter';

export class App {
  async start (): Promise<void> {
    const httpServer = new ExpressAdapter();
    const userRepository = new UserRepository();
    const revokedTokenRepository = new RevokedTokenRepository();
    const bcryptAdapter = new BcryptAdapter();
    const jwtAdapter = new JwtAdapter();
    const authService = new AuthService(userRepository, revokedTokenRepository, bcryptAdapter, jwtAdapter);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const httpControllerInstance = new HttpController(httpServer, authService, jwtAdapter);
    httpServer.listen(7777);
    console.log('OAuth server login by: gustavorteuber!');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App();
app.start().catch((error) => {
  console.error('Um ou mais serviços não se conectaram:', error);
});

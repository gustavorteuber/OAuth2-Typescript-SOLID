import { type Request, type Response } from 'express';
import { type IHttpServer } from '../infra/http/IHttpServer';
import { ApiThrowErrors } from '../helpers/apiThrowErrors';
import { generateClientToken } from '../algorithms/generateClientToken';
import { generateRandomClientSecret } from '../algorithms/generateRandomClientSecret';
import { type AuthService } from '../services/oAuthServices';
import { type IJwt } from '../infra/cryptography/IJwt';
import { generateRandomToken } from '../algorithms/generateRandomToken';

export default class HttpController {
  constructor (
    private readonly httpServer: IHttpServer,
    private readonly authService: AuthService,
    private readonly jwtService: IJwt // Inclua o jwtService no construtor
  ) {
    httpServer.on('post', '/users', async (req: Request, res: Response) => {
      try {
        const { username, password } = req.body;
        const { user } = await authService.createUser(username, password);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const clientSecret = generateRandomClientSecret();
        const accessToken = generateClientToken(user.id, jwtService); // Use o jwtService aqui
        const refreshToken = generateRandomToken();

        res.json({ user, accessToken, refreshToken });
      } catch (error) {
        console.log(error);
        throw new ApiThrowErrors('Erro ao criar usuário ou token', 500);
      }
    });

    httpServer.on('post', '/users/update-password', async (req: Request, res: Response) => {
      try {
        const { userId, newPassword } = req.body;
        await authService.updatePassword(userId, newPassword);
        const token = generateClientToken(userId, jwtService);

        res.json({ message: 'Senha atualizada com sucesso!', token });
      } catch (error) {
        throw new ApiThrowErrors('Erro ao atualizar a senha do usuário', 500);
      }
    });

    httpServer.on('post', '/login', async (req: Request, res: Response) => {
      try {
        const { username, password } = req.body;
        const { accessToken } = await authService.login(username, password);

        res.json({ accessToken });
      } catch (error) {
        throw new ApiThrowErrors('Usuário não autorizado', 401);
      }
    });
  }
}

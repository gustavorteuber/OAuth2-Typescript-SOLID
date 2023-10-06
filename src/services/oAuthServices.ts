import { type UserRepository } from '../repositories/userAuthRepository';
import { type RevokedTokenRepository } from '../repositories/revokedTokenRepository';
import { generateRandomToken } from '../algorithms/generateRandomToken';
import { ApiThrowErrors } from '../helpers/apiThrowErrors';
import { type IHash } from '../infra/cryptography/IHash';
import { type IJwt } from '../infra/cryptography/IJwt';

export class AuthService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly revokedTokenRepository: RevokedTokenRepository,
    private readonly bcryptService: IHash,
    private readonly jwtService: IJwt
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async login (username: string, password: string) {
    const user = await this.userRepository.findUserByUsername(username);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user) {
      throw new ApiThrowErrors('Usuário não encontrado', 404);
    }

    // Busque o token de acesso do usuário pelo userId
    const accessToken = await this.userRepository.findAccessTokenByUserId(user.id);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!accessToken) {
      throw new ApiThrowErrors('Token de acesso não encontrado', 404);
    }

    const isAccessTokenRevoked = await this.revokedTokenRepository.isRevoked(accessToken.token);

    if (isAccessTokenRevoked) {
      throw new ApiThrowErrors('O Token está revogado!', 401);
    }

    const isPasswordValid = await this.bcryptService.comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new ApiThrowErrors('Senha incorreta', 401);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const generatedAccessToken = this.generateAccessToken(user.id);

    return {
      user,
      accessToken
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async createUser (username: string, password: string) {
    const hashedPassword = await this.bcryptService.hashPassword(password, 10);
    const user = await this.userRepository.createUser(username, hashedPassword);

    let client = await this.userRepository.findClientByClientId(user.id.toString());

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!client) {
      const clientSecret = generateRandomToken();
      client = await this.userRepository.createClient(user.id.toString(), clientSecret);
    }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = generateRandomToken();

    await this.userRepository.createAccessToken(accessToken, user.id, client.id, refreshToken);

    return {
      user,
      refreshToken,
      client,
      expiredAt: new Date(),
      accessToken
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async updatePassword (userId: number, newPassword: string) {
    const hashedPassword = await this.bcryptService.hashPassword(newPassword, 10);
    await this.userRepository.updateUserPassword(userId, hashedPassword);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private generateAccessToken (userId: number) {
    const secret = 'garuvosecret';
    const token = this.jwtService.sign({ userId }, secret, { expiresIn: '1h' });
    return token;
  }
}

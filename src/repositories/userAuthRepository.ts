import { PrismaClient, type User, type OAuthClient, type AccessToken } from '../../prisma/generated/client';

const prisma = new PrismaClient();

export class UserRepository {
  async createUser (username: string, hashedPassword: string): Promise<User> {
    return await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
  }

  async findUserById (userId: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId }
    });
  }

  async findUserByUsername (username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username }
    });
  }

  async findAccessTokenByUserId (userId: number): Promise<AccessToken | null> {
    return await prisma.accessToken.findFirst({
      where: {
        userId
      }
    });
  }

  async updateUserPassword (userId: number, newPassword: string): Promise<User | null> {
    return await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }
    });
  }

  async findClientByClientId (clientId: string): Promise<OAuthClient | null> {
    return await prisma.oAuthClient.findUnique({
      where: { clientId }
    });
  }

  async createClient (clientId: string, clientSecret: string): Promise<OAuthClient> {
    return await prisma.oAuthClient.create({
      data: {
        clientId,
        clientSecret
      }
    });
  }

  async createAccessToken (token: string, userId: number, clientId: number, refreshToken: string): Promise<AccessToken> {
    return await prisma.accessToken.create({
      data: {
        token,
        userId,
        clientId,
        refreshToken,
        expiresAt: new Date()
      }
    });
  }
}

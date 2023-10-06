import { PrismaClient } from '../../prisma/generated/client';

const prisma = new PrismaClient();

export class RevokedTokenRepository {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async add (token: string) {
    await prisma.accessToken.update({
      where: {
        token
      },
      data: {
        revoked: true
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async isRevoked (token: string) {
    const accessToken = await prisma.accessToken.findUnique({
      where: {
        token
      }
    });

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return accessToken?.revoked ?? false;
  }
}

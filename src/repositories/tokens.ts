import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAccessToken(token: string) {
  const storedToken = await prisma.accessToken.findFirst({
    where: { token },
    include: {
      user: true,
    }
  });
  return storedToken;
}

export async function getRefreshToken(token: string) {
  const storedToken = await prisma.refreshToken.findFirst({
    where: { token },
    include: {
      user: true,
    }
  });
  return storedToken;
}

export async function deleteRefreshToken(token: string) {
  await prisma.refreshToken.deleteMany({
    where: {
      token
    }
  });
}

export async function storeTokens(user: User, accessToken:string, refreshToken:string, expiresAt: Date) {

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      accessTokens: {
        create: {
          token: accessToken,
          expiresAt
        }
      },
      refreshTokens: {
        create: {
          token: refreshToken,
          expiresAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000) // one day
        }
      }
    }
  });
}
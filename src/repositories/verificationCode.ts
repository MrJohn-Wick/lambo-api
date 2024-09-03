import { PrismaClient } from '@prisma/client';
import { getOnetimeCode } from '../utils/auth';
import { OnetimeCodeType } from '../types';

const prisma = new PrismaClient();

export async function createUserCode( userId: string, type: string) {
  if (type == OnetimeCodeType.PHONE) {
    await deleteUserCodes(userId, type);
  }

  const code = prisma.verificationCode.create({
    data: {
      code: getOnetimeCode(),
      type,
      user_id: userId
    }
  });

  return code;
}

export async function deleteUserCodes(userId: string, type?: string) {
  let where;
  if (type) {
    where = { 
      user_id: userId,
      type: type,
    };
  } else {
    where = { user_id: userId };
  }

  await prisma.verificationCode.deleteMany({
    where
  });
}

export async function getUserCodes(userId: string, type?: string) {
  let where;
  if (type) {
    where = { 
      user_id: userId,
      type: type,
    };
  } else {
    where = { user_id: userId };
  }

  const codes = prisma.verificationCode.findMany({
    where
  });

  return codes;
}

export async function getCode(id: string) {
  const code = prisma.verificationCode.findUnique({
    where: { id }
  });

  return code;
}

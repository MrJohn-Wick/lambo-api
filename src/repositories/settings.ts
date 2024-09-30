import { PrismaClient } from '@prisma/client';
import { UserSettingsDTO } from '../dtos/user';

const prisma = new PrismaClient();

export async function getSettings(userId: string): Promise<UserSettingsDTO> {
  const items = await prisma.userSettings.findMany({
    where: {
      user_id: userId
    }
  });

  let settings: UserSettingsDTO = new UserSettingsDTO({});

  items.forEach((item) => {
    if (Object.keys(settings).includes(item.key)) {
      settings[item.key as keyof UserSettingsDTO] = JSON.parse(item.value);
    }
  });

  return settings;
}

export async function setSetting(userId: string, key: string, value: string) {
  const item = await prisma.userSettings.upsert({
    where: {
      key_user_id: {
        key,
        user_id: userId
      }
    },
    update: {
      value
    },
    create: {
      key,
      value,
      user_id: userId
    }
  });
}

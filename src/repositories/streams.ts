import * as z from 'zod';
import { Prisma, PrismaClient, Stream } from "@prisma/client";
import { getProfileByUserId } from './profile';
import { VideoGrant } from 'livekit-server-sdk';
import { StreamEditSchema } from '../schemas/streams';
import { createLivekitToken, roomService } from '../utils/livekit';
import shortUUID from 'short-uuid';

const translator = shortUUID();

const prisma = new PrismaClient().$extends({
  result: {
    stream: {
      slug: {
        needs: { id: true },
        compute(stream) {
          return translator.fromUUID(stream.id);
        }
      }
    }
  }
});

interface StreamCreateParams {
  uid:string,
  cover?: string,
  title: string,
  description?: string,
  language: string,
  categories?: string[],
  price_type: 'ticket' | 'rate',
  price: number,
  start_now?: boolean,
  start_time?: string,
  duration?: number,
  charity?: number,
  invited?: string[],
  is_private?: boolean,
  comments_off?: boolean,
}

export async function getStreams(options: any): Promise<Stream[]> {
  const limit = options.limit;

  let where: Prisma.StreamWhereInput = {};
  if (options.search) {
    where = {
      OR: [
        {
          user: {
            profile: {
              username: {
                search: `${options.search}*`
              },
              firstname: {
                search: `${options.search}*`
              },
              lastname: {
                search: `${options.search}*`
              },
            }
          },
        },
        {
          title: {
            search: `${options.search}*`
          }
        }
      ]
    }
  }

  if (options.user_id) {
    where.user_id = options.user_id;
  }

  const streams = await prisma.stream.findMany({
    take: limit,
    orderBy: {
      created_at: 'desc'
    },
    where,
    include: {
      categories: true,
      user: {
        include: {
          profile: true,
        }
      },
    }
  });

  return streams;
}

export async function createStream({
    uid,
    cover,
    title,
    description,
    language,
    categories,
    price_type,
    price,
    start_now,
    start_time,
    duration,
    charity,
    invited,
    is_private,
    comments_off,
  }: StreamCreateParams) {
  const categoriesData = categories ? categories.map(c => ({ id: c })) : [];
  const invitedData = invited ? invited.map(i => ({ id: i })) : [];
  const createdStream = await prisma.stream.create({
    data: {
      cover,
      title,
      description,
      language,
      price_type,
      price,
      start_now,
      start_time,
      duration,
      charity,
      is_private,
      comments_off,
      user: {
        connect: { id: uid }
      },
      categories: {
        connect: categoriesData
      },
      invited: {
        connect: invitedData
      }
    }
  });

  return createdStream;
}

export async function getStream(id: string) {
  const stream = await prisma.stream.findFirst({
    where: { id },
    include: {
      categories: true,
      user: {
        include: {
          profile: true
        }
      }
    }
  });

  return stream;
}

export async function getStreamBySlug(slug: string) {
    const id = translator.toUUID(slug);

    return getStream(id);
}

export async function editStream(streamId: string, values: z.infer<typeof StreamEditSchema>) {
  const categoriesData = values.categories? values.categories.map(c => ({ id: c })) : undefined;
  const stream = await prisma.stream.update({
    where: { id: streamId },
    data: {
      cover: values.cover || undefined,
      title: values.title || undefined,
      categories: categoriesData ? { connect: categoriesData } : undefined,
    }
  });

  return stream
}

export async function getStreamToken(streamId: string, userId: string) {
  const stream = await getStream(streamId);
  const profile = await getProfileByUserId(userId);

  if (!stream?.room || !profile?.username) {
    return null;
  }

  const room = stream.room;
  const participant = profile.username;

  console.log(`Create token for ${stream.room} room to user ${profile.username} `)
  const grands: VideoGrant = (stream.user_id == userId) ? {
    room: room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  } : {
    room: room,
    roomJoin: true,
    canPublish: false,
    canSubscribe: true,
    canPublishData: true,
  }
  const token = await createLivekitToken(participant, grands);

  return token;
}

export async function createStreamRoom(stream: Stream) {
  const opts = {
    name: stream.title,
  };
  const room = await roomService.createRoom(opts);

  if (!room)
    return null;
  
  const updatedStream = await prisma.stream.update({
    where: { id: stream.id },
    data: {
      room: room.sid
    }
  });

  if (updatedStream) {
    return room.sid;
  }

  return null;
}

import { PrismaClient, Stream } from "@prisma/client";
import z from 'zod';
import { StreamEditSchema } from '../schemas/streams';
import { createRoom, createToken } from './livekit';
import { getProfileByUserId } from './profile';
import { VideoGrant } from 'livekit-server-sdk';

const prisma = new PrismaClient();


export async function getStreams(limit: number): Promise<Stream[]> {
  const options = {
    take: limit ? limit : undefined
  };

  console.log(options);
  const streams = await prisma.stream.findMany(options);

  return streams;
}

export async function createStream(userId:string, title: string, categories: string[], preview?: string) {
  const room = createRoom();
  const categoriesData = categories.map(c => ({ id: c }));
  const createdStream = await prisma.stream.create({
    data: {
      title,
      preview,
      room,
      user: {
        connect: { id: userId }
      },
      categories: {
        connect: categoriesData
      }

    }
  });

  return createdStream;
}

export async function getStream(id: string) {
  const stream = await prisma.stream.findFirst({
    where: { id }
  });

  return stream;
}

export async function editStream(streamId: string, values: z.infer<typeof StreamEditSchema>) {
  const categoriesData = values.categories? values.categories.map(c => ({ id: c })) : undefined;
  const stream = await prisma.stream.update({
    where: { id: streamId },
    data: {
      title: values.title || undefined,
      categories: categoriesData ? { connect: categoriesData } : undefined,
      preview: values.preview || undefined,
      user: values.user_id ? { connect: { id: values.user_id }} : undefined,
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
    roomAdmin: true,
    ingressAdmin: true,
  } : {
    room: room,
    roomJoin: true,
    canPublish: false,
  }
  const token = await createToken(userId, grands);

  return token;

}
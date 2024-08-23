import * as z from 'zod';
import { PrismaClient, Stream } from "@prisma/client";
import { createLivekitToken } from './livekit';
import { getProfileByUserId } from './profile';
import { VideoGrant } from 'livekit-server-sdk';
import { StreamEditSchema } from '../schemas/streams';

const prisma = new PrismaClient();

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

export async function getStreams(limit: number): Promise<Stream[]> {
  const streams = await prisma.stream.findMany({
    take: limit ? limit : undefined,
    orderBy: {
      created_at: 'desc'
    },
    include: {
      categories: true,
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
    }
  });

  return stream;
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
    roomAdmin: true,
    ingressAdmin: true,
  } : {
    room: room,
    roomJoin: true,
    canPublish: false,
  }
  const token = await createLivekitToken(participant, grands);

  return token;
}
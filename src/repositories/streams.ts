import { PrismaClient, Stream } from "@prisma/client";
import z from 'zod';
import { StreamEditSchema } from '../schemas/streams';

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
  const categoriesData = categories.map(c => ({ id: c }));
  const createdStream = await prisma.stream.create({
    data: {
      title,
      preview,
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
import { Gallery, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getGallery(id: string): Promise<Gallery | null> {
  const gallery = await prisma.gallery.findUnique({
    where: {
      id
    },
    include: {
      items: true
    }
  });

  return gallery;
}

export async function galleryAppendImages(id: string, keys: string[]): Promise<boolean> {
  try {
    await prisma.galleryItem.createMany({
      data: keys.map( (k) => ({key: k, gallery_id: id}) )
    });
    return true;
  } catch {
    return false;
  }
}

import { Gallery, GalleryItem, PrismaClient } from '@prisma/client';

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

export async function galleryAppendImages(id: string, keys: string[]): Promise<GalleryItem[] | null> {
  try {
    const items: GalleryItem[] = [];
    for (const key in keys) {
      const item = await prisma.galleryItem.create({
        data: {
          key: keys[key],
          gallery_id: id
        }
      });
      if (item) items.push(item);
    }
    return items;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getImage(id: string): Promise<GalleryItem | null> {
  try {
    const image = await prisma.galleryItem.findUnique({
      where: { id }
    });
    return image;
  } catch (err) {
    return null;
  }
}

export async function deleteImage(id: string): Promise<boolean> {
  try {
    await prisma.galleryItem.delete({
      where: { id }
    });
    return true;
  } catch {
    return false;
  }
}

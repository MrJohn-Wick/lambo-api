import { CategoryDTO } from './category';
import { UserDTO } from './user';

export class StreamDTO {
  id: string;
  cover: string;
  title: string;
  description: string;
  language: string;
  categories: CategoryDTO[];
  price_type: string;
  price: number;
  start_now: boolean;
  start_time: string;
  duration: number;
  charity: number;
  is_private: boolean;
  comments_off: boolean;
  room: string;
  slug: string;
  user: UserDTO;

  constructor(data: any = null) {
    this.id = data.id;
    this.cover = data?.cover ?? null;
    this.title = data.title;
    this.description = data?.description ?? null;
    this.language = data.language;
    this.categories = data?.categories ?? [];
    this.price_type = data?.price_type ?? 'ticket';
    this.price = data?.price ?? 0;
    this.start_now = data?.start_now ?? false;
    this.start_time = data?.start_time ?? null;
    this.duration = data?.duration ?? null;
    this.charity = data?.charity ?? null;
    this.is_private = data?.is_private ?? false;
    this.comments_off = data?.comments_off ?? false;
    this.room = data?.room ?? null;
    this.slug = data.slug;
    this.user = new UserDTO(data.user)
  }
}

export type StreamsDTO = StreamDTO[];
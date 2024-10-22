export class ProfileDTO {
  id?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
  location?: string;  
  avatar?: string;
  gallery_id?: string | null;
  created_at: string;
  description: string;

  constructor(data: any = null) {
    this.id = data?.userId;
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.birthday = data?.birthday;
    this.location = data?.location;
    this.avatar = data?.avatar;
    this.gallery_id = data?.gallery ? data.gallery.id : null;
    this.created_at = data?.created_at;
    this.description = data?.description;
  }
}

export class ProfileExploreDTO {
  id?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
  location?: string;  
  avatar?: string;
  created_at: string;
  description?: string;

  constructor(data: any = null) {
    this.id = data?.userId;
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.birthday = data?.birthday;
    this.location = data?.location;
    this.avatar = data?.avatar;
    this.created_at = data?.created_at;
    this.description = data?.description;
  }
}

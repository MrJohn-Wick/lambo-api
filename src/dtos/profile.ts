export class ProfileDTO {
  user_id?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
  location?: string;  
  avatar?: string;
  gallery_id: string | null;

  constructor(data: any = null) {
    this.user_id = data?.user_id;
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.birthday = data?.birthday;
    this.location = data?.location;
    this.avatar = data?.avatar;
    this.gallery_id = data.gallery ? data.gallery.id : null;
  }
}

export class ProfileExploreDTO {
  user_id?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
  location?: string;  
  avatar?: string;

  constructor(data: any = null) {
    this.user_id = data?.user_id;
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.birthday = data?.birthday;
    this.location = data?.location;
    this.avatar = data?.avatar;
  }
}

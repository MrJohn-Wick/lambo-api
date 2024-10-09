export class ProfileDTO {
  username?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
  location?: string;  
  avatar?: string;

  constructor(data: any = null) {
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.birthday = data?.birthday;
    this.location = data?.location;
    this.avatar = data?.avatar;
  }
}

export class ProfileExploreDTO {
  username?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string;
  location?: string;  
  avatar?: string;

  constructor(data: any = null) {
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.birthday = data?.birthday;
    this.location = data?.location;
    this.avatar = data?.avatar;
  }
}

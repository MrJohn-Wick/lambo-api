import { ProfileDTO } from './profile';

export class UserSettingsDTO {
  notifications: boolean;
  dark: boolean;
  tfa: boolean;
  incognito: boolean;

  constructor(data: any) {
    this.notifications = data?.notifications || false;
    this.dark = data?.dark || false;
    this.tfa = data?.tfs || false;
    this.incognito = data?.incognito || false;
  }
}

export class UserMetricsDTO {
  subscriptions: string[];
  subscribed: string[];

  constructor(data: any) {
    this.subscriptions = data?.subscriptions;
    this.subscribed = data?.subscribed;
  }
}

export class UserDTO {
  id: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  password: boolean;
  profile?: ProfileDTO | null;
  metrics: UserMetricsDTO | null;
  settings: UserSettingsDTO | null;

  constructor (data: any = null) {
    this.id = data?.id;
    this.email = data?.email;
    this.emailVerified = data?.emailVerified;
    this.phone = data?.phone;
    this.phoneVerified = data?.phoneVerified;
    this.password = !!data?.passwordHash;
    this.profile = data?.profile ? new ProfileDTO(data.profile) : null;
    this.metrics = data?.metrics ? new UserMetricsDTO(data.metrics): null;
    this.settings = data?.settings ? new UserSettingsDTO(data.settings): null;
  }
}

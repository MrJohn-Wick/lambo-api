import bcrypt from 'bcryptjs';
import { GrantIdentifier, OAuthUserRepository } from "@jmondi/oauth2-server";
import { PrismaClient } from "@prisma/client";

import { Client } from "../entities/client.js";
import { User } from "../entities/user.js";

export class UserRepository implements OAuthUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserByCredentials(
    identifier: string,
    password?: string,
    _grantType?: GrantIdentifier,
    _client?: Client,
  ): Promise<User> {
    const user = new User(
      await this.prisma.user.findUniqueOrThrow({
        where: { email: identifier },
      }),
    );

    // verity password and if user is allowed to use grant, etc...
    if (password) await user.verify(password);

    return user;
  }

  async getUserById(id: User['id']): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (user) 
      return new User(user);
    return null;
  }

  async getUserWithProfile(id: User['id']): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { Profile: true }
    });
    if (user) 
      console.log(user);
      return {
        id: user?.id,
        email: user?.email,
        firstnane: user?.Profile?.firstname,
        lastname: user?.Profile?.lastname,
        birthday: user?.Profile?.birthday,
      };
    return null;
  }

  async registerNewUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash
      }
    });
    if (user) return new User(user);
    return null;
  }
}

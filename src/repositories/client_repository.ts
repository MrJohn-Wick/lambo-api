import { PrismaClient } from "@prisma/client";
import { GrantIdentifier, OAuthClient, OAuthClientRepository } from "@jmondi/oauth2-server";

import { Client } from "../entities/client.js";

export class ClientRepository implements OAuthClientRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getByIdentifier(clientId: string): Promise<Client> {
    return new Client(
      await this.prisma.oAuthClient.findUniqueOrThrow({
        where: {
          id: clientId,
        },
        include: {
          scopes: true,
        },
      }),
    );
  }

  async isClientValid(grantType: GrantIdentifier, client: OAuthClient, clientSecret?: string): Promise<boolean> {
    if (client.secret && client.secret !== clientSecret) {
      return false;
    }
    return client.allowedGrants.includes(grantType);
  }
}

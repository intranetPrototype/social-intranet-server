import { AggregateRoot } from "@nestjs/cqrs";
import { UserRole } from "@prisma/client";

export class Auth extends AggregateRoot {

  constructor(
    private readonly id: string,
    private readonly hash: string,
    private readonly email: string,
    private readonly role: UserRole,
    private readonly hashedRt: string,
    private readonly createdAt: string,
    private readonly updatedAt: string,
    private readonly confirmed: boolean
  ) {
    super();
  }

  getId(): string {
    return this.id;
  }

  getHash(): string {
    return this.hash;
  }

  getEmail(): string {
    return this.email;
  }

  getRole(): UserRole {
    return this.role;
  }

  getHashedRt(): string {
    return this.hashedRt;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  getConfirmed(): boolean {
    return this.confirmed;
  }

}
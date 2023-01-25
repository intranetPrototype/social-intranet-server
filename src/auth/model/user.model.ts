import { AggregateRoot } from "@nestjs/cqrs";
import { UserRole } from "@prisma/client";
import { User as DbUser } from '@prisma/client';
import { Exclude } from "class-transformer";

export class User extends AggregateRoot {

  private readonly id: number;

  @Exclude()
  private readonly hash: string;

  private readonly email: string;

  @Exclude()
  private readonly createdAt: Date;

  @Exclude()
  private readonly updatedAt: Date;

  private readonly role: UserRole[];

  @Exclude()
  private readonly hashedRt: string;

  private readonly confirmed: boolean;

  constructor({ id, hash, email, role, hashedRt, createdAt, updatedAt, confirmed }: DbUser) {
    super();

    this.id = id;
    this.hash = hash;
    this.role = role;
    this.email = email;
    this.hashedRt = hashedRt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.confirmed = confirmed;
  }

  getId(): number {
    return this.id;
  }

  getHash(): string {
    return this.hash;
  }

  getRole(): UserRole[] {
    return this.role;
  }

  getEmail(): string {
    return this.email;
  }

  getHashedRt(): string {
    return this.hashedRt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getConfirmed(): boolean {
    return this.confirmed;
  }
}
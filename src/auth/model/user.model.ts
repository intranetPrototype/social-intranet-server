import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { UserRole } from "@prisma/client";
import { User as DbUser } from '@prisma/client';
import { Exclude } from "class-transformer";

export class User extends AggregateRoot {

  @ApiProperty({
    description: 'User id',
    default: 1
  })
  private readonly id: number;

  @Exclude()
  private readonly hash: string;

  @ApiProperty({
    description: 'User first name',
    default: 'John'
  })
  private readonly firstName: string;

  @ApiProperty({
    description: 'User last name',
    default: 'Doe'
  })
  private readonly lastName: string;

  @ApiProperty({
    description: 'User email',
    default: 'user@email.de'
  })
  private readonly email: string;

  @Exclude()
  private readonly createdAt: Date;

  @Exclude()
  private readonly updatedAt: Date;

  @ApiProperty({
    description: 'User roles',
    default: [UserRole.STANDARD]
  })
  private readonly role: UserRole[];

  @Exclude()
  private readonly hashedRt: string;

  @ApiProperty({
    description: 'Has user confirmed registration',
    default: false
  })
  private readonly confirmed: boolean;

  constructor({ id, hash, firstName, lastName, email, role, hashedRt, createdAt, updatedAt, confirmed }: DbUser) {
    super();

    this.id = id;
    this.hash = hash;
    this.role = role;
    this.email = email;
    this.hashedRt = hashedRt;
    this.lastName = lastName;
    this.firstName = firstName;
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

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
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
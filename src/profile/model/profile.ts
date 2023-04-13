import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Profile as DbProfile, User as DbUser, UserRole } from "@prisma/client";
import { Exclude } from "class-transformer";
import { User } from "src/auth/model";

export class Profile extends AggregateRoot {

  @ApiProperty({
    description: 'User',
    default: {
      userId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@email.de',
      role: [UserRole.STANDARD],
      confirmed: true
    }
  })
  private readonly user: User;

  @ApiProperty({
    description: 'City',
    default: 'Stuttgart'
  })
  private readonly city: string;

  @ApiProperty({
    description: 'UserId',
    default: 1
  })
  private readonly userId: number;

  @ApiProperty({
    description: 'Street',
    default: 'Theodor-Heuss-Straße 1'
  })
  private readonly street: string;

  @ApiProperty({
    description: '',
    default: new Date()
  })
  private readonly birthDate: Date;

  @ApiProperty({
    description: 'PostCode',
    default: '70173'
  })
  private readonly postCode: string;

  @ApiProperty({
    description: 'Description',
    default: 'Test Beschreibung'
  })
  private readonly description: string;


  @ApiProperty({
    description: 'Path to cover-photo',
    default: 'file-server/cover-photo.jpg'
  })
  private readonly coverPhoto: string;

  @ApiProperty({
    description: 'Path to profile-picture',
    default: 'file-server/profile-picture.jpg'
  })
  private readonly profilePicture: string;

  constructor({ city, userId, street, birthDate, postCode, description, coverPhoto, profilePicture }: DbProfile, user?: DbUser) {
    super();

    if (user) {
      this.user = new User(user);
    }

    this.city = city;
    this.userId = userId;
    this.street = street;
    this.birthDate = birthDate;
    this.postCode = postCode;
    this.description = description;
    this.coverPhoto = coverPhoto;
    this.profilePicture = profilePicture;
  }

  getUser(): User {
    return this.user;
  }

  getCity(): string {
    return this.city;
  }

  getUserId(): number {
    return this.userId;
  }

  getStreet(): string {
    return this.street;
  }

  getBirthDate(): Date {
    return this.birthDate;
  }

  getPostCode(): string {
    return this.postCode;
  }

  getCoverPhoto(): string {
    return this.coverPhoto;
  }

  getProfilePicture(): string {
    return this.profilePicture;
  }

}
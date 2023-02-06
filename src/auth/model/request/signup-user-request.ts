import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class SignupUserRequest {
  @ApiProperty({
    description: 'First name of the registered user',
    default: 'John'
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the registered user',
    default: 'Doe'
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email of the registered user',
    default: 'new-user@email.de'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the registered user',
    default: 'password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
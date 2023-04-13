import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateProfileUserDto {
  @ApiProperty({
    description: 'FirstName',
    default: 'John'
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'FirstName',
    default: 'Doe'
  })
  @IsNotEmpty()
  lastName: string;
}
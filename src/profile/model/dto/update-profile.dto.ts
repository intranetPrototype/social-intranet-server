import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty({
    description: 'BirthDate',
    default: new Date()
  })
  @IsOptional()
  birthDate: Date;

  @ApiProperty({
    description: 'Description',
    default: 'Test description'
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Street',
    default: 'Theodor-Heuss-Straße 1'
  })
  @IsOptional()
  street: string;

  @ApiProperty({
    description: 'PostCode',
    default: '70173'
  })
  @IsOptional()
  postCode: string;

  @ApiProperty({
    description: 'City',
    default: 'Street'
  })
  @IsOptional()
  city: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Matches } from 'src/decorators/matches.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password should be atleast 8 characters long',
  })
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @Matches('password', {
    message: 'Password does not match',
  })
  @ApiProperty()
  confirmPassword: string;
}

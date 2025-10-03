import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * user firstname
   */
  @ApiProperty({
    description: 'user firstname',
    example: 'favour',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstname: string;

  /**
   * user lastname
   */
  @ApiProperty({
    description: 'user lastname',
    example: 'ejim',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  lastname: string;

  /**
   * user email
   */
  @ApiProperty({
    description: 'user email',
    example: 'favour@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  /**
   * user password
   */
  @ApiProperty({
    description: 'user password',
    example: 'favour@Ejim1',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Minimum eigt characters, atleast one letter, number and special character',
  })
  password: string;
}

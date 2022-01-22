import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  text: string;
}

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  postId: number;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  comment: string;
}

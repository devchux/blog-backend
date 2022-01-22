import {
  Controller,
  UseGuards,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createComment(@Body() content: CreateCommentDto) {
    return this.commentService.createComment(content.postId, {
      text: content.comment,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  updateComment(@Param('id') id: number, @Body() content: CreateCommentDto) {
    return this.commentService.editComment(id, content.postId, {
      text: content.comment,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  deleteComment(@Param('id') id: number, @Body('postId') postId: number) {
    return this.commentService.deleteComment(id, postId);
  }
}

import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { CommentDto } from './dto/createComment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createComment(
    postId: number,
    comment: CommentDto,
  ): Promise<Comment> {
    try {
      const post = await this.postRepository.findOneOrFail(postId);
      const newComment: Comment = await this.commentRepository.create({
        ...comment,
        post,
        user: this.req.user,
      });

      return this.commentRepository.save(newComment);
    } catch (error) {
      throw new NotFoundException('Post cannot be found');
    }
  }

  async editComment(
    id: number,
    postId: number,
    editedComment: CommentDto,
  ) {
    try {
      const comment = await this.commentRepository.findOneOrFail({
        where: {
          id,
          user: {
            id: postId,
          },
        },
      });
      if (comment.user !== this.req.user)
        throw new UnauthorizedException('You can not edit this comment');
      return this.commentRepository.update(comment, {
        ...comment,
        text: editedComment.text || comment.text,
      });
    } catch (error) {
      throw new NotFoundException('Comment cannot be found');
    }
  }

  async deleteComment(id: number, postId: number) {
    try {
      const comment = await this.commentRepository.findOneOrFail({
        where: {
          id,
          user: {
            id: postId,
          },
        },
      });
      if (comment.user !== this.req.user)
        throw new UnauthorizedException('You cannot delete this comment');
      this.commentRepository.remove(comment);
      return { message: 'Comment has successfully been deleted' };
    } catch (error) {
      throw new NotFoundException('Comment cannot be found');
    }
  }
}

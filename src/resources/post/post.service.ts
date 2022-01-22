import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createPost(postData: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create({
      ...postData,
      author: this.req.user,
    });
    const savePost = await this.postRepository.save(post);

    return savePost;
  }

  async editPost(id: number, editedPost: CreatePostDto) {
    try {
      const post = await this.postRepository.findOneOrFail(id);
      if (post?.author !== this.req.user)
        throw new UnauthorizedException(
          'You are not allowed to edit this post',
        );
      return this.postRepository.update(post, {
        ...post,
        title: editedPost.title || post.title,
        body: editedPost.body || post.body,
      });
    } catch (error) {
      throw new NotFoundException('Post cannot be found');
    }
  }

  async deletePost(id: number): Promise<{
    message: string;
  }> {
    try {
      const post = await this.postRepository.findOneOrFail({
        where: { id },
      });
      if (post?.author !== this.req.user)
        throw new UnauthorizedException(
          'You are not allowed to delete this post',
        );
      post.remove();
      return { message: 'Post has been deleted' };
    } catch (error) {
      throw new NotFoundException('Post cannot be found');
    }
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['author', 'comments'],
    });
  }

  async getPost(id: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOneOrFail(id);
      return post;
    } catch (error) {
      throw new NotFoundException('Post cannot be found');
    }
  }
}

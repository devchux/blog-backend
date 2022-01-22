import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/createPost.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPost(@Body() postData: CreatePostDto) {
    return this.postService.createPost(postData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updatePost(@Param('id') id: number, @Body() editedPost: CreatePostDto) {
    return this.postService.editPost(id, editedPost);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(+id);
  }

  @Get()
  fetchAllPosts() {
    return this.postService.getAllPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  fetchPost(@Param('id') id: number) {
    return this.postService.getPost(id);
  }
}

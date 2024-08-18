import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpStatus,
  UsePipes,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommentPipe, CommentsValid } from './commentsValid';
import { CommentsService } from './comments.service';
import { CommentEntity } from 'src/utils/entities/comment.entity';
import { CommentBase } from 'src/swagger/comments.dto';
import { CanEditCommentGuard } from './comments.guard';

@ApiTags('Get comments')
@Controller('users')
export class getAllComments {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':userId/columns/:columnId/cards/:cardId/comments')
  @ApiOperation({ summary: 'Get comment with user ID and Card ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CommentBase,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async findAll(
    @Param('userId') userId: number,
    @Param('cardId') cardId: number,
  ): Promise<CommentEntity[] | void> {
    const comments = await this.commentsService.findAll(userId, cardId);

    if (!comments) {
      throw new NotFoundException(`Comments with user ID ${userId} not found`);
    }
    return comments;
  }
}

@ApiTags('Get comment')
@Controller('users')
export class getCommentById {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':userId/columns/:columnId/cards/:cardId/comments/:id')
  @UseGuards(CanEditCommentGuard)
  @ApiOperation({
    summary: 'Get comment with specified ID',
  })
  async findAll(
    @Param('commentId') id: number,
  ): Promise<CommentEntity | void> {
    const comment = await this.commentsService.findCommentById(id);

    if (!comment) {
      throw new NotFoundException(
        `Comment with user ID ${id} not found`,
      );
    } else {
      return comment;
    }
  }
}

@ApiTags('Create comment')
@Controller('users')
@UsePipes(new CommentPipe())
export class createComment {
  constructor(private readonly commentsService: CommentsService) {}
  @Post('/columns/cards/comments')
  @ApiOperation({
    summary:
      'Create Comment with user ID and column ID and card ID and specified ID ',
  })
  @ApiBody({
    type: CommentBase,
    description: 'Comment data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CommentBase,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async create(
    @Body() createCommentDto: CommentsValid,
  ): Promise<CommentEntity> {
    return this.commentsService.createNewComment(createCommentDto);
  }
}

@ApiTags('Update comment')
@Controller('users')
@UsePipes(new CommentPipe())
export class updateComment {
  constructor(private readonly commentsService: CommentsService) {}
  @Patch('/columns/cards/comments')
  @UseGuards(CanEditCommentGuard)
  @ApiOperation({
    summary: 'Update Comment with specified ID ',
  })
  @ApiBody({
    type: CommentBase,
    description: 'Comment data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CommentBase,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async update(
    @Body() updateCommentDto: CommentEntity,
  ): Promise<CommentEntity> {
    return this.commentsService.updateComment(updateCommentDto);
  }
}

@ApiTags('Delete comment')
@Controller('users')
export class deleteComment {
  constructor(private readonly commentsService: CommentsService) {}
  @Delete(':userId/columns/:coulmnId/cards/:cardId/comments/:commentId')
  @UseGuards(CanEditCommentGuard)
  @ApiOperation({ summary: 'Delete Comment with user ID and specified ID' })
  @ApiBody({
    type: CommentBase,
    description: 'Comment data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async delete(
    @Param('userId') userId: number,
    @Param('cardId') cardId: number,
    @Param('commentId') id: number,
  ): Promise<string> {
    return this.commentsService.deleteComment(id, userId, cardId);
  }
}

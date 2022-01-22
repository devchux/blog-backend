import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Comment } from 'src/resources/comment/entities/comment.entity';
import { Post } from 'src/resources/post/entities/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  fullName: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  @IsString()
  description?: string;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  password: string;

  @Column({
    default: true,
  })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author, { cascade: true, eager: true })
  @JoinColumn({ name: 'posts' })
  public posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  public comments: Comment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcryptjs.hash(this.password, 10);
  }

  async validatePassword(password): Promise<boolean> {
    const isValid = await bcryptjs.compare(password, this.password);
    return isValid;
  }
}

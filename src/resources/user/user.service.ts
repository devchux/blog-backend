import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { signupValidator } from 'src/helpers/validator';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserSignUpDto } from './dto/userSignup.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createUser(data: UserSignUpDto) {
    const inputIsValid: boolean = signupValidator(data);
    if (!inputIsValid) throw new BadRequestException('Fill required fields');
    const validUserDetails = Object.assign({}, data, {
      confirmPassword: undefined,
    });
    const userFoundByEmail = await this.userRepository.findOne({
      where: {
        email: validUserDetails.email,
      },
    });

    const userFoundByUsername = await this.userRepository.findOne({
      where: {
        username: validUserDetails.username,
      },
    });

    if (userFoundByEmail || userFoundByUsername)
      throw new BadRequestException('User already exists');
    const newUser = this.userRepository.create(validUserDetails);
    const result = await this.userRepository.save(newUser);
    delete result.password;

    return result;
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['posts', 'comments'],
    });
  }

  getUserByUserName(username: string): Promise<User> {
    try {
      const user = this.userRepository.findOneOrFail({
        where: {
          username,
        },
      });
      return user;
    } catch (error) {
      throw new NotFoundException('User does not exists');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      throw new NotFoundException('User does not exists');
    }
  }

  async deleteUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email,
        },
      });
      user.remove();
      return { message: 'User has been deleted' };
    } catch (error) {
      throw new NotFoundException('User does not exist');
    }
  }

  async updateUser(id: number, credentials: UserSignUpDto) {
    try {
      const user = await this.userRepository.findOneOrFail({ id });
      const username = credentials.username || user.username;
      const description = credentials.description || user.description;
      const fullname = credentials.fullName || user.fullName;
      const email = credentials.email || user.email;

      const updatedUser = {
        username,
        description,
        fullname,
        email,
      };

      return this.userRepository.update(user, updatedUser);
    } catch (error) {
      throw new NotFoundException('User does not exist');
    }
  }

  async deactivateUser(id: number) {
    try {
      const user = await this.userRepository.findOneOrFail({ id });
      const updatedUser = { ...user, isActive: false };

      return this.userRepository.update(user, updatedUser);
    } catch (error) {
      throw new NotFoundException('User does not exist');
    }
  }

  async activateUser(id: number) {
    try {
      const user = await this.userRepository.findOneOrFail({ id });
      const updatedUser = { ...user, isActive: true };

      return this.userRepository.update(user, updatedUser);
    } catch (error) {
      throw new NotFoundException('User does not exist');
    }
  }

  async uploadProfileImage(file: Express.Multer.File) {
    const buffer = await this.cloudinaryService.resizeImage(file);
    return this.cloudinaryService
      .uploadImage(buffer)
      .catch((error) => {
        console.log(error);
        throw new BadRequestException('Invalid file type.');
      })
      .then((updloadedFile) => console.log(updloadedFile));
  }
}

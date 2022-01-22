import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Type } from '@nestjs/common/interfaces/type.interface';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object: any = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.error(errors);
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

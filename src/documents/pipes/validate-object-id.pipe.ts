import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.trim() === '') {
      throw new BadRequestException('ID parameter is required');
    }

    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      );
    if (!isUUID) {
      throw new BadRequestException('Invalid ID format. Expected UUID.');
    }

    return value;
  }
}

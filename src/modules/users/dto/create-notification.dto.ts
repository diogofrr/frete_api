import { IsNotEmpty } from 'class-validator';
import { ImageNotificationEnum } from '../enum/image-notification.enum';

export class CreateNotificationDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  image: ImageNotificationEnum;
}

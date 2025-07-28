import { IsNumber } from 'class-validator';

export class NotificationDto {
  @IsNumber()
  id: number;

  @IsNumber()
  notificationTime: number;

  constructor(id: number, notificationTime: number) {
    this.id = id;
    this.notificationTime = notificationTime;
  }
}
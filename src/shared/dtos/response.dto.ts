/* eslint-disable @typescript-eslint/ban-types */
import { IsObject } from 'class-validator';

export class ResponseDTO<T> {
  /**
   * List or single item
   */
  @IsObject()
  data: T | T[];

  /**
   * Metadata Object
   */
  @IsObject()
  meta?: object;

  /**
   * @param data List or single item
   * @param meta Metadata
   */
  constructor(data: T | T[], meta?: object) {
    this.data = data;
    this.meta = meta;
  }
}

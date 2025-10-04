import { Injectable } from '@nestjs/common';

/**
 * hashing provider
 */
@Injectable()
export abstract class HashingProvider {
  /**
   * abstract method for hashing password
   * @param data
   */
  abstract hashPassword(data: string | Buffer): Promise<string>;

  /**
   * abstract method for comparing password
   * @param data
   * @param encrypted
   */
  abstract comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}

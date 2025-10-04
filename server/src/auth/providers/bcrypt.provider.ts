import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

/**
 * bcrypt provider
 */
@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * function for hashing user password
   * @param data
   * @returns hashed password
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    // generate salt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  /**
   * function for comparing password
   * @param data
   * @param encrypted
   * @returns a boolean that indicates whether it is same password or not
   */
  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}

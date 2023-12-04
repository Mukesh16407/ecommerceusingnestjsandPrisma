import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';

  import { AuthServiceInputException } from 'src/auths/exceptions/auth-service-input.exception';
  import { ExceptionHandler } from './exception.handler';
import { UserServiceInputException } from 'src/models/users/exceptions/user-service-input.exception';
  
  /** Catches user input errors and throws the
   * respective HTTP error
   */
  export class UserInputExceptionHandler implements ExceptionHandler {
    /** Catches user input errors and throws the
     * respective HTTP error
     */
    handle(error: Error): void {
      if (error instanceof AuthServiceInputException) {
        throw new UnauthorizedException(error.message);
      }
  
      if (error instanceof UserServiceInputException) {
        throw new BadRequestException(error.message);
      }
  
    
    }
  }
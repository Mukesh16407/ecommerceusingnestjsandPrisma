import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaError } from 'prisma-error-enum';

import { ProductNameInUseException } from 'src/common/exceptions/product/product-name-in-use.exception';
import { ProductNotFoundException } from 'src/common/exceptions/product/product-not-found.exception';
import { EmailInUseException } from 'src/common/exceptions/user/email-in-use.exception';
import { UserNotFoundException } from 'src/common/exceptions/user/user-not-found.exception';
import { ExceptionHandler } from './exception.handler';

/** Catches Prisma ORM errors and throws the
 * respective HTTP error
 */
export class PrismaExceptionHandler implements ExceptionHandler {
  /** Catches Prisma ORM errors and throws the
   * respective HTTP error
   */
  handle(error: Error): void {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation:
          if (this.isEmailConstraintViolation(error.meta)) {
            throw new EmailInUseException();
          }

          if (this.isProductNameConstraintViolation(error)) {
            throw new ProductNameInUseException();
          }

        
          break;

        case PrismaError.ForeignConstraintViolation:
          if (this.isPurchaseError(error)) {
            throw new ProductNotFoundException();
          }
          break;

        case PrismaError.RecordsNotFound:
          if (this.isUserError(error)) {
            throw new UserNotFoundException();
          }

          if (this.isProductError(error)) {
            throw new ProductNotFoundException();
          }
          break;

        default:
          throw error;
      }
    }

    if (this.isPrismaUnknownError(error)) {
      if (error.message === 'No Product found') {
        throw new ProductNotFoundException();
      }

     
    }
  }

  /** Checks if the error contains clientVersion,
   * making it an unknown prisma error
   * */
  private isPrismaUnknownError(error): boolean {
    return !!error.clientVersion;
  }

  /** Returns wether the error happened in the email field or not */
  private isEmailConstraintViolation(errorMeta: object): boolean {
    return Object.values(errorMeta)[0][0] === 'email';
  }

  /** Returns wether the error happened in the product name field or not */
  private isProductNameConstraintViolation(
    error: PrismaClientKnownRequestError,
  ): boolean {
    return (
      (Object.values(error.meta)[0][0] === 'name' ||
        Object.values(error.meta)[0][0] === 'urlName') &&
      error.message.includes('prisma.product')
    );
  }

  /** Returns wether the error happened in the category name field or not */
  private isCategoryNameConstraintViolation(
    error: PrismaClientKnownRequestError,
  ): boolean {
    return (
      Object.values(error.meta)[0][0] === 'name' &&
      error.message.includes('prisma.category')
    );
  }

  /** Returns wether the error happened on an user prisma query or not */
  private isUserError(error: PrismaClientKnownRequestError): boolean {
    return error.message.includes('prisma.user');
  }

  /** Returns wether the error happened on an update or delete product prisma query or not */
  private isProductError(error: PrismaClientKnownRequestError): boolean {
    return (
      error.message.includes('prisma.product.update') ||
      error.message.includes('prisma.product.delete')
    );
  }

  /** Returns wether the error happened on an create product prisma query or not */
  private isCreateProductError(error: PrismaClientKnownRequestError): boolean {
    return error.message.includes('prisma.product.create');
  }

  /** Returns wether the error happened on an category prisma query or not */
  private isCategoryError(error: PrismaClientKnownRequestError): boolean {
    return error.message.includes('prisma.category');
  }

  /** Returns wether the error happened on an purchase prisma query or not */
  private isPurchaseError(error: PrismaClientKnownRequestError): boolean {
    return error.message.includes('prisma.purchase');
  }
}
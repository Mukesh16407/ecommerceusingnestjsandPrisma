
import { Prisma } from '@prisma/client';


export class Product implements Prisma.ProductUncheckedCreateInput {
  
  id?: string;
  name: string;
  urlName: string;
  picture?: string;
  basePrice: string | number | Prisma.Decimal;
  discountPercentage?: number;
  stock?: number;
  description?: string;
  createdAt?: string | Date;
}


  
 
  
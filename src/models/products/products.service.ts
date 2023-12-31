import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Product } from './entities/product.entity';
import { File } from './types/file';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

   /** Creates a new product */

 async create(createProductDto: CreateProductDto): Promise<Product> {
  const urlName = this.formatUrlName(createProductDto.name);

  const categories = this.connectCategoriesById(createProductDto.categories);
  

  const product = await this.prisma.product.create({
    data: {
      ...createProductDto,
      urlName,
      categories,
    },
    include: { categories: { select: { name: true } } },
  });
  
  return product;
  }

  /** Uploads new product picture */
  async uploadPicture(id: string, file: File): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { picture: file.filename },
    });
  }

  async findAll({
    productName = '',
    page = 1,
    offset = 10,
  }: FindProductsDto): Promise<Product[]> {
    const productsToSkip = (page - 1) * offset;

    return this.prisma.product.findMany({
      skip: productsToSkip,
      take: offset,
      where: {
        name: { contains: productName, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
      include: { categories: { select: { name: true } } },
    });
  }

  /** Find product by ID */
  async findOneById(id: string): Promise<Product |null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { categories: { select: { name: true } } },
      // rejectOnNotFound: true,
    });
  }

   /** Find product by Url Name */
   async findOneByUrlName(urlName: string): Promise<Product |null> {
  
    return this.prisma.product.findUnique({
      where: { urlName },
      include: { categories: { select: { name: true } } },
      // rejectOnNotFound: true,
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    
    if (updateProductDto.name) {
      return this.updateProductAndUrlName(id, updateProductDto);
    }

    return  
    // this.prisma.product.update({
    //   where: { id },
    //   data: { ...updateProductDto },
    // });
  }

/** Removes product from database */
async remove(id: string): Promise<void> {
  await this.prisma.product.delete({ where: { id } });
}

   /** Formats UrlName and updates the product with the new one.
   *
   * Used when the user updates the product name.
   */
   private updateProductAndUrlName(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const urlName = this.formatUrlName(updateProductDto.name);
    
    return 
    // this.prisma.product.update({
    //   where: { id },
    //   data: { ...updateProductDto, urlName },
    // });
  }


  private formatUrlName(name: string): string {
    const lowerCaseUrlName = name.toLocaleLowerCase();
    const trimmedUrlName = lowerCaseUrlName.trim();
    const singleSpaceUrlName = trimmedUrlName.replace(/\s\s+/g, ' ');
    const spaceToHyphenUrlName = singleSpaceUrlName.split(' ').join('-');

    return spaceToHyphenUrlName;
  }



  private connectCategoriesById(
    categories: string[],
  ): Prisma.CategoryUncheckedCreateNestedManyWithoutProductsInput{
   
    let categoriesConnection = { connect: [] };
  
    if (categories) {
      categoriesConnection = {
        connect: categories.map((category) => {
        
          return { id: category };
        }),
      };
    }

    return categoriesConnection;
  }
}

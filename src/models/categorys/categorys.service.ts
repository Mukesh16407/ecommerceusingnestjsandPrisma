import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from './entities/category.entity';
import { FindCategoriesDto } from './dto/find-categories.dto';
import { FindProductsDto } from '../products/dto/find-products.dto';

@Injectable()
export class CategorysService {
  constructor(private prisma: PrismaService) {}
 /** Creates a new category */
 async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
  const name = this.capitalizeOnlyFirstLetter(createCategoryDto.name);

  const category = await this.prisma.category.create({
    data: { ...createCategoryDto, name },
  });

  return category;
}
/** Capitalize only the first letter of the category name */
private capitalizeOnlyFirstLetter(name: string): string {

  return name[0].toUpperCase() + name.substring(1).toLocaleLowerCase();
}

async findAll({
 categoryName = '',
 page = 1,
 offset = 10,
}: FindCategoriesDto): Promise<Category[]> {
 const categoriesToSkip = (page - 1) * offset;
  
 return this.prisma.category.findMany({
   skip: categoriesToSkip,
   take: offset,
   where: {
     name: { contains: categoryName, mode: 'insensitive' },
   },
   orderBy: { name: 'asc' },
 });
}

 /** Find category by ID and show the products that have this category */
 async findOneById(
  id: string,
  { productName = '', page = 1, offset = 10 }: FindProductsDto,
): Promise<Category | null> {
  const productsToSkip = (page - 1) * offset;

  const category = await this.prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: { id: true, name: true, urlName: true, picture: true },
        where: { name: { contains: productName, mode: 'insensitive' } },
        skip: productsToSkip,
        take: offset,
      },
    },
    // rejectOnNotFound: true,
  });

  return category;
}

 /** Updates category information */
 async update(
  id: string,
  updateCategoryDto: UpdateCategoryDto,
): Promise<Category> {
 
  if (updateCategoryDto.name) {
    
    return this.updateCategoryAndName(id, updateCategoryDto);
  }

  const category = await this.prisma.category.update({
    where: { id },
    data: { ...updateCategoryDto },
  });

  return category;
}

private updateCategoryAndName(
  id: string,
  updateCategoryDto: UpdateCategoryDto,
): Promise<Category> {
  const name = this.capitalizeOnlyFirstLetter(updateCategoryDto.name);
   console.log(name,"name")
  return this.prisma.category.update({
    where: { id },
    data: { ...updateCategoryDto, name },
  });
}

  /** Removes category from database */
  async remove(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}

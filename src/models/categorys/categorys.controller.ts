import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { Category } from './entities/category.entity';
import { Public } from 'src/auths/public.decorator';
import { FindCategoriesDto } from './dto/find-categories.dto';
import { FindProductsDto } from '../products/dto/find-products.dto';

@ApiTags('Category')
@Controller('categorys')
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) {}

  @ApiOperation({ summary: 'Admin creates a new category' })
  @IsAdmin()
  @Post()
 async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
  
    return this.categorysService.create(createCategoryDto);
  }

   /** Returns all categories with pagination
   *
   * Default is starting on page 1 showing 10 results per page,
   * searching and ordering by name
   */
   @ApiOperation({ summary: 'Returns all categories' })
   @Public()
   @Get()
   async findAll(
     @Query() findCategoriesDto: FindCategoriesDto,
   ): Promise<Category[]> {
     return this.categorysService.findAll(findCategoriesDto);
   }
 

  /** Find category by ID, only for admins */
  @ApiOperation({ summary: 'Admin gets category by ID and its products' })
  @IsAdmin()
  @Get('/id/:id')
  async findOneById(
    @Param('id') id: string,
    @Query() findProductsDto: FindProductsDto,
  ): Promise<Category> {
    return this.categorysService.findOneById(id, findProductsDto);
  }

   /** Updates category information, only for admins */
   @ApiOperation({ summary: 'Admin updates category' })
   @IsAdmin()
   @Patch(':id')
   async update(
     @Param('id') id: string,
     @Body() updateCategoryDto: UpdateCategoryDto,
   ): Promise<Category> {
     return this.categorysService.update(id, updateCategoryDto);
   }

   /** Deletes category from database, only for admins */
   @ApiOperation({ summary: 'Admin deletes category' })
   @IsAdmin()
   @Delete(':id')
   @HttpCode(HttpStatus.NO_CONTENT)
   async remove(@Param('id') id: string): Promise<void> {
     return this.categorysService.remove(id);
   }
}

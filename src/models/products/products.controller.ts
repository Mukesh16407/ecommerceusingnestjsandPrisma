import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { Product } from './entities/product.entity';
import { FileUpload } from 'src/common/decorators/file-upload.decorator';
import { File } from './types/file';
import { Public } from 'src/auths/public.decorator';
import { FindProductsDto } from './dto/find-products.dto';

/** Exposes product CRUD endpoints */

@ApiTags('product')
@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
 /** Creates a new product, only for admins */
 @ApiOperation({ summary: 'Admin creates a new product' })
 @IsAdmin()
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }


  //  Admin uploads a new picture for the product.
  //   Needs to be type jpeg, jpg or png and maximum 3MB.

  @ApiOperation({ summary: 'Admin uploads a new product picture' })
  @IsAdmin()
  @FileUpload()
  @Patch('picture/:id')
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: File,
  ): Promise<Product> {
    
    return this.productsService.uploadPicture(id, file);
  }

   /**Get all Products */
   @ApiOperation({ summary: 'Returns all products' })
   @Public()
   @Get()
   findAll(@Query() findAllProductsDto: FindProductsDto): Promise<Product[]> {
     return this.productsService.findAll(findAllProductsDto);
   }

  /** Find product by ID, only for admins */
  @ApiOperation({ summary: 'Admin gets product by ID' })
  @IsAdmin()
  @Get('/id/:id')
  findOneById(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOneById(id);
  }

    /** Find product by Url Name */
    @ApiOperation({ summary: 'Gets product by urlName' })
    @Public()
    @Get(':urlName')
    findOneByUrlName(@Param('urlName') urlName: string): Promise<Product> {
      return this.productsService.findOneByUrlName(urlName);
    }

    /** Updates product information, only for admins */
    @ApiOperation({ summary: 'Admin updates product' })
    @IsAdmin()
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto,
    ): Promise<Product> {
      return this.productsService.update(id, updateProductDto);
    }

   /** Deletes product from database, only for admins */
   @ApiOperation({ summary: 'Admin deletes product' })
   @IsAdmin()
   @Delete(':id')
   @HttpCode(HttpStatus.NO_CONTENT)
   remove(@Param('id') id: string): Promise<void> {
     return this.productsService.remove(id);
   }
}

import { Body, Controller, Get, Post,Req,Patch ,Delete,HttpCode,HttpStatus} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auths/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithoutPassword } from './entities/user-without-password.entity';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { DeleteUserDto } from './dto/delete-user.dto';


// @UseGuards(JwtGuard)
@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

    /** Creates a new user */
    @ApiOperation({ summary: 'Creates a new user' })
    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<void> {

      const result = this.userService.create(createUserDto);
      return result
    }
     /** Returns user's own profile information without password */
    @ApiOperation({ summary: "Gets user's own profile" })
    @ApiBearerAuth()
    @Get()
    async findById(@Req() request: Request): Promise<UserWithoutPassword> {
     
      try {
      
        const userId = request.user ? request.user['userId'] : null;
        if (!userId) {
          throw new Error('User ID not found in request');
        }
        return await this.userService.findById(userId);
      } catch (error) {
        // Handle the error appropriately, e.g., log it or return an error response
        console.error(error.message);
       
      }
    }
    /** Updates user information */
    @ApiOperation({ summary: 'Updates user' })
    @ApiBearerAuth()
    @Patch()
    update(
      @Req() request: Request,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserWithoutPassword> {
      const userId = request.user['userId'];
  
      return this.userService.update(userId, updateUserDto);
    }
  
    /** Updates user role, only for admins */
    @ApiOperation({ summary: "Admin set user's role" })
    @IsAdmin()
    @Patch('role')
    updateUserRole(
      @Body() updateUserRoleDto: UpdateUserRoleDto,
    ): Promise<UserWithoutPassword> {
      return this.userService.updateUserRole(updateUserRoleDto);
    }
  
    /** Deletes user and all user related information from the system */
    @ApiOperation({ summary: 'Deletes user' })
    @ApiBearerAuth()
    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
      @Req() request: Request,
      @Body() deleteUserDto: DeleteUserDto,
    ): Promise<{ message: string; }> {
      const userId = request.user['userId'];
      return this.userService.remove(userId, deleteUserDto);
    }
}

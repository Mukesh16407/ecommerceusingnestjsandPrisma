import { Injectable,HttpStatus  } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { compare, hash } from 'bcrypt';
import { hashConfig } from 'src/config/hash.config';
import { UserWithoutPassword } from './entities/user-without-password.entity';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { InvalidPasswordUpdateException } from './exceptions/invalid-password-update.exception';
import { MissingPasswordUpdateException } from './exceptions/missing-password-update.exception';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    /** Creates a new user */

    async create(createUserDto: CreateUserDto):Promise<any>{
        const hashedPassword = await hash(
            createUserDto.password,
            hashConfig.saltRounds,
          );  
          const lowerCaseEmail = createUserDto.email.toLowerCase();
          try{
            const createdUser =  await this.prisma.user.create({
                data: {
                  ...createUserDto,
                  email: lowerCaseEmail,
                  password: hashedPassword,
                },
             
              });
              // If the creation is successful, you can proceed with other actions or return a success response.
              return {
                user: createdUser,
                message: 'User created successfully',
                status: HttpStatus.CREATED,
              };
          }catch(error){
            console.error(error);
            

          }
        
         
    }
     /** Finds user by id and returns the user without password.
   * Used for default in app requests where the hashed password
   * won't be compared
   */
    

    async findById(id: string): Promise<UserWithoutPassword> {
      try {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
          throw new Error('User not found');
        }
    
        // Ensure the 'password' property exists before attempting to delete it
        if (user.password) {
          delete user.password;
        }
        return { ...user };
      } catch (error) {
        // Handle the error appropriately, e.g., log it or return an error response
        console.error(error.message);
       
      }
    }

      /** Finds user by email and returns the user with password.
   * Used mainly in login to compare if the inputted password matches
   * the hashed one.
   */
      async findByEmail(email: string): Promise<User | null> {
        try {
          const lowerCaseEmail = email.toLowerCase(); 
          const user = await this.prisma.user.findUnique({ where: { email: lowerCaseEmail } });
          return user || null;
        } catch (error) {
          console.error('Error finding user by email:', error);
      
        }
      }
      

        /** Updates user information */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    await this.hashIfUpdatingPassword(id, updateUserDto);

    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto, updatedAt: new Date() },
    });

    delete user.password;

    return { ...user };
  }

  /** Updates user role */
  async updateUserRole(
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.update({
      where: { email: updateUserRoleDto.email },
      data: { role: updateUserRoleDto.role },
    });

    delete user.password;

    return user;
  }

  /** Removes user from database */
  async remove(id: string, deleteUserDto: DeleteUserDto): Promise<{message: string}> {

    try {
      await this.validateCurrentPassword(id, deleteUserDto.currentPassword);
      await this.prisma.user.delete({ where: { id } });
      return { message: 'User deleted successfully' };
     
    } catch (error) {
      console.error('Error in remove method:', error);
  
    }
  }

  /** If the user inputted both new password and current password
   * the new password is hashed to be saved in the database replacing
   * the current one.
   *
   * If only the new password or current password were inputted the user
   * probably forgot about the other one and an error is thrown
   */
  private async hashIfUpdatingPassword(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    if (updateUserDto.password && updateUserDto.currentPassword) {
      await this.validateCurrentPassword(id, updateUserDto.currentPassword);

      const hashedPassword = await hash(
        updateUserDto.password,
        hashConfig.saltRounds,
      );

      updateUserDto.password = hashedPassword;
      delete updateUserDto.currentPassword;

      return;
    }

    if (updateUserDto.password || updateUserDto.currentPassword) {
      throw new MissingPasswordUpdateException();
    }
  }

  /** Compares if the inputted current password matches the
   * user hashed password saved in the database
   *
   * If it doesn't, an error is thrown
   */
  private async validateCurrentPassword(
    id: string,
    currentPassword: string,
  ): Promise<void> {
   
    const user = await this.prisma.user.findUnique({ where: { id } });
    const isCorrectPassword = await compare(currentPassword, user.password);
    
    if (!isCorrectPassword) {
      throw new InvalidPasswordUpdateException();
    }
  }

}
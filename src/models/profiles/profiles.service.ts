import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService){}
  async create(createProfileDto: CreateProfileDto): Promise<any> {
    try {
      const createdProfile = await this.prisma.profile.create({
        data: {
          ...createProfileDto,
          user: {
            create: createProfileDto.user,
          },
        },
      });
    console.log(createdProfile,"CreateProfile")
      // If the creation is successful, you can proceed with other actions or return a success response.
      return {
        profile: createdProfile,
        message: 'Profile created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}

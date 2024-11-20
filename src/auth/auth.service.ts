import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { ManagerError } from 'src/common/errors/manager.error';
import { UserEntity } from 'src/users/entities/user.entity';
import { RegisterAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async register(regiterAuthDto: RegisterAuthDto){
    return 'registrar'
  }
  
  async login(loginAuthDto: LoginAuthDto): Promise<{user: UserEntity, token: string}> {
    const {email, password} = loginAuthDto;
    try{
     
      const user = await this.usersService.findOneByEmail(email);
      if(user.password !== password){
        throw new ManagerError({
          type: 'BAD_REQUEST',
          message: 'invalid credentials'
        })
      }

      const token = await this.jwtService.signAsync({email: user.email, id: user.id});
      if(!token){
        throw new ManagerError({
        type:'INTERNAL_SERVER_ERROR',
        message: 'internal server error'
      })
    }

      return {user, token}
  } catch(error){
      ManagerError.createSignatureError(error.message);
    }
  }

}

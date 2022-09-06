import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';

import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector //Ayuda a ver y obtener informacion de la metadata de los decoradores
  ){}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validateRole: string[] = this.reflector.get( META_ROLES, context.getHandler() )

    if(!validateRole) return true;
    if( validateRole.length === 0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User; // el usuario neceista tener un tipo.

    if(!user) throw new BadRequestException('Ususario no encontrado wacho!')

    console.log({ userRole: user.roles })

    for (const role of user.roles) {
      if(validateRole.includes( role )){
        return true;
      }
    }

    throw new ForbiddenException(` Usuario ${user.fullName} neceasita un rol valido: [${ validateRole }]`)

  }
}

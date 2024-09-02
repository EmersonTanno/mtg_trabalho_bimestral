import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './enum/role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
  
    const { user } = context.switchToHttp().getRequest();
    console.log('User in RolesGuard:', user);
    console.log ({requiredRoles});
  
    if (!user || !user.roles) {
      throw new UnauthorizedException('User or roles not found');
    }
  
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
  
}
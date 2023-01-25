import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (this.matchRoles(roles, user.role)) {
      return true;
    }

    throw new UnauthorizedException('You dont have the permission for this operation.');
  }

  private matchRoles(roles: string[], userRoles: string[]): boolean {
    let allowAccess = true;

    roles.map(role => userRoles.indexOf(role) === -1 ? allowAccess = false : '');

    return allowAccess;
  }

}
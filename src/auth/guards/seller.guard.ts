import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


@Injectable()
export class SellerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; 

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      if (decoded.userRole !== 'seller') {
        throw new ForbiddenException(
          'Access denied. Only sellers can perform this action.',
        );
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

@Injectable()
export class BuyerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('token not provided');
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      if (decoded.userRole !== 'buyer') {
        throw new BadRequestException(
          "'Access denied. Only buyers can perform this action.',",
        );
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { AwsS3Module } from 'src/upload/aws-s3.module';
// import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    PassportModule.register({ defaultStrategy: 'google' }),

    UsersModule,
    EmailSenderModule,
    AwsS3Module,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

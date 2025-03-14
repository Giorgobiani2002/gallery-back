import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrderModule } from './order/order.module.js';
import { CartModule } from './cart/cart.module.js';
import { EmailService } from './email/email.service.js';
import { EmailModule } from './email/email.module.js';
import { AwsS3Module } from './upload/aws-s3.module.js';
import { AdminModule } from '@adminjs/nestjs';
import provider from './admin/auth-provider.js';
import options from './admin/options.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AdminModule.createAdminAsync({
      useFactory: async () => {
        return {
          adminJsOptions: options,
          auth: {
            provider,
            cookiePassword: process.env.COOKIE_SECRET,
            cookieName: 'adminjs',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: process.env.COOKIE_SECRET,
          },
        };
      },
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrderModule,
    CartModule,
    EmailModule,
    AwsS3Module,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}

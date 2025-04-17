import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { AwsS3Module } from './upload/aws-s3.module';
import { PaypalModule } from './paypal/paypal.module';
import { AuctionBiddingModule } from './auction-bidding/auction-bidding.module';
import { MongooseSchemasModule } from './mongoose/mogoose.module';
import { Model } from 'mongoose';
import { User } from './mongoose/user-model';
import { Product } from './mongoose/product-model';
import { Order } from './mongoose/order-model';
import { Cart } from './mongoose/cart-model';
import { GalleriesModule } from './galleries/galleries.module';
import { Gallery } from './mongoose/gallery-model';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailSenderService } from './email-sender/email-sender.service';
import { EmailSenderModule } from './email-sender/email-sender.module';

import('adminjs').then(({ AdminJS }) => {
  import('@adminjs/mongoose').then((AdminJSMongoose) => {
    AdminJS.registerAdapter({
      Resource: AdminJSMongoose.Resource,
      Database: AdminJSMongoose.Database,
    });
  });
});

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'admin',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [MongooseSchemasModule],
        inject: [
          getModelToken('User'),
          getModelToken('Product'),
          getModelToken('Order'),
          getModelToken('Cart'),
          getModelToken('Gallery'),
        ],
        useFactory: (
          userModel: Model<User>,
          ProductModel: Model<Product>,
          OrderModel: Model<Order>,
          CartModel: Model<Cart>,
          GalleryModel: Model<Gallery>,
        ) => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              { resource: userModel },
              { resource: ProductModel },
              { resource: OrderModel },
              { resource: CartModel },
              { resource: GalleryModel },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
      }),
    ),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrderModule,
    CartModule,
    EmailModule,
    AwsS3Module,
    PaypalModule,
    AuctionBiddingModule,
    GalleriesModule,
    EmailSenderModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, EmailSenderService],
})
export class AppModule {}

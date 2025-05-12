import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
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
import { Auction } from './mongoose/auction-model';
import { ScheduleModule } from '@nestjs/schedule';
import path from 'path';
// import { dynamicImport } from './utils/dynamic-import';

export const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

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

export const createAppModule = async () => {
  const AdminJSImport = await dynamicImport('adminjs');
  const AdminJS = AdminJSImport.default;
  const ComponentLoader = AdminJSImport.ComponentLoader;
  const componentLoader = new ComponentLoader();

  const imageComponentId = componentLoader.add(
    'ImageComponent',
    path.join(__dirname, './mongoose/components/ImageComponent'),
  );

  const AdminJSMongoose = await dynamicImport('@adminjs/mongoose');
  const { AdminModule } = await dynamicImport('@adminjs/nestjs');

  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });

  const AdminPanelModule = AdminModule.createAdminAsync({
    imports: [MongooseSchemasModule],
    inject: [
      getModelToken('User'),
      getModelToken('Product'),
      getModelToken('Order'),
      getModelToken('Cart'),
      getModelToken('Gallery'),
      getModelToken('Auction'),
    ],
    useFactory: async (
      userModel: Model<User>,
      ProductModel: Model<Product>,
      OrderModel: Model<Order>,
      CartModel: Model<Cart>,
      GalleryModel: Model<Gallery>,
      AuctionModel: Model<Auction>,
    ) => {
      return {
        adminJsOptions: {
          rootPath: '/admin',
          componentLoader,
          resources: [
            { resource: userModel },
            {
              resource: ProductModel,
              options: {
                properties: {
                  mainImgUrl: {
                    components: {
                      list: imageComponentId,
                      show: imageComponentId,
                    },
                  },
                },
              },
            },
            { resource: OrderModel },
            { resource: CartModel },
            { resource: GalleryModel },
            { resource: AuctionModel },
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
      };
    },
  });

  @Module({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      MongooseModule.forRoot(process.env.MONGO_URI),
      ScheduleModule.forRoot(),
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
      AdminPanelModule,
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
  class AppModule {}

  return AppModule;
};

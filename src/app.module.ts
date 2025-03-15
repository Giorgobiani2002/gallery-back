import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { AwsS3Module } from './upload/aws-s3.module';
import { Product } from './products/schema/product.schema'; // Import Product model

// CommonJS - require() for commonjs packages
const session = require('express-session');
const formidable = require('express-formidable');

// ESM - Dynamic import for ESM modules
let AdminJSNestJS: any;
let AdminJSExpress: any;
let AdminJS: any;

(async () => {
  const adminJSModule = await import('adminjs');
  AdminJS = adminJSModule.default || adminJSModule; // Handle both ESM and CommonJS

  AdminJSExpress = await import('@adminjs/express');
  AdminJSNestJS = await import('@adminjs/nestjs');

  const AdminJSMongoose = await import('@adminjs/mongoose');

  // Register AdminJS Mongoose Adapter
  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });
})();

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
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
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Product, // Add Product resource
                options: {
                  // You can customize the resource options here
                },
              },
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
    ProductsModule, // ProductsModule already registers Product schema
    OrderModule,
    CartModule,
    EmailModule,
    AwsS3Module,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}

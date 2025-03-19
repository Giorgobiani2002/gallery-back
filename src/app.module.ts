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
import { Product, ProductSchema } from './products/schema/product.schema';

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

const dynamicImport = async (packageName: string) => {
  try {
    const module = await import(packageName);
    return module;
  } catch (error) {
    console.error(`Error importing package: ${packageName}`, error);
    throw error;
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    dynamicImport('@adminjs/nestjs').then(async ({ AdminModule }) => {
      // Dynamically import the necessary modules
      const { default: AdminJS } = await dynamicImport('adminjs');
      const { default: mongoose } = await dynamicImport('mongoose');
      const { default: mongooseAdapter } =
        await dynamicImport('@adminjs/mongoose');

      const mongooseDb = await mongoose.connect(
        'mongodb://localhost:27017/test',
      );

      const admin = new AdminJS({
        databases: [mongooseAdapter(mongooseDb)],
      });

      return AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [ProductSchema],
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
      });
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

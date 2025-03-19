import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { AwsS3Module } from './upload/aws-s3.module';
import { Product, ProductSchema } from './products/schema/product.schema';
import { ProductsModule } from './products/products.module';
import { AdminSetupModule } from './admin-setup.module';

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

// Dynamic import utility to handle ESM imports
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
    MongooseModule.forRoot(process.env.MONGO_URI), // MongoDB connection

    AdminSetupModule,
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

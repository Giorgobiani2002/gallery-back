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
import { initializeProvider } from './admin/options';

export const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),

    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: async () => {
          const { provider, options } = await initializeProvider();
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
    ),
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

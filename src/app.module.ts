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
import { ProductSchema } from './products/schema/product.schema';
import { Category } from './products/schema/product.schema';

export const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

const DEFAULT_ADMIN = {
  email: '',
  password: '',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

async function registerAdminAdapter() {
  const AdminJS = await dynamicImport('adminjs');
  const AdminJSMongoose = await dynamicImport('@adminjs/mongoose');

  // რეგისტრაცია ადაპტერის
  AdminJS.default.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });
}

// რეგისტრაციისთვის, სანამ მოდული დაიწყებს მუშაობას
registerAdminAdapter();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrderModule,
    CartModule,
    EmailModule,
    AwsS3Module,
    dynamicImport('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: ProductSchema, // Mongoose მოდელი
                options: {
                  listProperties: [
                    'mainImgUrl',
                    'mockUpImgUrl',
                    'title',
                    'year',
                    'category',
                    'price',
                  ], // რა უნდა იყოს ნახმარი რესურსებში
                  editProperties: [
                    'mainImgUrl',
                    'mockUpImgUrl',
                    'title',
                    'year',
                    'description',
                    'category',
                    'price',
                    'height',
                    'width',
                    'depth',
                    'isFavorite',
                    'artist',
                  ],
                  filterProperties: ['category', 'price'],
                },
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: '',
            cookiePassword: '',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}

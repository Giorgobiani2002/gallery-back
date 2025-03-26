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
import { Category } from './products/schema/product.schema';
import { User, UserSchema } from './users/schema/user.schema';

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

async function registerAdminAdapter() {
  const AdminJS = await dynamicImport('adminjs');
  const AdminJSMongoose = await dynamicImport('@adminjs/mongoose');

  AdminJS.default.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });
}

registerAdminAdapter();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),

    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
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
                resource: Product,
                options: {},
              },
              {
                resource: User,
                options: {},
              },
            ],
          },
          auth: {
            authenticate,
            cookieName: '',
            cookiePassword: process.env.COOKIE_SECRET,
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET,
          },
        }),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}

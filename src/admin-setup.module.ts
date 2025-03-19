import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { dynamicImport } from './main';
import { Product, ProductSchema } from 'src/products/schema/product.schema'; // Product model
import { User, UserSchema } from 'src/users/schema/user.schema'; // Optional: User model

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema }, // Register Product schema
      { name: 'User', schema: UserSchema }, // Optional: If you want to manage users as well
    ]),
  ],
  providers: [
    {
      provide: 'ADMIN_SETUP',
      useFactory: async () => {
        // Dynamically import AdminJS, Mongoose Adapter, and AdminModule
        const [AdminJS, AdminJSMongoose, AdminModule] = await Promise.all([
          dynamicImport('adminjs'), // Dynamically import AdminJS
          dynamicImport('@adminjs/mongoose'), // Dynamically import the Mongoose adapter for AdminJS
          dynamicImport('@adminjs/nestjs'), // Dynamically import AdminJS NestJS integration
        ]);

        // Create AdminJS instance and pass the Mongoose Adapter for each resource
        const adminJS = new AdminJS.default({
          resources: [
            {
              resource: Product, // Resource is the Mongoose model to be managed in AdminJS
              options: {
                listProperties: ['name', 'price'], // Example: only show these properties in the list view
              },
            },
            {
              resource: User, // Optional: If you want to expose the User model to AdminJS
              options: {
                listProperties: ['email', 'fullName'], // Example: Show these properties for users
              },
            },
          ],
          branding: {
            companyName: 'My Company',
            softwareBrothers: false,
          },
          database: {
            adapter: AdminJSMongoose.Database, // Set Mongoose adapter here
            resource: AdminJSMongoose.Resource, // Resource adapter for Mongoose
          },
        });

        // Return the AdminModule with the manually configured AdminJS instance
        return AdminModule.createAdmin({
          adminJsOptions: adminJS,
        });
      },
    },
  ],
})
export class AdminSetupModule {}

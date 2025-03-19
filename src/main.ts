import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Product } from './products/schema/product.schema';

// Dynamic import function to handle the dynamic loading of modules
export const dynamicImport = async (packageName: string) => {
  try {
    return await new Function(`return import('${packageName}')`)();
  } catch (error) {
    console.error(`Error importing package ${packageName}:`, error);
    process.exit(1); // Exit if the package can't be loaded
  }
};

async function bootstrap() {
  // Dynamic imports
  const adminJSModule = await dynamicImport('adminjs');
  const AdminJS = adminJSModule.default;

  const AdminJSMongoose = await dynamicImport('@adminjs/mongoose'); // Ensure correct import
  const AdminJSExpress = await dynamicImport('@adminjs/express');

  // Create NestJS app
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Set up global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const globalPrefix = 'admin';
  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );

  // Register the AdminJS Mongoose adapter
  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource, // Register the Mongoose resource
    Database: AdminJSMongoose.Database, // Register the Mongoose database adapter
  });

  // Create AdminJS instance with resources (your Mongoose models)
  const adminJS = new AdminJS({
    resources: [
      {
        resource: Product, // Register Product model as a resource
        options: {
          // Add any specific configurations for the resource here if needed
        },
      },
    ],
    rootPath: '/admin', // Admin panel accessible at /admin route
  });

  // Build the AdminJS router
  const adminRouter = AdminJSExpress.buildRouter(adminJS);

  // Register AdminJS router in the NestJS app
  app.use(adminJS.options.rootPath, adminRouter);
}

bootstrap().catch((error) => {
  console.error('Error bootstrapping the app:', error);
});

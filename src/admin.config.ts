// import AdminJS from 'adminjs';
// import * as AdminJSMongoose from '@adminjs/mongoose';
// import express from 'express';
// import AdminJSExpress from '@adminjs/express';
// import mongoose from 'mongoose';
// import ProductModel from './models/product.model'; // Import your model

// // Register Adapter
// AdminJS.registerAdapter({
//   Resource: AdminJSMongoose.Resource,
//   Database: AdminJSMongoose.Database,
// });

// const runApp = async () => {
//   // MongoDB Connection
//   await mongoose.connect('mongodb://localhost:27017/mydatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   // AdminJS Instance
//   const adminJs = new AdminJS({
//     rootPath: '/admin',
//     resources: [
//       {
//         resource: ProductModel,
//         options: {
//           properties: {
//             name: { isTitle: true },
//             price: { type: 'number' },
//             category: { type: 'string' },
//             stock: { type: 'number' },
//           },
//         },
//       },
//     ],
//     branding: {
//       companyName: 'My Admin Panel',
//     },
//   });

//   const app = express();

//   // Authentication Example
//   const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
//     authenticate: async (email, password) => {
//       if (email === 'admin@example.com' && password === 'password') {
//         return { email };
//       }
//       return null;
//     },
//     cookiePassword: 'secureCookiePassword',
//   });

//   app.use(adminJs.options.rootPath, adminJsRouter);

//   app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
//     console.log('AdminJS is running on http://localhost:3000/admin');
//   });
// };

// runApp();

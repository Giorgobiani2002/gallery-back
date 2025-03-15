import { Controller, Get } from '@nestjs/common';
import * as expressSession from 'express-session';
import * as expressFormidable from 'express-formidable';
import { Express } from 'express';

@Controller('admin')
export class AdminController {
  @Get()
  async adminJs() {
    const AdminJS = (await import('adminjs')).default;
    const AdminJSExpress = (await import('@adminjs/express')).default;

    const adminJs = new AdminJS({
      resources: [],
      branding: {
        companyName: 'My Company',
      },
    });

    const adminRouter = AdminJSExpress.buildRouter(adminJs);

    // Return the express router for admin
    return adminRouter;
  }
}

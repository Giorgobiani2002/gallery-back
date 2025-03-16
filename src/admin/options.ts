// In a separate file like 'adminjs-provider.ts' (or above the imports in 'app.module.ts')

import componentLoader from './component-loader';
import { DEFAULT_ADMIN } from './constants.js';

export const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

// This is the function you need to import
export const initializeProvider = async () => {
  const { DefaultAuthProvider } = await dynamicImport('adminjs');
  const provider = new DefaultAuthProvider({
    componentLoader,
    authenticate: async ({ email, password }) => {
      if (email === DEFAULT_ADMIN.email) {
        return { email };
      }
      return null;
    },
  });

  const options = {
    rootPath: '/admin',
    resources: [],
    databases: [],
  };

  return { provider, options };
};

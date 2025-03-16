import componentLoader from './component-loader.js';
import { DEFAULT_ADMIN } from './constants.js';

const dynamicImport = async (packageName) => {
  return import(packageName);
};

let provider;

const initializeProvider = async () => {
  const { DefaultAuthProvider } = await dynamicImport('adminjs');

  provider = new DefaultAuthProvider({
    componentLoader,
    authenticate: async ({ email, password }) => {
      if (email === DEFAULT_ADMIN.email) {
        return { email };
      }
      return null;
    },
  });

  return provider;
};

initializeProvider().then(() => {
  console.log('Provider initialized:', provider);
});

export default provider;

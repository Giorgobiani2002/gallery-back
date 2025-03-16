const dynamicImport = async (packageName) => {
  return new Function(`return import('${packageName}')`)();
};

let componentLoader;

const initializeComponentLoader = async () => {
  const { ComponentLoader } = await dynamicImport('adminjs');

  componentLoader = new ComponentLoader();
};

initializeComponentLoader().then(() => {
  console.log('ComponentLoader initialized', componentLoader);
});

export default componentLoader;

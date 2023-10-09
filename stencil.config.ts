import { Config } from '@stencil/core';

const esModules = ['node-forge'].join('|');
export const config: Config = {
  namespace: 'mitigowebcomponentpayment',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      copy: [
        {
          src: '**/*.{jpg,png}',
          dest: 'dist/assets',
          warn: true,
        }
      ]
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: false,
    },
  ],
  testing: {
    browserHeadless: "new",
  },
  enableCache: false,
  env: {
    API_HOST: 'https://u4n5vllid3.execute-api.us-east-1.amazonaws.com/qa/api/v1',
  }
};

import { PromiseExecutor } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (options) => {
  console.log('Executor ran for Deploy', options);
  return {
    success: true,
  };
};

export default runExecutor;

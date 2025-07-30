
import { logger, PromiseExecutor } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  options,
  context
) => {
  const projectName = context.projectName;

  logger.log('logging something', options);
  
  return {
    success: true
  }
};

export default runExecutor;


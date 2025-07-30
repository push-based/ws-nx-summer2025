import { logger, PromiseExecutor } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  options,
  context
) => {
  const projectName = context.projectName;
  logger.log('Executor ran for Deploy', projectName, options);
  return {
    success: true,
  };
};

export default runExecutor;

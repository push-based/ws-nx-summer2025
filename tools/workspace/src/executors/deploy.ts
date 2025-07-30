import { PromiseExecutor, logger } from '@nx/devkit';
import { exec } from 'child_process';
import { DeployExecutorSchema } from './schema';
import { promisify } from 'util';

const asyncExec = promisify(exec);

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  options,
  context
) => {
  logger.log('logging something', options);
  const projectName = context.projectName;
  try {
    const { stderr } = await asyncExec(
      `docker build -f ${options.dockerfile} --build-arg='APP_NAME=${projectName}' . -t ${options.tag}`
    );
    logger.log(stderr);
    logger.log('thank you for deploying with austrian airlines');
    return {
      success: true,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
    };
  }
};

export default runExecutor;

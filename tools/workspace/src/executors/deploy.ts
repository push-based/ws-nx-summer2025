import { logger, PromiseExecutor } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const asyncExec = promisify(exec);

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  options,
  context
) => {
  const projectName = context.projectName;
  try {
    const { stderr } = await asyncExec(
      `docker build -f ${options.dockerFile} --build-arg='APP_NAME=${projectName}' . -t ${options.tag}`
    );
    logger.log(stderr);
    logger.log('thank you for deploying with austrian airlines');
    return {
      success: true,
    };
  } catch (e) {
    logger.error(e.message);
    return {
      success: false,
    };
  }
};

export default runExecutor;

import { logger, PromiseExecutor } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';
import { exec } from 'child_process';
import { promisify } from 'node:util';
const asyncExec = promisify(exec);

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  options,
  context
) => {
  try {
    const { dockerFile, tag } = options;
    console.log('Executor ran for Deploy', options);
    const { stderr } = await asyncExec(
      `docker build -f ${dockerFile} --build-arg='APP_NAME=${context.projectName}' . -t ${tag}`
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

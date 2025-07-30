import { logger, PromiseExecutor } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';
import { exec } from 'node:child_process';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  options,
  context
) => {
  const projectName = context.projectName;
  logger.log('running docker build');
  exec(
    `docker build -f ${options.dockerFile} --build-arg='APP_NAME=${projectName}' . -t ${options.tag}`
  );
  logger.log('logging something', options);
  logger.log('projectName', projectName);

  return {
    success: true,
  };
};

export default runExecutor;

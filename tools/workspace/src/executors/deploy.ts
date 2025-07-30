import { logger, PromiseExecutor } from '@nx/devkit';
import { DeployExecutorSchema } from './schema';
import { spawn } from 'node:child_process';

const runExecutor: PromiseExecutor<DeployExecutorSchema> = async (
  options,
  context
) => {
  logger.log('logging something', options);
  const projectName = context.projectName;
  const child = spawn(
    'sudo',
    [
      'docker',
      'build',
      '-f',
      options.dockerFile,
      '--build-arg',
      `APP_NAME=${projectName}`,
      '-t',
      options.tag,
      '.',
    ],
    { stdio: 'inherit' } // ← gives sudo a TTY
  );

  return new Promise((res) =>
    child.on('exit', (code) => res({ success: code === 0 }))
  );
};
export default runExecutor;

import {
  CreateNodesV2,
  createNodesFromFiles,
  joinPathFragments,
  readJsonFile,
  ProjectConfiguration,
  logger,
  TargetConfiguration,
} from '@nx/devkit';

import { basename, dirname } from 'node:path';

export interface DeployPluginOptions {
  buildTargetName: string;
  deployTargetName: string;
  organizationName: string;
  repositoryName: string;
}

function normalizeOptions(
  options: Partial<DeployPluginOptions> = {}
): DeployPluginOptions {
  return {
    deployTargetName: options.deployTargetName ?? 'deploy',
    buildTargetName: options.buildTargetName ?? 'build',
    organizationName: options.organizationName ?? 'push-based',
    repositoryName: options.repositoryName ?? 'ws-nx-summer2025',
  };
}

export const createNodesV2: CreateNodesV2<Partial<DeployPluginOptions>> = [
  '**/Dockerfile',
  async (dockerFiles, options, context) => {
    try {
      return await createNodesFromFiles(
        (dockerFilePath, options, context) => {
          const projectRoot = dirname(dockerFilePath);
          const opts = normalizeOptions(options ?? {});

          const projectPath = joinPathFragments(
            context.workspaceRoot,
            projectRoot,
            'project.json'
          );
          const {
            buildTargetName,
            deployTargetName,
            organizationName,
            repositoryName,
          } = opts;

          const projectConfiguration = readJsonFile(
            projectPath
          ) as ProjectConfiguration;
          const projectName =
            projectConfiguration.name ?? basename(projectRoot);

          const targets: Record<string, TargetConfiguration> = {};
          // 👇️👇️👇️👇️👇️👇️👇️
          // your code goes here
          targets[deployTargetName] = {
            executor: '@react-monorepo/workspace-tools:deploy',
            options: {
              dockerFilePath,
              tag: `ghcr.io/${organizationName}/${repositoryName}/${projectName}:dev`,
            },
            cache: true,
            dependsOn: [buildTargetName],
            inputs: [
              dockerFilePath,
              {
                dependentTasksOutputFiles: '**/dist/**/*',
                transitive: true,
              },
            ],
          };

          return {
            projects: {
              [projectRoot]: {
                root: projectRoot,
                projectType: 'application',
                targets,
              },
            },
          };
        },
        dockerFiles,
        options,
        context
      );
    } catch (e) {
      logger.error(e);
    }
  },
];

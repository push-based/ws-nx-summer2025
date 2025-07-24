---

**[← Previous: Custom Generator](./09-custom-generator.md) | [Next: Create a branch →](./11-create-a-branch.md)**

---

# Nx Interred Tasks

Learn how to create a crystal plugin with Nx.

This document guides you through creating a custom Nx crystal plugin to add a `deploy` target to your
applications based on the existence of a `Dockerfile`.

We already have a custom executor to execute the `deploy` target. We have to manually configure it per project. 
Of course, it would be desirable to have the project infer the `deploy` target whenever there is an existing `Dockerfile`.

# 0. The Skeleton

Create a new file `plugin.ts` under `tools/workspace/src/plugins/`.

Put the following contents as your skeleton there:

<details>
  <summary>Plugins.ts skeleton</summary>

```ts
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
  '**/deploy.Dockerfile',
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

```

</details>

Take a while to consume this code and understand what happens.

# 1. The logic

What you want to do now is to create the `deploy` target and add it as a new key into the `targets: Record<string, TargetConfiguration>`.

Take a look at the existing target in the `apps/movies/project.json`

You can take this as a blueprint:

```json
{
    "deploy": {
      "executor": "@react-monorepo/workspace-tools:deploy",
      "inputs": [
        "dockerFiles",
        {}
      ],
      "options": {
        "dockerFile": "tools/deploy/deploy.Dockerfile",
        "tag": "ghcr.io/push-based/ws-nx-summer2025/ws-nx-summer2025:dev"
      }
    }
  }
```

So you need to put a new object into `targets[deployTargetName] = {}` which resembles the new target
you want to have.

<details>
  <summary>targets</summary>

```ts

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

```

</details>


<details>
  <summary>Full Solution</summary>

```ts
// tools/workspace/src/plugins/plugin.ts

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
  '**/deploy.Dockerfile',
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

```

</details>

# 2. Export

Export the `plugin.ts` from the `tools/workspace/src/index.ts`


<details>
  <summary>index.ts</summary>

```ts

// src/tools/workspace/src/index.ts

export * from './plugins/plugin';


```

</details>

# 3. Enable on nx.json

The last step we need to perform is to enable it in the `nx.json`:

Open the `plugins` section of it and add a new entry to enable your plugin:

```json
// nx.json

{
  "plugins": [
    // other plugins are here
    {
      "plugin": "@react-monorepo/workspace-tools",
      "options": {
        "buildTargetName": "build",
        "deployTargetName": "deploy"
      }
    }
  ]
}
```

Well done!

# 4. Adjust the movies project

Now let's make it finally happen. We just have to move some files around.

## 4.1 Move the Dockerfile (Optional, if there is no Dockerfile yet)

> [!NOTE]
> If you have already an existing Dockerfile in this folder, please skip this step

Move (or better copy) the existing files from `tools/deploy/` to the `apps/movies/` folder.

In the end you need to have:

```bash
deploy.Dockerfile
nginx.config
```

Inside the `apps/movies` folder. 

## 4.2 Remove the deploy target

Remove the section that says `targets` in your `apps/movies/project.json` file.

<details>
  <summary>Remove targets</summary>

```json

{
  "/// targets": {
    "deploy": {
      "executor": "@react-monorepo/workspace-tools:deploy",
      "options": {
        "dockerFile": "tools/deploy/deploy.Dockerfile",
        "tag": "ghcr.io/push-based/ws-nx-summer2025/ws-nx-summer2025:dev"
      }
    }
  }
}

```

</details>

# 5. Run `nx show project movies`

GREAT JOB!!

Run the show project command to see if your plugin is working!

You should see a `deploy` target being added to your project.

```bash
# first make sure to reset the nx depedency graph
npx nx reset

npx nx show project movies
```

# 6. Execute!

run your inferred task !!!!

```bash
npx nx run movies:deploy

# OR

npx nx deploy movies
```

# 7. Full Solution

<details>
  <summary>Full Solution: apps/movies/project.json</summary>

```json

{
  "name": "movies",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/movies/src",
  "projectType": "application",
  "tags": ["scope:movies"],
  "targets": {}
}


```

</details>

<details>
  <summary>Full Solution: tools/workspace/plugins/plugin.ts</summary>

```ts

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
  '**/deploy.Dockerfile',
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

```

</details>

<details>
  <summary>Full Solution: tools/workspace/src/index.ts</summary>

```ts

export * from './plugins/plugin';

```

</details>

<details>
  <summary>Full Solution: nx.json</summary>

```json

{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "origin/main",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.js",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/src/test-setup.[jt]s",
      "!{projectRoot}/test-setup.[jt]s"
    ],
    "sharedGlobals": []
  },
  "plugins": [
    // we added this section 🚨
    {
      "plugin": "@react-monorepo/workspace-tools",
      "options": {
        "buildTargetName": "build",
        "deployTargetName": "deploy"
      }
    },
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "testTargetName": "test",
        "serveTargetName": "serve",
        "previewTargetName": "preview",
        "serveStaticTargetName": "serve-static"
      }
    },
    {
      "plugin": "@nx/eslint/plugin",
      "options": {
        "targetName": "lint"
      }
    },
    {
      "plugin": "@nx/playwright/plugin",
      "options": {
        "targetName": "e2e"
      }
    },
    {
      "plugin": "@nx/jest/plugin",
      "options": {
        "targetName": "test"
      }
    },
    {
      "plugin": "@nx/react/router-plugin",
      "options": {
        "buildTargetName": "build",
        "devTargetName": "dev",
        "startTargetName": "start",
        "watchDepsTargetName": "watch-deps",
        "buildDepsTargetName": "build-deps",
        "typecheckTargetName": "typecheck"
      }
    }
  ],
  "targetDefaults": {
    "build": {
      "cache": true
    },
    "test": {
      "cache": true
    },
    "lint": {
      "cache": true
    },
    "e2e-ci--**/**": {
      "dependsOn": ["^build"]
    },
    "@nx/js:tsc": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    }
  },
  "generators": {
    "@nx/react": {
      "application": {
        "babel": true,
        "style": "scss",
        "linter": "eslint",
        "bundler": "vite"
      },
      "component": {
        "style": "scss"
      },
      "library": {
        "style": "scss",
        "linter": "eslint",
        "bundler": "none",
        "component": false,
        "unitTestRunner": "jest"
      }
    }
  },
  "nxCloudId": "682dcf0e246aae99cbac4e14"
}


```

</details>


---

**[← Previous: Custom Generator](./09-custom-generator.md) | [Next: Create a branch →](./11-create-a-branch.md)**

---

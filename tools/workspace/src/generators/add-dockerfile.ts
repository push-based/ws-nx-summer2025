import {
  formatFiles,
  generateFiles,
  Tree,
  getProjects,
  ProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { AddDockerfileGeneratorSchema } from './schema';

export async function addDockerfileGenerator(
  tree: Tree,
  options: AddDockerfileGeneratorSchema
) {
  // 1. Get all the projects in the workspace
  const projects = getProjects(tree);

  // 2. Get the selected project from the prompt
  const selectedProject: ProjectConfiguration = projects.get(options.project);

  // 3. Check if the selected project is an application, if not, throw an error
  if (selectedProject.projectType !== 'application') {
    throw new Error(
      `The project ${options.project} is not an application. Please select an application project.`
    );
  }

  // 4. Get the root of the selected project
  const projectRoot = selectedProject.sourceRoot.replace('/src', '');

  // 5. Update the project configuration with the new targets
  updateProjectConfiguration(tree, options.project, {
    ...selectedProject,
    targets: {
      ...selectedProject.targets,
      deploy: {
        executor: '@react-monorepo/workspace-tools:deploy',
        dependsOn: ['build'],
        options: {
          dockerFile: `${projectRoot}/deploy.Dockerfile`,
          tag: `ghcr.io/push-based/ws-nx-summer2025/ws-nx-summer2025:dev`,
        },
      },
    },
  });

  // 6. Generate the files
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);

  // 7. Format the files (uses prettier)
  await formatFiles(tree);
}

export default addDockerfileGenerator;

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { addDockerfileGenerator } from './add-dockerfile';
import { AddDockerfileGeneratorSchema } from './schema';

describe('add-dockerfile generator', () => {
  let tree: Tree;
  const options: AddDockerfileGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await addDockerfileGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});

# 📖 Nx Custom Generator

---

**[← Previous: Custom Plugin](./07-custom-plugin.md) | [Next: Custom Executor →](./08-custom-executor.md)**

---

✋ Raise your hand to show you've started the exercise. ✋
---

In this exercise, we will create a custom generator which adds a DockerFile to a application.

## 1. Generating a Generator

We will use the `@nx/plugin:generator` generator to generate a new `add-dockerfile` generator.

Run:

```bash
npx nx generate @nx/plugin:generator tools/workspace/src/generators/add-dockerfile --name add-dockerfile
```

```shell
 NX  Generating @nx/plugin:generator

CREATE tools/workspace/src/generators/files/src/index.ts.template
CREATE tools/workspace/src/generators/add-dockerfile.spec.ts
CREATE tools/workspace/src/generators/add-dockerfile.ts
CREATE tools/workspace/src/generators/schema.d.ts
CREATE tools/workspace/src/generators/schema.json
UPDATE tools/workspace/package.json
CREATE tools/workspace/generators.json
```


## 2. Customize the Generator

We will now customize the default generator to add a `Dockerfile` to a project. 

### 2.0. Add `project` to the schema
By default the generator has only a `name` property configured, remove that.
We will add a `project` property to the schema in order to tell it in which project the `Dockerfile` should be added.

```diff
// tools/workspace/src/generators/add-dockerfile/schema.d.ts

export interface AddDockerfileGeneratorSchema {
-  name: string;
+ project: string;
}
```

Also update the `schema.json` file to reflect the new property.
Inside the `schema.json` file, we will add a `project` property inside the `properties` object.

```diff
// tools/workspace/src/generators/add-dockerfile/schema.json
{
  "$schema": "https://json-schema.org/schema",
  "$id": "AddDockerfile",
  "title": "",
  "type": "object",
  "properties": {
-   "name": {
-     "type": "string",
-     "description": "",
-     "$default": {
-       "$source": "argv",
-       "index": 0
-     },
-     "x-prompt": "What name would you like to use?"
-   },
+   "project": {
+     "type": "string",
+     "description": "The project where the dockerfile will be added.",
+     "x-prompt": "Which project will this dockerfile be added in?",
+     "x-dropdown": "projects"
+   }
  },
-  "required": ["name"] 
+  "required": ["project"]
}
```

That's it!

### 2.1. Create `deploy.Dockerfile.template` file and remove the default src folder

In folder `tools/workspace/src/generators/add-dockerfile/files`, delete the `src` folder and create a new file called `deploy.Dockerfile.template`.

By having `deploy` in the file name, the generator will automatically replace it with the name that we provided in the schema.

### 2.2. Update the `deploy.Dockerfile.template` file

Inside the `deploy.Dockerfile.template` file, we will add the following content:

```dockerfile
FROM nginx:1.21.4-alpine
ARG APP_NAME

RUN adduser -D -g 'www' www

COPY apps/$APP_NAME/nginx.conf /etc/nginx/nginx.conf
COPY dist/apps/$APP_NAME /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
```

### 2.3. Create `nginx.conf.template` file

In folder `tools/workspace/src/generators/add-dockerfile/files`, create a new file called `nginx.conf.template` and add the following content:

```conf
user www;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	# multi_accept on;
}

http {
	##
	# Basic Settings
	##

	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
	# server_tokens off;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;
	gzip_disable "msie6";

	##
	# Virtual Host Config
	##
  server {
          listen 80 default_server;
          server_name "";

          root /usr/share/nginx/html;
          index index.html;

          location / {
                  try_files $uri $uri/ /index.html;
          }
  }
}
```

### 2.4. Update the add-dockerfile.ts file

Inside the `add-dockerfile.ts` file, we will write the needed logic to put the `Dockerfile` in the right place and add the `deploy` target to the project.

Update the `add-dockerfile.ts` file to look like this:

```ts
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
        executor: 'nx:run-commands',
        dependsOn: ["build"],
        options: {
          command: `docker build -f ${projectRoot}/deploy.Dockerfile --build-arg='APP_NAME=${selectedProject.name}' . -t ghcr.io/push-based/ws-nx-summer2025/ws-nx-summer2025:dev`,
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
```

### 2.5. Run the generator to see the result
To run the generator, run the following command:

```bash
nx g add-dockerfile
```

The generator will ask you for the name of the dockerFile and the project where it should be added. After that, it will create a new `Dockerfile` file in the root of the specified project.

Congratulations 🎉! You have now created a custom generator that adds a `Dockerfile` to a project.

## 3. Full Solution

<details>
  <summary>Solution: add-dockerfile.ts</summary>

```ts

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
        executor: 'nx:run-commands',
        dependsOn: ['build'],
        options: {
          command: `docker build -f ${projectRoot}/deploy.Dockerfile --build-arg='APP_NAME=${selectedProject.name}' . -t ghcr.io/push-based/ws-nx-summer2025/ws-nx-summer2025:dev`,
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


```

</details>

<details>
  <summary>Solution: schema.d.ts</summary>

```ts

export interface AddDockerfileGeneratorSchema {
  project: string;
}


```

</details>

<details>
  <summary>Solution: schema.json</summary>

```json

{
  "$schema": "https://json-schema.org/schema",
  "$id": "AddDockerfile",
  "title": "",
  "type": "object",
  "properties": {
    "project": {
       "type": "string",
       "description": "The project where the dockerfile will be added.",
       "x-prompt": "Which project will this dockerfile be added in?",
       "x-dropdown": "projects"
    }
  },
  "required": ["project"]
}


```

</details>


<details>
  <summary>file templates</summary>

nginx.conf.template  

```shell

user www;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	# multi_accept on;
}

http {
	##
	# Basic Settings
	##

	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
	# server_tokens off;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;
	gzip_disable "msie6";

	##
	# Virtual Host Config
	##
  server {
          listen 80 default_server;
          server_name "";

          root /usr/share/nginx/html;
          index index.html;

          location / {
                  try_files $uri $uri/ /index.html;
          }
  }
}



```

deploy.Dockerfile.template

```shell

FROM nginx:1.21.4-alpine
ARG APP_NAME

RUN adduser -D -g 'www' www

COPY apps/$APP_NAME/nginx.conf /etc/nginx/nginx.conf
COPY dist/apps/$APP_NAME /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80


```

</details>

---
👏 Lower your hand to show you've finished the exercise. 👏
---

## 🏃‍♂️‍➡️ Action Steps

**👟 Next Step:**
- Create a custom generator for your repository

**🧠 Discussion Topics:**
- Useful custom generators include:
  - Restrict Nx-provided executors to only offer the options that make sense in your organization
  - Changing a todo list in a README file into a single command

---

**[← Previous: Custom Plugin](./07-custom-plugin.md) | [Next: Custom Executor →](./08-custom-executor.md)**

---

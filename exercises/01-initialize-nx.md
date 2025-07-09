---

**[Next: Run Tasks and Task Pipelines →](./02-task-pipelines.md)**

---

# Exercise: Initialize Nx

In this exercise, you'll learn how to add Nx to an existing TypeScript repository and explore the project graph that Nx constructs from analyzing your codebase.

## 1. Explore the Starting Repository

To get started, clone [the sample repository](https://github.com/nrwl/tuskydesign/fork) to your local machine:

```shell
git clone https://github.com/nrwl/tuskydesign.git
```

The repository has three TypeScript packages under `packages/animals`, `packages/names` and `packages/zoo`. The `zoo` package uses `animals` and `names` to generate a random message. The root `package.json` has a `workspaces` property that tells NPM how to find the projects in the repository.

```json {% fileName="package.json" %}
{
  "workspaces": ["packages/*"]
}
```

Because of this setting, when the install command is run at the root, the correct packages are installed for each project. NPM will create dedicated `node_modules` folders inside of each project folder where necessary.

```shell
npm install
```

Now let's try running some tasks. To build the `animals` package, use the `build` npm script:

```text {% command="npm run build -w @tuskdesign/animals" path="~/tuskydesigns" %}
> @tuskdesign/animals@1.2.0 build
> tsc --build tsconfig.lib.json
```

The repository is set up using [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) so building the `zoo` package will automatically build all its dependencies.

```text {% command="npm run build -w @tuskdesign/zoo" path="~/tuskydesigns" %}
> @tuskdesign/zoo@1.2.0 build
> tsc --build tsconfig.lib.json
```

To run the `zoo` package use the `serve` script:

```text {% command="npm run serve -w @tuskdesign/zoo" path="~/tuskydesigns" %}
> @tuskdesign/zoo@1.2.0 serve
> node dist/index.js

Bo the pig says oink!
```

Now that you have a basic understanding of the repository we're working with, let's see how Nx can help us.

## 2. Add Nx to Your Repository

Run a single command to start getting value out of Nx:

```bash
npx nx@latest init
```

This command will download the latest version of Nx and help set up your repository to take advantage of it.

### 2.1 Setup Questions

The script asks a series of questions to help set up caching for you:

- `Which scripts need to be run in order?` - Choose `build`
- `Which scripts are cacheable?` - Choose `build` and `typecheck`
- `Does the "build" script create any outputs?` - Enter `dist`
- `Does the "typecheck" script create any outputs?` - Enter nothing
- `Would you like remote caching to make your build faster?` - Choose `Skip for now`

## 3. Browse the Project Graph

Nx constructs a project graph from analyzing your codebase. This graph shows the dependencies between your projects and is invaluable for understanding your workspace architecture.

### 3.1 View the Full Project Graph

Run the following command to see the dependencies between your projects:

```bash
npx nx graph
```

This will open a browser window showing the project graph with all dependencies.

### 3.2 Focus on Specific Projects

You can focus on a specific project to see its dependencies:

```bash
npx nx graph --focus=@tuskdesign/zoo
```

Replace `@tuskdesign/zoo` with the name of your project.

### 3.3 Understanding the Graph

The project graph shows:
- **Project nodes**: Each project in your workspace
- **Dependency edges**: How projects depend on each other
- **Accurate representation**: Derived directly from your codebase, so it's always up to date

## 4. Explore What Nx Has Configured

After initialization, Nx has automatically configured several things for you:

### 4.1 Check the nx.json Configuration

Look at the `nx.json` file to see what Nx has configured:

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["{projectRoot}/dist"],
      "cache": true
    },
    "typecheck": {
      "cache": true
    }
  }
}
```

### 4.2 Test Basic Commands

Try running some basic Nx commands to see how they work:

```bash
# Build a specific project
npx nx build animals

# Run all projects with a specific target
npx nx run-many -t typecheck
```

## 5. Understanding the Benefits

After completing this exercise, you should understand:

- How Nx can be added to any existing repository with minimal configuration
- How the project graph provides an accurate view of your workspace architecture
- How Nx automatically configures caching and task dependencies
- How to use basic Nx commands to run tasks across your workspace

The project graph is one of Nx's most powerful features - it's derived directly from your codebase and helps you understand the relationships between your projects at a glance.

---

**[Next: Run Tasks and Task Pipelines →](./02-task-pipelines.md)**

---
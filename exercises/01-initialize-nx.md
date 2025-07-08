---

**[← Previous: Nx Cloud Agents](./17-nx-cloud-agents.md) | [Next: Run Tasks and Task Pipelines →](./19-task-pipelines.md)**

---

# Exercise: Initialize Nx

In this exercise, you'll learn how to add Nx to an existing TypeScript repository and explore the project graph that Nx constructs from analyzing your codebase.

## 1. Add Nx to Your Repository

Run a single command to start getting value out of Nx:

```bash
npx nx@latest init
```

This command will download the latest version of Nx and help set up your repository to take advantage of it.

### 1.1 Plugin Selection

First, the script will propose installing some plugins based on the packages that are being used in your repository.

- Deselect both proposed plugins so that we can explore what Nx provides without any plugins.

### 1.2 Setup Questions

Second, the script asks a series of questions to help set up caching for you:

- `Which scripts need to be run in order?` - Choose `build`
- `Which scripts are cacheable?` - Choose `build` and `typecheck`
- `Does the "build" script create any outputs?` - Enter `dist`
- `Does the "typecheck" script create any outputs?` - Enter nothing
- `Would you like remote caching to make your build faster?` - Choose `Skip for now`

## 2. Browse the Project Graph

Nx constructs a project graph from analyzing your codebase. This graph shows the dependencies between your projects and is invaluable for understanding your workspace architecture.

### 2.1 View the Full Project Graph

Run the following command to see the dependencies between your projects:

```bash
npx nx graph
```

This will open a browser window showing the project graph with all dependencies.

### 2.2 Focus on Specific Projects

You can focus on a specific project to see its dependencies:

```bash
npx nx graph --focus=@tuskdesign/zoo
```

Replace `@tuskdesign/zoo` with the name of your project.

### 2.3 Understanding the Graph

The project graph shows:
- **Project nodes**: Each project in your workspace
- **Dependency edges**: How projects depend on each other
- **Accurate representation**: Derived directly from your codebase, so it's always up to date

## 3. Explore What Nx Has Configured

After initialization, Nx has automatically configured several things for you:

### 3.1 Check the nx.json Configuration

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
    },
    "lint": {
      "cache": true
    }
  },
  "defaultBase": "main"
}
```

### 3.2 Test Basic Commands

Try running some basic Nx commands to see how they work:

```bash
# Build a specific project
npx nx build @your-project-name

# Run all projects with a specific target
npx nx run-many -t typecheck

# See what projects are affected by changes
npx nx affected -t build
```

## 4. Understanding the Benefits

After completing this exercise, you should understand:

- How Nx can be added to any existing repository with minimal configuration
- How the project graph provides an accurate view of your workspace architecture
- How Nx automatically configures caching and task dependencies
- How to use basic Nx commands to run tasks across your workspace

The project graph is one of Nx's most powerful features - it's derived directly from your codebase and helps you understand the relationships between your projects at a glance.

---

**[← Previous: Nx Cloud Agents](./17-nx-cloud-agents.md) | [Next: Run Tasks and Task Pipelines →](./19-task-pipelines.md)**

---
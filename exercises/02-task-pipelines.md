---

**[← Previous: Initialize Nx](./01-initialize-nx.md) | [Next: Affected & Caching →](./03-affected-and-caching.md)**

---

# Exercise: Run Tasks and Task Pipelines

In this exercise, you'll learn how to run various executors including serve, build, lint, test, and e2e commands. You'll also understand command structure variations and explore build outputs and development server functionality.

## 1. Understanding Nx Task Commands

Nx provides multiple ways to run tasks. Let's explore the different command structures and their use cases.

### 1.1. Basic Task Execution

Run a task for a specific project:

```bash
# Basic syntax: nx [target] [project]
nx build animals
nx serve zoo
```

### 1.2. Alternative Command Structure

You can also use the `run` command with the full target specification:

```bash
# Alternative syntax: nx run [project]:[target]
nx run animals:build
nx run zoo:serve
```

Both command structures do the same thing - use whichever feels more natural to you.

## 3. Understanding Task Pipelines

Task pipelines ensure tasks run in the correct order and handle dependencies automatically.

### 3.1. Automatic Task Dependencies

When you run a task, Nx automatically runs its dependencies first:

```bash
# This will run build tasks for dependencies first
nx build zoo
```

You'll see output like:
```
✓ nx run @tuskdesign/animals:build
✓ nx run @tuskdesign/names:build  
✓ nx run @tuskdesign/zoo:build
```

### 3.2. Understanding dependsOn Configuration

Nx automatically configured this `build` task pipeline for you.  In your `nx.json` file, you'll see this task pipeline configuration:

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

- `"^build"` means "build tasks of dependencies"

### 3.3. Visualizing Task Dependencies

Use the `--graph` flag to see the task dependency graph:

```bash
# Show the task graph for a specific target
nx run zoo:build --graph
```

## 4. Create a Task Pipeline

Delete the `packages/zoo/dist` folder and then serve the `zoo` project.

```bash
rm -rf ./packages/zoo/dist
nx serve zoo
```

You'll see an error because the `serve` task actually depends on the `build` task.  Let's create that dependency so that Nx will automatically run it for us.

### 4.1. Create a Serve Task Pipeline

Update the `nx.json` file to have `serve` depend on `build`

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    },
    "serve": {
      "dependsOn": ["build"]
    }
  }
}
```

In this configuration `"dependsOn": ["build"]` means the task depends on the `build` task of the same project.

### 4.2. Test the New Pipeline

Now we can run the `serve` task and Nx will make sure that the `build` task output has been run ahead of time.

```bash
nx serve zoo
```

## 5. Running Multiple Tasks

### 5.1. Run Many Tasks

Execute the same task across multiple projects:

```bash
# Run build for all projects
nx run-many -t build

# Run multiple targets
nx run-many -t build,test,lint

# Run tasks for specific projects
nx run-many -t build -p zoo,animals
```

## 5. Understanding the Output

After completing this exercise, you should understand:

- How to run various types of tasks (build, serve, lint, test, e2e)
- How task pipelines ensure dependencies are built in the correct order
- How to run tasks across multiple projects efficiently
- How to visualize task dependencies using the task graph

The task pipeline system is one of Nx's core features that makes it much easier to manage complex build processes in monorepos.

---

**[← Previous: Initialize Nx](./01-initialize-nx.md) | [Next: Affected & Caching →](./03-affected-and-caching.md)**

---
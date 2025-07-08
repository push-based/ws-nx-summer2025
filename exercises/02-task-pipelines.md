---

**[← Previous: Initialize Nx](./18-initialize-nx.md)**

---

# Exercise: Run Tasks and Task Pipelines

In this exercise, you'll learn how to run various executors including serve, build, lint, test, and e2e commands. You'll also understand command structure variations and explore build outputs and development server functionality.

## 1. Understanding Nx Task Commands

Nx provides multiple ways to run tasks. Let's explore the different command structures and their use cases.

### 1.1 Basic Task Execution

Run a task for a specific project:

```bash
# Basic syntax: nx [target] [project]
npx nx build @tuskdesign/zoo
npx nx serve @tuskdesign/zoo
npx nx lint @tuskdesign/animals
npx nx test @tuskdesign/names
```

### 1.2 Alternative Command Structure

You can also use the `run` command with the full target specification:

```bash
# Alternative syntax: nx run [project]:[target]
npx nx run @tuskdesign/zoo:build
npx nx run @tuskdesign/zoo:serve
npx nx run @tuskdesign/animals:lint
npx nx run @tuskdesign/names:test
```

Both command structures do the same thing - use whichever feels more natural to you.

## 2. Exploring Common Executors

### 2.1 Build Tasks

Build tasks compile your code and create distributable artifacts:

```bash
# Build a specific project
npx nx build @tuskdesign/zoo

# Build all projects
npx nx run-many -t build

# Build only affected projects
npx nx affected -t build
```

**Explore the build output:**
- After running a build command, check the `dist` folder
- Notice how TypeScript files are compiled to JavaScript
- Observe the folder structure in the output

### 2.2 Serve Tasks

Serve tasks start development servers:

```bash
# Start the development server
npx nx serve @tuskdesign/zoo

# Alternative syntax
npx nx run @tuskdesign/zoo:serve
```

**Understanding serve behavior:**
- The serve task may depend on the build task
- Check the terminal output to see what gets executed
- The server typically runs on `localhost` with a specific port

### 2.3 Lint Tasks

Lint tasks check code quality and style:

```bash
# Lint a specific project
npx nx lint @tuskdesign/zoo

# Lint all projects
npx nx run-many -t lint

# Lint only affected projects
npx nx affected -t lint
```

### 2.4 Test Tasks

Test tasks run unit tests:

```bash
# Run tests for a specific project
npx nx test @tuskdesign/animals

# Run all tests
npx nx run-many -t test

# Run tests for affected projects
npx nx affected -t test
```

### 2.5 E2E Tasks

End-to-end tests verify the complete application workflow:

```bash
# Run e2e tests (if configured)
npx nx e2e your-app-e2e

# Run e2e tests with specific configuration
npx nx run your-app-e2e:e2e
```

## 3. Understanding Task Pipelines

Task pipelines ensure tasks run in the correct order and handle dependencies automatically.

### 3.1 Automatic Task Dependencies

When you run a task, Nx automatically runs its dependencies first:

```bash
# This will run build tasks for dependencies first
npx nx build @tuskdesign/zoo
```

You'll see output like:
```
✓ nx run @tuskdesign/animals:build
✓ nx run @tuskdesign/names:build  
✓ nx run @tuskdesign/zoo:build
```

### 3.2 Visualizing Task Dependencies

Use the `--graph` flag to see the task dependency graph:

```bash
# Show the task graph for a specific target
npx nx run @tuskdesign/zoo:build --graph

# Show the task graph for serve
npx nx run @tuskdesign/zoo:serve --graph
```

### 3.3 Understanding dependsOn Configuration

In your `nx.json` file, you'll see task pipeline configuration:

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

- `"^build"` means "build tasks of dependencies"
- `"build"` means "build task of the current project"

## 4. Running Multiple Tasks

### 4.1 Run Many Tasks

Execute the same task across multiple projects:

```bash
# Run build for all projects
npx nx run-many -t build

# Run multiple targets
npx nx run-many -t build,test,lint

# Run tasks for specific projects
npx nx run-many -t build -p @tuskdesign/zoo,@tuskdesign/animals
```

### 4.2 Affected Tasks

Run tasks only for projects affected by your changes:

```bash
# Run build for affected projects
npx nx affected -t build

# Run multiple targets for affected projects
npx nx affected -t build,test,lint

# Compare against a specific base
npx nx affected -t build --base=main
```

## 5. Caching and Performance

### 5.1 Understanding Caching

Nx automatically caches task results:

```bash
# Run build twice - second time should be instant
npx nx build @tuskdesign/zoo
npx nx build @tuskdesign/zoo
```

On the second run, you'll see:
```
Nx read the output from the cache instead of running the command for 3 out of 3 tasks.
```

### 5.2 Cache Information

Use the `--verbose` flag to see more caching details:

```bash
npx nx build @tuskdesign/zoo --verbose
```

## 6. Practical Exercises

### 6.1 Build and Serve Workflow

1. Delete the `dist` folder if it exists
2. Run the serve command and observe what happens
3. Check if the build runs automatically
4. Verify the development server starts correctly

### 6.2 Task Pipeline Experimentation

1. Try running different combinations of tasks
2. Use the `--graph` flag to visualize dependencies
3. Experiment with the `run-many` and `affected` commands
4. Observe how caching affects subsequent runs

### 6.3 Command Structure Practice

Practice using both command structures:

```bash
# Method 1: nx [target] [project]
npx nx build @tuskdesign/zoo

# Method 2: nx run [project]:[target]
npx nx run @tuskdesign/zoo:build
```

Use whichever syntax feels more intuitive to you.

## 7. Understanding the Output

After completing this exercise, you should understand:

- How to run various types of tasks (build, serve, lint, test, e2e)
- The difference between the two command syntax options
- How task pipelines ensure dependencies are built in the correct order
- How to run tasks across multiple projects efficiently
- How Nx's caching system improves performance
- How to visualize task dependencies using the task graph

The task pipeline system is one of Nx's core features that makes it much easier to manage complex build processes in monorepos.

---

**[← Previous: Initialize Nx](./18-initialize-nx.md)**

---
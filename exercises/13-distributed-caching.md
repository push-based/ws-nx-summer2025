---

**[← Previous: Connect to Nx Cloud](./12-connect-to-nx-cloud.md) | [Next: Simple CI/CD Pipeline →](./14-simple-pipeline.md)**

---

# Nx Replay

In this exercise you'll get to know the power of nx distributed caching.

## 1. Recap Cache

### 1.1 Recap Local Cache

First, let's recap the nxs local cache. It is already enabled by default and you can confirm
by taking a look at your `nx.json`. In the `targetDefaults` section, you'll find `cache: true`.

```json
{
  "targetDefaults": {
    "build": {
      "cache": true // <-- local cache enabled
    }
  }
}
```

Please do a change in your codebase and run `nx build movies`. It will start the build process for your application.
After it is finished, repeat the step.

You should notice the build is running significantly faster than before.
Your terminal should output the following statement:

`> nx run movies:build:production  [existing outputs match the cache, left as is]`

### 1.2 Experience Cloud Cache

You've now fed the cloud cache with your local build.

You can easily confirm that.

Either run `npx nx reset` or delete the contents of the `.nx/cache` & `.nx/workspace-data` folder.

```bash
npx nx reset

# OR

rm -rf ./nx/cache
rm -rf ./nx/workspace-data

```

Now run `npx nx build movies` again.

You should see how the nx graph computes and then you'll be presented with the dist from the nx cloud.
The terminal confirms that as well.

```bash
> nx run movies:build  [remote cache]


———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 NX   Successfully ran target build for project movies (2s)

Nx read the output from the cache instead of running the command for 1 out of 1 tasks.


Nx Cloud made it possible to reuse movies: https://nx.app/runs/l13K0mJRvR
```

## 2. Find a Cache Consumer ;-)

Find yourself someone in the room who is willing to be your cache consumer :-). Everyone should follow
all steps of this exercise. But please let someone other than yourself also check out your branch, experience the cache
and vice versa.
This part of the exercise is more fun doing with someone else.

## 3. Distributed Caching

Local cache is cool, however, your team & your infrastructure will still build the very
same artifacts over and over again. We can mitigate this issue by sharing
a cache between all stakeholders.

### 3.1 Create and distribute your cache

Now do changes to your code base and push everything to your branch.

Make sure to perform at least a `nx build movies` run.

You'll notice the outcome of the build is stating some details about the cloud cache.
You'll also find a link that gives you more information about your run.

![nx-cloud-cache](images/nx-cloud-cache.png)

Tell the name of your branch to your partner you've searched before
and let him or her pull your changes. Then they should also perform a build.

```bash
nx build movies
```

You should notice the build on the other computer was instant as the cloud cache delivered the result 
immediately. It'll also give the same detail information about the nx cloud run.

Now you all can follow the link and inspect the dashboard :-)

---

**[← Previous: Connect to Nx Cloud](./12-connect-to-nx-cloud.md) | [Next: Simple CI/CD Pipeline →](./14-simple-pipeline.md)**

---

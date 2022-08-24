# Contributing to openshift-rest-client

## Issue contributions

### Did you find a bug?

Open a [new issue](https://github.com/nodeshift/openshift-rest-client/issues/new).
Be sure to include a title and clear description, with as much relevant information
as possible. If you have a code sample that illustrates the problem that would be even better!

## Code contributions

### Fork

Fork the project [on GitHub](https://github.com/nodeshift/openshift-rest-client)
and check out your copy locally.

```
git clone git@github.com:username/openshift-rest-client.git
cd openshift-rest-client
git remote add upstream https://github.com/nodeshift/openshift-rest-client.git
```

### Branch

Create a feature branch and start hacking:

```
git checkout -b my-contrib-branch
```

### Commit messages

Writing good commit logs is important. A commit log should describe what
changed and why. Follow these guidelines when writing one:

  1. The first line should be 50 characters or less and contain a short
    description of the change.
  2. Keep the second line blank.
  3. Wrap all other lines at 72 columns.

Example of commit message:

```
bug: timeout flakeyness resolved

Occasionally, when tries to access the API, it remains in an
unresolved state. This fixes that issue by modifying the frobjam
function to return the first framble it can find.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way `git log` will show things
nicely even when it is indented.
```

### Rebase to keep updated

Use `git rebase` to sync your work from time to time.

```
git fetch upstream
git rebase upstream/main
```

### Development cycle

Bug fixes and features should come with tests.
The tests are on `test` directory. Before submitting a pull request,
ensure that your change will pass CI.

```sh
npm install
npm test

or

npm it
```

The test script calls the lint script. But you can run only the lint with `npm run pretest`.


### Push

```
git push origin my-contrib-branch
```

Go to https://github.com/yourusername/openshift-rest-client and select your feature branch.
Click the 'Pull Request' button and fill out the form.

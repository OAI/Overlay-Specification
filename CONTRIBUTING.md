# Contribute to the OpenAPI Overlay Specification

We welcome contributions and discussion.
Bug reports and feature requests are welcome, please add an issue explaining your use case.
Pull requests are also welcome, but it is recommended to create an issue first, to allow discussion.

Questions and comments are also welcome - use the GitHub Discussions feature.
You will also find notes from past meetings in the Discussion tab.

## Key information

This project is covered by our [Code of Conduct](https://github.com/OAI/OpenAPI-Specification?tab=coc-ov-file#readme).
All participants are expected to read and follow this code.

No changes, however trivial, are ever made to the contents of published specifications (the files in the `versions/` folder).
Exceptions may be made when links to external documents have been changed by a 3rd party, in order to keep our documents accurate.

Published versions of the specification are in the `versions/` folder.
The under-development versions of the specification are in the file `src/overlay.md` on the appropriately-versioned branch.
For example, work on the next release for 1.1 is on `v1.1-dev` in the file `src/overlay.md`.

The [spec site](https://spec.openapis.org) is the source of truth for the OpenAPI Overlay specification as it contains all the citations and author credits.

The OpenAPI project is almost entirely staffed by volunteers.
Please be patient with the people in this project, who all have other jobs and are active here because we believe this project has a positive impact in the world.

## Pull Requests

Pull requests are always welcome but please read the section below on [branching strategy](#branching-strategy) before you start.

Pull requests must come from a fork; create a fresh branch on your fork based on the target branch for your change.

### Branching Strategy

Overview of branches:

The `main` branch holds

- published versions of the specification, named `versions/X.Y.Z.md`,
- work-in-progress versions of the specification, named `versions/X.Y.Z-dev.md`,
- sources for published schema versions in `schemas/vX.Y` folders and their tests in `tests/vX.Y` folders,
- sources for work-in-progress schema versions in `schemas/vX.Y-dev` folders and their tests in `tests/vX.Y-dev` folders,
- utility scripts and supporting documentation.

Other branches are usually short-lived, for example for maintaining utility scripts.

### Reviewers

All pull requests must be reviewed and approved by one member of the Overlay-Maintainers team. Reviews from other contributors are always welcome.

Additionally, all pull requests that change specification files in the `versions` folder must be approved by two Overlay-Maintainers team members.

## Build the HTML versions locally

We use ReSpec to render the markdown specification as HTML for publishing and easier reading.
These instructions explain how you can build the HTML locally.

You will need NodeJS 18 or later.

Install dependencies:

```sh
npm install
```

Produce stand-alone HTML files for all final specifications in the local `deploy/overlay` folder:

```sh
npm run build
```

Produce stand-alone HTML files for all work-in-progress specifications in the local `deploy-preview` folder:

```sh
npm run build-dev
```

## Publishing

### Specification Versions

The specification versions are published to the [spec site](https://spec.openapis.org) by creating an `vX.Y.Z-rel` branch where `versions/X.Y.Z-dev.md` is renamed to `versions/X.Y.Z.md` and then merged into `main`.
This renaming preserves the commit history when using `git log --follow`.

The steps for creating a `vX.Y.Z-rel` branch are:

1. Update `EDITORS.md` in a temporary branch and merge changes back into `main` via pull request
2. Prepare spec files in a temporary branch:
   - `npm run format-markdown`
   - `npm run build-dev`
   - open `deploy-preview/X.Y.Z-dev.html` in browser and verify correct formatting
   - adjust and repeat until done
   - merge changes back into `main` via pull request
3. Create branch `vX.Y.Z-rel` from `main` in the OAI/Overlay-Specification repo and adjust it
   - the bash script `scripts/adjust-release-branch.sh` does this:
     - move file `versions/X.Y.Z-dev.md` to `versions/X.Y.Z.md` and replace the release date placeholder `| TBD |` in the history table of Appendix A with the current date
     - copy file `EDITORS.md` to `versions/X.Y.Z-editors.md`
     - for an X.Y.0 release
       - move folder `schemas/vX.Y-dev` to `schemas/vX.Y`
       - move folder `tests/vX.Y-dev` to `tests/vX.Y`
4. Commit, push, and merge `vX.Y.Z-rel` into `main` via pull request
5. Archive branch `vX.Y.Z-rel`

HTML renderings of the specification versions are generated from the `versions` folder on `main` by the `respec` workflow on changes to files in that folder, which generates a pull request for publishing the HTML renderings to the [spec site](https://spec.openapis.org/overlay). The workflow can be run manually if required.

Schema iterations are generated from the YAML source files in `schemas/vX.Y` by converting them to JSON, renaming to the relevant last-changed dates, and replacing the `WORK-IN-PROGRESS` placeholders with these dates. This is done by the `schema-publish` workflow on changes to files in these folders, which generates a pull request for publishing the new schema iterations to the [spec site](https://spec.openapis.org/overlay). The workflow can be run manually if required.

#### Start Next Patch Version

Once the released specification version is published, the next patch version X.Y.(Z+1) can be started:

1. Run bash script `scripts/start-release.sh X.Y.(Z+1)` in branch `main` to
   - create branch `start-X.Y.(Z+1)`
   - initialize `versions/X.Y.(Z+1)-dev.md` with empty history and content from `versions/X.Y.Z.md`
   - change version heading to X.Y.(Z+1) and add a new line to the version history table in Appendix A
   - commit changes
2. Push branch `start-X.Y.(Z+1)` and merge into `main` via pull request

#### Start New Minor or Major Version

A new minor version X.(Y+1).0 or major version (X+1).0.0 is started similarly:

1. Run bash script `scripts/start-release.sh X'.Y'.0` in branch `main` to
   - create branch `start-X'.Y'.0`
   - initialize `versions/X'.Y'.0-dev.md` with empty history and content from `versions/X.Y.Z.md`
   - change version heading to X'.Y'.0 and add a new line to the version history table in Appendix A
   - copy schema files `schemas/vX.Y` to `schemas/vX'.YY'-dev` and change version in all schema files
   - copy schema tests `tests/vX.Y` to `tests/vX'.YY'-dev` and change version in all test files
   - commit changes
2. Push branch `start-X'.Y'.0` and merge into `main` via pull request

### Publishing using WSL

If you are running those scripts using Windows Subsystems for Linux (WSL), and cloned the repository under windows, you'll need to make a few adjustments before you can run these procedures:

1. Save the scripts using LF, not CRLF to avoid parsing issues. You can use VSCode or any other editor to do that. Alternatively, you may clone the repository again from WSL to workaround the line return issue.
1. Make sure you run the npm install from WSL and not from windows.
1. If you run into issues launching chrome, [review this StackOverflow answer](https://stackoverflow.com/a/78776116/3808675).

## Style guide for Overlay Specification

Some terminology and when to use it:

- **Overlay Specification** - <https://spec.openapis.org/overlay/latest.html> , the full specification document.
- **Overlay** - a file containing Overlay specification content, that can be overlaid onto an OpenAPI description. (Note: "Overlay" is a noun, unlike OpenAPI where the file would be "OpenAPI description").
- **Overlays** - more informal form, can refer to more than one Overlay, or to the general concept covered by the Overlay Specification.

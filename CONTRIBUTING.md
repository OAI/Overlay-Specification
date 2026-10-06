# Contribute to the OpenAPI Overlay Specification

We welcome contributions and discussion.
Bug reports and feature requests are welcome, please add an issue explaining your use case.
Pull requests are also welcome, but it is recommended to create an issue first, to allow discussion.

Questions and comments are also welcome - use the GitHub Discussions feature.
You will also find notes from past meetings in the Discussion tab.

## Key information

This project is covered by our [Code of Conduct](https://github.com/OAI/OpenAPI-Specification?tab=coc-ov-file#readme) and [AI policy](AI.md).
All participants are expected to read and follow these policies.

No changes, however trivial, are ever made to the contents of published specifications (the files in the `versions/` folder).
Exceptions may be made when links to external URLs have been changed by a 3rd party, in order to keep our documents accurate.

Published versions of the specification are in the `versions/` folder.
The under-development versions of the specification are in the file `src/overlay.md` on the appropriately-versioned branch.
For example, work on the next patch release for 1.2 is on `v1.2-dev` in the file `src/overlay.md`.
The next minor release will be developed on `v1.3-dev` once that branch has been created.

The [spec site](https://spec.openapis.org) is the source of truth for the OpenAPI Overlay specification as it contains all the citations and author credits.

The OpenAPI project is almost entirely staffed by volunteers.
We expect you to contribute here respectfully, politely, and with good intentions.
When you engage with this project, please:

- review existing content: check the existing specification, documentation, and issues/discussions before starting a new discussion, issue or pull request.
- respect everyone's time: keep your communication relevant and concise.
- hold responsibility for your work: you should be able to explain or answer questions about anything you have posted to the project as your own.

We actively close interactions that don't meet these expectations, so please don't be offended as we protect the time and energy of our volunteers.
If you do think that something was closed in error, you are welcome to reach out to us to follow up.

## Shared infrastructure

This repository uses the shared OpenAPI Initiative infrastructure package
[`@oai/build-infra`](https://github.com/OAI/build-infra) for Markdown
validation, HTML builds, schema publication, schema tests, and release helper
commands. The Yarn scripts in this repository are intentionally thin wrappers
around that package.

The shared infrastructure docs explain how the tooling works and how to maintain
it:

- [build-infra README](https://github.com/OAI/build-infra/blob/main/README.md)
- [build-infra CONTRIBUTING](https://github.com/OAI/build-infra/blob/main/CONTRIBUTING.md)

Most contributors only need the commands shown below. Maintainers changing the
tooling itself should read the build-infra docs first.

## Pull Requests

Pull requests are always welcome but please read the section below on [branching strategy](#branching-strategy) before you start.

Pull requests must come from a fork; create a fresh branch on your fork based on the target branch for your change.

### Branching Strategy

#### Active branches

The current and planned active specification releases are:

| Version | Branch | Notes |
| ------- | ------ | ----- |
| 1.2.x | `v1.2-dev` | active patch release line |
| 1.3.0 | `v1.3-dev` | next minor release; branch not yet created |

#### Target the earliest relevant active `*-dev` branch

Branch from and submit specification pull requests to the earliest relevant active `vX.Y-dev` branch.
For example, a correction that applies to 1.2 should target `v1.2-dev`.
Changes that introduce features for the next minor release should target `v1.3-dev` once that branch has been created; until then, use an issue or discussion to develop the proposal.

The development branch contains the work-in-progress specification in `src/overlay.md` and its schema in `src/schemas/validation`.

For repository files that affect all versions, such as Markdown documentation, automation, and scripts, target the `main` branch.
The `main` branch contains published specifications in `versions/X.Y.Z.md`, published schemas, schema tests, and supporting repository files; it does not contain the active `src` tree.

### Reviewers

All pull requests must be reviewed and approved by one member of the Overlay-Maintainers team. Reviews from other contributors are always welcome.

Additionally, all pull requests that change `src/overlay.md` must be approved by two Overlay-Maintainers team members.

## Preview specification HTML locally

We use ReSpec to render the markdown specification as HTML for publishing and easier reading.
Before creating a pull request or marking a draft pull request as ready for review, validate your changes locally:

1. Install Node.js 24 and run `corepack enable` once to make the repository's pinned Yarn version available
2. Check out this repository, go to the repository root, and switch to the appropriate development branch
3. Run `yarn install --immutable` and repeat this after merging upstream changes
4. Run the commands relevant to what you changed:

   | Command | What it does |
   | ------- | ------------ |
   | `yarn validate-markdown` | markdownlint and link checking for a fast loop while editing |
   | `yarn format-markdown` | automatically fixes markdownlint violations |
   | `yarn build` | builds all published specifications into `deploy/overlay` |
   | `yarn build-src` | validates and builds the work-in-progress specification and schema into `deploy-preview` |
   | `yarn test` | runs the JSON Schema and build tooling test suites |

5. After `yarn build-src`, open the generated file in `deploy-preview` with a browser and check your changes

Please make sure the Markdown validates and builds, and that `yarn test` passes, before creating a pull request or marking a draft pull request as ready for review.

## Publishing

### Specification Versions

The specification versions are published to the [spec site](https://spec.openapis.org) by creating a `vX.Y.Z-rel` branch from `vX.Y-dev`, copying `src/overlay.md` to `versions/X.Y.Z.md`, and then merging the release branch into `main`.

Before starting, check that the release content and release notes have the required maintainer approval.

The steps for publishing a new specification version are:

1. Update `EDITORS.md` on `main` via pull request
2. Merge `main` into `vX.Y-dev` via pull request
3. Prepare the specification files on `vX.Y-dev`:
   - `yarn format-markdown`
   - `yarn build-src`
   - `yarn test`
   - open the generated HTML file in `deploy-preview` and verify correct formatting
   - adjust and repeat until done
   - merge any final changes back into `vX.Y-dev` via pull request
4. Create branch `vX.Y.Z-rel` from `vX.Y-dev` in the OAI/Overlay-Specification repository and run `yarn adjust-release-branch`
   - the command:
     - copies `src/overlay.md` to `versions/X.Y.Z.md` and replaces the release date placeholder `| TBD |` in the history table of Appendix A with the current date
     - copies `EDITORS.md` to `versions/X.Y.Z-editors.md`
     - removes the development-only `src` folder
     - stages the release changes
   - review the staged changes with `git diff --cached`
   - commit the changes
5. Push and merge `vX.Y.Z-rel` into `main` via pull request
6. Tag a release using GitHub's Releases feature and add the release notes as the description
7. Merge `main` back into `vX.Y-dev` via pull request
8. Archive branch `vX.Y.Z-rel`

HTML renderings of the specification versions are generated from the `versions` folder on `main` by the `respec` workflow on changes to files in that folder, which generates a pull request for publishing the HTML renderings to the [spec site](https://spec.openapis.org/overlay). The workflow can be run manually if required.

Schema iterations are generated from the YAML source files in `schemas/vX.Y` by converting them to JSON, renaming to the relevant last-changed dates, and replacing the `WORK-IN-PROGRESS` placeholders with these dates. This is done by the `schema-publish` workflow on changes to files in these folders, which generates a pull request for publishing the new schema iterations to the [spec site](https://spec.openapis.org/overlay). The workflow can be run manually if required.

The release commands are implemented in [`OAI/build-infra`](https://github.com/OAI/build-infra).
If a command behaves unexpectedly, check this repository's `spec.config.json` first, then see the [build-infra release documentation](https://github.com/OAI/build-infra/blob/main/README.md#release-process-summary).

#### Start Next Patch Version

Once the released specification version is published and synced back to the `vX.Y-dev` branch, the next patch version X.Y.(Z+1) can be started:

1. Run `yarn start-release` on `vX.Y-dev` to:
   - create branch `vX.Y-dev-start-X.Y.(Z+1)`
   - initialize `src/overlay.md` with empty history and content from `versions/X.Y.Z.md`
   - change the version heading to X.Y.(Z+1) and add a new line to the version history table in Appendix A
   - commit the changes
2. Push branch `vX.Y-dev-start-X.Y.(Z+1)` and merge it into `vX.Y-dev` via pull request

#### Start New Minor or Major Version

A new minor version X.(Y+1).0 or major version (X+1).0.0 is started similarly:

1. Create branch `vX'.Y'-dev` from the previous development branch
2. Run `yarn start-release` on the new development branch to:
   - create branch `vX'.Y'-dev-start-X'.Y'.0`
   - initialize `src/overlay.md` with empty history and content from the latest published specification
   - change the version heading to X'.Y'.0 and add a new line to the version history table in Appendix A
   - update the configured schema files to the new minor version
   - commit the changes
3. Push branch `vX'.Y'-dev-start-X'.Y'.0` and merge it into `vX'.Y'-dev` via pull request

### Publishing using WSL

If you are running those scripts using Windows Subsystems for Linux (WSL), and cloned the repository under windows, you'll need to make a few adjustments before you can run these procedures:

1. Save the scripts using LF, not CRLF to avoid parsing issues. You can use VSCode or any other editor to do that. Alternatively, you may clone the repository again from WSL to workaround the line return issue.
1. Make sure you run the yarn install from WSL and not from windows.
1. If you run into issues launching chrome, [review this StackOverflow answer](https://stackoverflow.com/a/78776116/3808675).

## Style guide for Overlay Specification

Some terminology and when to use it:

- **Overlay Specification** - <https://spec.openapis.org/overlay/latest.html> , the full specification document.
- **Overlay** - a file containing Overlay specification content, that can be overlaid onto an OpenAPI description. (Note: "Overlay" is a noun, unlike OpenAPI where the file would be "OpenAPI description").
- **Overlays** - more informal form, can refer to more than one Overlay, or to the general concept covered by the Overlay Specification.

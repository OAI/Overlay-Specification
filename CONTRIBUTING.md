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
- sources for published schema versions in  `schemas/vX.Y` folders and their tests in `tests/vX.Y` folders,
- sources for work-in-progress schema versions in `schemas/vX.Y-dev` folders and their tests in `tests/vX.Y-dev` folders,
- utility scripts and supporting documentation.

Other branches are usually short-lived, for example and for maintaining utility scripts.

## Build the HTML version to publish

We use ReSpec to render the markdown specification as HTML for publishing and easier reading.
These instructions explain how you can build the HTML locally.

You will need NodeJS 18 or later.

Install dependencies:

```sh
npm install
```

Produce stand-alone HTML files in the local `deploy/overlay` folder:

```sh
npm run build
```

Note that Linux users may need to add `--no-sandbox` to run `npx respec` as found in the `scripts/md2html/build.sh` file.

## Style guide for Overlay Specification

Some terminology and when to use it:

- **Overlay Specification** - <https://spec.openapis.org/overlay/latest.html> , the full specification document.
- **Overlay** - a file containing Overlay specification content, that can be overlaid onto an OpenAPI description. (Note: "Overlay" is a noun, unlike OpenAPI where the file would be "OpenAPI description").
- **Overlays** - more informal form, can refer to more than one Overlay, or to the general concept covered by the Overlay Specification.

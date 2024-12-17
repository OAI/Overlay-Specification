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
Exceptions may be made when links to external URLs have been changed by a 3rd party, in order to keep our documents accurate.

Published versions of the specification are in the `versions/` folder.
The under-development versions of the specification are in the file `spec/overlay.md` on the appropriately-versioned branch.
For example, work on the next release for 1.1 is on `v1.1-dev` in the file `spec/overlay.md`.

The [spec site](https://spec.openapis.org) is the source of truth for the OpenAPI Overlay specification as it contains all the citations and author credits.

The OpenAPI project is almost entirely staffed by volunteers.
Please be patient with the people in this project, who all have other jobs and are active here because we believe this project has a positive impact in the world.

## Pull Requests

Pull requests are always welcome but please read the section below on [branching strategy](#branching-strategy) before you start.

Pull requests must come from a fork; create a fresh branch on your fork based on the target branch for your change.

### Branching Strategy

Overview of branches:

- `main` holds the published versions of the specification, utility scripts and supporting documentation.
- `dev` is for development infrastructure and other changes that apply to multiple versions of development.
- Branches named `vX.Y-dev` are the active development branches for future releases.
  All changes should be applied to the _earliest_ branch where the changes is relevant in the first instance.

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

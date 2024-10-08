# Overlay-Specification

The Overlay Specification is a community-driven open specification within the [OpenAPI Initiative](https://www.openapis.org/), a Linux Foundation Collaborative Project.

The Overlay specification defines a way of creating documents that contain information to be merged with an OpenAPI description at some later point in time, for the purpose of updating the OpenAPI description with additional information.

Overlays can address a wide range of scenarios that have been frequently requested by OpenAPI users:

- Support multi-language API descriptions by using Overlays to contain language translations.
- Provide configuration information for different deployment environments.
- Allow separation of concerns for metadata such as gateway configuration or SLA information.
- Support a traits like capability for applying a set of configuration data, such as multiple parameters, or multiple headers to a targeted object.
- Provide default responses, or parameters where they are not explicitly provided.
- Apply configuration data globally or based on filter conditions.

## Current Status

The current specification is sufficiently stable for implementers to start experimenting.  We are looking for implementation experience to guide our decisions on the remaining open issues.

## Tools that support Overlays

If you are looking for tools to use with Overlays, try these:

- [Bump.sh CLI](https://github.com/bump-sh/cli)
- [Speakeasy CLI](https://www.speakeasy.com/docs/speakeasy-cli/getting-started)
- [overlays-js](https://github.com/lornajane/openapi-overlays-js)

(Is something missing from the list? Send us a pull request to add it!)

## Licensing

See: [License (Apache-2.0)](./LICENSE)

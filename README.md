# Overlay Specification

The Overlay specification defines a document format for information that will augment an existing OpenAPI description without entangling that information in the OpenAPI description's source doccument(s).

This specfication is a community-driven, open specification within the [OpenAPI Initiative](https://www.openapis.org/), a Linux Foundation Collaborative Project.

Overlays support a range of scenarios, including:

- Translating documentation into another language
- Providing configuration information for different deployment environments
- Allowing separation of concerns for metadata such as gateway configuration or SLA information
- Supporting a traits-like capability for applying a set of configuration data, such as multiple parameters or multiple headers, for targeted objects
- Providing default responses or parameters where they were not explicitly provided
- Appling configuration data globally or based on filter conditions

## Current Status

The current specification is sufficiently stable for implementers to start experimenting. We are looking for implementation experience to guide our decisions on the remaining open issues.

## Tools that support Overlays

If you are looking for tools to use with Overlays, try these:

- [Bump.sh CLI](https://github.com/bump-sh/cli)
- [Speakeasy CLI](https://www.speakeasy.com/docs/speakeasy-cli/getting-started)
- [overlays-js](https://github.com/lornajane/openapi-overlays-js)

(Is something missing from the list? Send us a pull request to add it!)

## Licensing

See: [License (Apache-2.0)](./LICENSE)

# Overlay Specification

The [Overlay Specification](https://spec.openapis.org/overlay/latest.html) defines a document format for information that augments an existing OpenAPI description yet remains separate from the OpenAPI description's source document(s).

This specification is a community-driven, open specification within the [OpenAPI Initiative](https://www.openapis.org/), a Linux Foundation Collaborative Project.

Overlays support a range of scenarios, including:

- Translating documentation into another language
- Providing configuration information for different deployment environments
- Allowing separation of concerns for metadata such as gateway configuration or SLA information
- Supporting a traits-like capability for applying a set of configuration data, such as multiple parameters or multiple headers, for targeted objects
- Providing default responses or parameters where they were not explicitly provided
- Applying configuration data globally or based on filter conditions

## Tools that Support Overlays

If you are looking for tools to use with Overlays, try these:

- [Bump.sh CLI](https://github.com/bump-sh/cli)
- [Speakeasy CLI](https://www.speakeasy.com/docs/speakeasy-cli/getting-started)
- [overlays-js](https://github.com/lornajane/openapi-overlays-js)
- [apigee-go-gen CLI](https://apigee.github.io/apigee-go-gen/transform/commands/oas-overlay/)
- [openapi-format CLI/UI](https://github.com/thim81/openapi-format)
- [oas-patch CLI](https://github.com/mcroissant/oas_patcher)
- [oas-overlay-java](https://github.com/IBM/oas-overlay-java)
- [Specmatic](https://specmatic.io/) - [Docs](https://docs.specmatic.io/documentation/contract_tests.html#overlays)
- [BinkyLabs.OpenApi.Overlays - dotnet](https://github.com/BinkyLabs/openapi-overlays-dotnet)
- [Legba - Clojure OpenAPI toolkit](https://github.com/mpenet/legba?tab=readme-ov-file#openapi-overlay-support)

(Is something missing from the list? Send us a pull request to add it!)

## Support for RFC9535 JSONPath

[RFC9535](https://www.rfc-editor.org/rfc/rfc9535) is a recent specification and libraries implementing JSONPath support might predate the RFC. Those libraries might differ entirely (expressions syntax is incompatible), implement additional capabilities (superset of the RFC), or support only a subset of the RFC.

In case the tool being use is not fully compliant with RFC9535, users MIGHT have to update some JSONPath query expressions to accommodate for the implementation in use.

This example JSONPath query expression:

```jsonpath
$.paths.*.get.parameters[?@.name=='filter' && @.in=='query']
```

might require additional optional parenthesis with some implementations like so:

```jsonpath
$.paths.*.get.parameters[?(@.name=='filter' && @.in=='query)']
```

## Licensing

See: [License (Apache-2.0)](./LICENSE)

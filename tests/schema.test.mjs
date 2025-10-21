import { readdirSync, readFileSync } from "node:fs";
import YAML from "yaml";
import {
  validate,
  setMetaSchemaOutputFormat,
} from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { describe, test, expect } from "vitest";

import contentTypeParser from "content-type";
import { addMediaTypePlugin } from "@hyperjump/browser";
import { buildSchemaDocument } from "@hyperjump/json-schema/experimental";

addMediaTypePlugin("application/schema+yaml", {
  parse: async (response) => {
    const contentType = contentTypeParser.parse(
      response.headers.get("content-type") ?? "",
    );
    const contextDialectId =
      contentType.parameters.schema ?? contentType.parameters.profile;

    const foo = YAML.parse(await response.text());
    return buildSchemaDocument(foo, response.url, contextDialectId);
  },
  fileMatcher: (path) => path.endsWith(".yaml"),
});

const parseYamlFromFile = (filePath) => {
  const schemaYaml = readFileSync(filePath, "utf8");
  return YAML.parse(schemaYaml, { prettyErrors: true });
};

const runTestSuite = (version, validateOverlay, suite = "pass") => {
  readdirSync(`./tests/v${version}/${suite}`, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
    .forEach((entry) => {
      test(entry.name, () => {
        const instance = parseYamlFromFile(`./tests/v${version}/${suite}/${entry.name}`);
        const output = validateOverlay(instance, BASIC);
        if (suite === "pass")
          expect(output).to.deep.equal({ valid: true });
        else
          expect(output.valid).to.equal(false);
      });
    });
}

setMetaSchemaOutputFormat(BASIC);

const versions = ["1.0", "1.1"];

describe.each(versions)("v%s", async (version) => {
  let validateOverlay;
  try {
    validateOverlay = await validate(`./schemas/v${version}/schema.yaml`);
  } catch (error) {
    console.error(error.output);
    process.exit(1);
  }
  describe("Pass", () => {
    runTestSuite(version, validateOverlay);
  });

  describe("Fail", () => {
    runTestSuite(version, validateOverlay, "fail");
  });
});

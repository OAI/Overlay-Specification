import { readdirSync, readFileSync } from "node:fs";
import YAML from "yaml";
import { describe, test, expect } from "vitest";

const parseYamlFromFile = (filePath) => {
  const schemaYaml = readFileSync(filePath, "utf8");
  return YAML.parse(schemaYaml, { prettyErrors: true });
};

function runTestSuite(version, suite) {
  const schema = `./schemas/v${version}/schema.yaml`;
  describe(suite, () => {
    readdirSync(`./tests/v${version}/${suite}`, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
      .forEach((entry) => {
        test(entry.name, async () => {
          const instance = parseYamlFromFile(`./tests/v${version}/${suite}/${entry.name}`);
          if (suite === "pass") {
            await expect(instance).to.matchJsonSchema(schema);
          } else {
            await expect(instance).to.not.matchJsonSchema(schema);
          }
        });
      });
  });
}

const versions = ["1.0", "1.1"];

describe.each(versions)("v%s", (version) => {
  runTestSuite(version, "pass");
  runTestSuite(version, "fail");
});

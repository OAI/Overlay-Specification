import { readdirSync, readFileSync } from "node:fs";
import YAML from "yaml";
import { describe, test, expect } from "vitest";

const parseYamlFromFile = (filePath) => {
  const schemaYaml = readFileSync(filePath, "utf8");
  return YAML.parse(schemaYaml, { prettyErrors: true });
};

function runTestSuite(version, suite) {
  const schema = `./schemas/${version}/schema.yaml`;
  describe(suite, () => {
    readdirSync(`./tests/${version}/${suite}`, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
      .forEach((entry) => {
        test(entry.name, async () => {
          const instance = parseYamlFromFile(`./tests/${version}/${suite}/${entry.name}`);
          if (suite === "pass") {
            await expect(instance).to.matchJsonSchema(schema);
          } else {
            await expect(instance).to.not.matchJsonSchema(schema);
          }
        });
      });
  });
}

const version = "v1.0";

describe(version, () => {
  runTestSuite(version, "pass");
  runTestSuite(version, "fail");
});

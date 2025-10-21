import { readdirSync, readFileSync } from "node:fs";
import YAML from "yaml";
import { describe, test, expect } from "vitest";

const parseYamlFromFile = (filePath) => {
  const schemaYaml = readFileSync(filePath, "utf8");
  return YAML.parse(schemaYaml, { prettyErrors: true });
};

describe("v1.0", () => {
  describe("Pass", () => {
    readdirSync(`./tests/v1.0/pass`, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
      .forEach((entry) => {
        test(entry.name, async () => {
          const instance = parseYamlFromFile(`./tests/v1.0/pass/${entry.name}`);
          await expect(instance).to.matchJsonSchema("./schemas/v1.0/schema.yaml");
        });
      });
  });

  describe("Fail", () => {
    readdirSync(`./tests/v1.0/fail`, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
      .forEach((entry) => {
        test(entry.name, async () => {
          const instance = parseYamlFromFile(`./tests/v1.0/fail/${entry.name}`);
          await expect(instance).to.not.matchJsonSchema("./schemas/v1.0/schema.yaml");
        });
      });
  });
});

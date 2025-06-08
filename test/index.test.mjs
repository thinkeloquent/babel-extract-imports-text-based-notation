// tests/extractImports.test.js
import { expect, test } from "vitest";
import extractImports from "../index.mjs";

const testcases = [
  {
    name: "default import only",
    code: `import defaultExport from "module-name";`,
    expected: [["module-name", ["default: defaultExport"]]],
  },
  {
    name: "namespace import",
    code: `import * as name from "module-name";`,
    expected: [["module-name", ["namespace: name"]]],
  },
  {
    name: "single named import",
    code: `import { export1 } from "module-name";`,
    expected: [["module-name", ["named: export1"]]],
  },
  {
    name: "named import with alias",
    code: `import { export1 as alias1 } from "module-name";`,
    expected: [["module-name", ["named: export1 as alias1"]]],
  },
  {
    name: "default as alias",
    code: `import { default as alias } from "module-name";`,
    expected: [["module-name", ["named: default as alias"]]],
  },
  {
    name: "multiple named imports",
    code: `import { export1, export2 } from "module-name";`,
    expected: [["module-name", ["named: export1", "named: export2"]]],
  },
  {
    name: "named and aliased imports together",
    code: `import { export1, export2 as alias2 } from "module-name";`,
    expected: [["module-name", ["named: export1", "named: export2 as alias2"]]],
  },
  {
    name: "single named with alias (Hello)",
    code: `import { Hello as alias } from "module-name";`,
    expected: [["module-name", ["named: Hello as alias"]]],
  },
  {
    name: "default + named import",
    code: `import defaultExport, { export1 } from "module-name";`,
    expected: [["module-name", ["default: defaultExport", "named: export1"]]],
  },
  {
    name: "default + namespace import",
    code: `import defaultExport, * as name from "module-name";`,
    expected: [["module-name", ["default: defaultExport", "namespace: name"]]],
  },
  {
    name: "side-effect only import",
    code: `import "module-name";`,
    expected: [["module-name", []]],
  },
  {
    name: "multiple module imports",
    code: `
      import A from "a";
      import { B, C as AliasC } from "b";
    `,
    expected: [
      ["a", ["default: A"]],
      ["b", ["named: B", "named: C as AliasC"]],
    ],
  },
  {
    name: "typescript type-only import",
    code: `import type { Props } from "./types";`,
    expected: [["./types", ["named: Props"]]],
  },
  {
    name: "import with inline comment",
    code: `import defaultExport /* comment */ from "module-name";`,
    expected: [["module-name", ["default: defaultExport"]]],
  },
  {
    name: "multiline import with alias",
    code: `
      import {
        export1,
        export2 as alias2,
      } from "module-name";
    `,
    expected: [["module-name", ["named: export1", "named: export2 as alias2"]]],
  },
  {
    name: "aliasing reserved keyword",
    code: `import { default as defaultAlias } from "mod";`,
    expected: [["mod", ["named: default as defaultAlias"]]],
  },
  {
    name: "invalid string literal alias",
    code: `import { "string name" as alias } from "module-name";`,
    expectedError: true,
  },
  {
    name: "invalid syntax (missing brace)",
    code: `import { from "module";`,
    expectedError: true,
  },
];

testcases.forEach(({ name, code, expected, expectedError }) => {
  test(name, () => {
    if (expectedError) {
      expect(() => extractImports(code)).toThrow();
    } else {
      const result = extractImports(code);
      console.log(name, JSON.stringify(result, null, 2));
      expect(result).toEqual(expected);
    }
  });
});

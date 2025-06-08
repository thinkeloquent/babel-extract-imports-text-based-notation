# babel-extract-imports-text-based-notation

A utility to extract import statements from JavaScript and TypeScript code using Babel. Outputs structured or customizable text-based representations of the imported modules, including support for aliases and namespace imports.

---

## 📦 Installation

```bash
npm install babel-extract-imports-text-based-notation
```

---

## 🚀 Usage

```js
import extractImports from "babel-extract-imports-text-based-notation";

const code = `
  import React from 'react';
  import { useState as useS, useEffect } from 'react';
  import * as fs from 'fs';
  import "dotenv/config";
`;

const imports = extractImports(code);
console.log(imports);

// Output:
[
  ["react", ["default: React"]],
  ["react", ["named: useState as useS", "named: useEffect"]],
  ["fs", ["namespace: fs"]],
  ["dotenv/config", []],
];
```

---

## 🎨 Custom Output Formatting

You can extend the class to override formatting:

```js
import { ImportExtractor } from "babel-extract-imports-text-based-notation";

class CustomFormatExtractor extends ImportExtractor {
  format(imports) {
    return imports.map(
      ([module, entries]) => `"${module}" → ${entries.join(" + ")}`
    );
  }
}

const extractor = new CustomFormatExtractor();
const formatted = extractor.extract(code);
console.log(formatted);

// Output:
// [
//   '"react" → default: React + named: useState as useS + named: useEffect',
//   '"fs" → namespace: fs',
//   '"dotenv/config" →'
// ]
```

---

## ✅ Features

- ✅ JavaScript & TypeScript support
- ✅ Default, named, namespace, and side-effect imports
- ✅ JSX-aware parsing
- ✅ Aliased import handling (e.g., `import { A as B }`)
- ✅ Easily extensible formatting logic
- ✅ Supports multiple import declarations in one file

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test
```

---

## 📦 Publishing

To publish this package:

```bash
npm publish --access public
```

Ensure `package.json` includes:

```json
{
  "main": "index.mjs",
  "type": "module"
}
```

---

## 📝 License

MIT

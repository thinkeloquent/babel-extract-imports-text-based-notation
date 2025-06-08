import * as parser from "@babel/parser";
import traverseDefault from "@babel/traverse";

// Ensure compatibility with both CJS and ESM environments
const traverse = traverseDefault.default ?? traverseDefault;

/**
 * Class to extract and format import declarations from JavaScript/TypeScript code.
 */
export class ImportExtractor {
  /**
   * Extract imports and return in structured format.
   * @param {string} code - Source code to analyze
   * @returns {Array} - List of structured imports
   */
  extract(code) {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const imports = [];

    traverse(ast, {
      ImportDeclaration: (path) => {
        const moduleName = path.node.source.value;
        const specifiers = path.node.specifiers;

        const parts = [];

        for (const specifier of specifiers) {
          if (
            specifier.type === "ImportSpecifier" &&
            specifier.imported.type === "StringLiteral"
          ) {
            throw new SyntaxError(
              `Unsupported import: string literal "${specifier.imported.value}" as alias`
            );
          }

          if (specifier.type === "ImportDefaultSpecifier") {
            parts.push(`default: ${specifier.local.name}`);
          } else if (specifier.type === "ImportNamespaceSpecifier") {
            parts.push(`namespace: ${specifier.local.name}`);
          } else if (specifier.type === "ImportSpecifier") {
            const imported = specifier.imported;
            const local = specifier.local;

            const originalName =
              imported.type === "Identifier" ? imported.name : imported.value; // handles string literals, rare case

            if (originalName === local.name) {
              parts.push(`named: ${originalName}`);
            } else {
              parts.push(`named: ${originalName} as ${local.name}`);
            }
          }
        }

        imports.push([moduleName, parts]);
      },
    });

    return this.format(imports);
  }

  /**
   * Format the extracted imports (can be overridden by subclasses).
   * @param {Array} imports - Raw import array
   * @returns {Array} - Formatted imports
   */
  format(imports) {
    return imports;
  }
}

// Default export: convenience function
export default function extractImports(code) {
  const extractor = new ImportExtractor();
  return extractor.extract(code);
}

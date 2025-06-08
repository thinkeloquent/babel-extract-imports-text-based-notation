import extractImports from "./index.mjs";

console.log(
  extractImports(`
import React from "react";
`)
);

console.log(
  extractImports(`
import React, { useState, useEffect } from "react";
import * as fs from "fs";
`)
);

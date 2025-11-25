/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { glob, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { chdir } from 'process';
import chalk from 'chalk';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const include_dir = ['src/**/*.{ts,tsx,css}', 'dev-scripts/**/*.{ts,tsx}'];
const exclude_dir = ['src/components/ui/**', '**/*.gen.ts'];

console.log('Working at:', PROJECT_ROOT);
chdir(PROJECT_ROOT);

// REUSE-IgnoreStart
const SPDX_LICENSE_IDENTIFIER = 'AGPL-3.0-or-later';
const SPDX_COPYRIGHT_TEXT = 'Linca and papilio-project';

const licence_header = `
/*
 * SPDX-FileCopyrightText: ${SPDX_COPYRIGHT_TEXT}
 * SPDX-License-Identifier: ${SPDX_LICENSE_IDENTIFIER}
 */
`.trim();

const skipped: string[] = [];
const added: string[] = [];

for (const dir of include_dir) {
  for await (const item of glob(dir)) {
    if (exclude_dir.some((x) => path.matchesGlob(item, x))) {
      continue;
    }
    const text = await readFile(item, 'utf-8');
    const matched = /SPDX-License-Identifier: (.*)/.exec(text);
    if (matched != null) {
      skipped.push(item);
      continue;
    }
    const new_text = licence_header + '\n\n' + text;
    await writeFile(item, new_text, 'utf-8');
    console.log(chalk.green(`added licence header to ${item} - ${SPDX_LICENSE_IDENTIFIER}`));
    added.push(item);
  }
}

console.log('\n\n======================');
console.log(`Added ${SPDX_LICENSE_IDENTIFIER} to ${added.length} files.`);
console.log(`Skipped ${skipped.length} files that already had a SPDX-License-Identifier.`);

// REUSE-IgnoreEnd

/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { glob, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { chdir } from 'process';
import chalk from 'chalk';
import process from 'process';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const include_dir = ['src/**/*.{js,ts,tsx,css}', 'dev-scripts/**/*.{js,ts,tsx}', 'vite-plugins/**/*.{js,ts}'];
const exclude_dir = ['src/components/ui/**', '**/*.gen.ts'];

console.log('[Licence-Checker] Working at:', PROJECT_ROOT);
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

/** @type {string[]} */
const skipped = [];
/** @type {string[]} */
const added = [];

const TEST_MODE = process.argv.includes('--test');

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

    if (!TEST_MODE) {
      const new_text = licence_header + '\n\n' + text;
      await writeFile(item, new_text, 'utf-8');
      console.log(chalk.green(`added licence header to ${item} - ${SPDX_LICENSE_IDENTIFIER}`));
    }

    added.push(item);
  }
}

if (TEST_MODE) {
  if (added.length > 0) {
    console.error(chalk.red(`[Licence-Checker] ${added.length} files lack a SPDX-License-Identifier!`));
    for (const item of added) {
      console.warn(chalk.yellow(" - " + item));
    }
    process.exit(1);
  } else {
    console.log(chalk.green('[Licence-Checker] All files have a SPDX-License-Identifier.'));
  }
} else {
  console.log('\n\n======================');
  console.log(`Added ${SPDX_LICENSE_IDENTIFIER} to ${added.length} files.`);
  console.log(`Skipped ${skipped.length} files that already had a SPDX-License-Identifier.`);
}

// REUSE-IgnoreEnd

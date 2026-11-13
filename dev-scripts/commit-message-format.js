/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** @ts-check */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';

/**
 * @template T
 * @param {Array<[boolean, T]>} xs
 * @returns {T | null}
 */
function cond(xs) {
  for (const [condition, value] of xs) {
    if (condition) {
      return value;
    }
  }
  return null;
}

const FLAG_FROM_STDIO = process.argv.includes('--stdio');

/**
 * Resolve the git dir through git itself: in a linked worktree `.git` is a file,
 * so a hard-coded `.git/COMMIT_EDITMSG` would not exist.
 */
const commitMsgPath = path.join(
  execFileSync('git', ['rev-parse', '--git-dir'], { encoding: 'utf8' }).trim(),
  'COMMIT_EDITMSG',
);

/** @type {string} */
const source = FLAG_FROM_STDIO
  ? await new Promise((res) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
      });

      rl.question('> ', (answer) => {
        res(answer);
        rl.close();
      });
    })
  : await fs.readFile(commitMsgPath, 'utf8');
const [message, ...description] = source.split('\n\n');
const [categoryMatched, ...rest] = message.trim().split(' ');

const [category, subcategory, messageRest] = (() => {
  let category = categoryMatched.toLowerCase().replaceAll(':', '');
  let subcategory = '';

  let idx = category.indexOf('(');

  if (idx !== -1) {
    subcategory = category.slice(idx + 1);
    category = category.slice(0, idx);
    subcategory = subcategory.replaceAll(')', '');
  } else {
    const firstRest = rest.at(0);
    if (firstRest && firstRest.startsWith('(') && firstRest.endsWith(')')) {
      subcategory = firstRest.slice(1, -1);
      rest.shift();
    }
  }

  return [category, subcategory, rest.join(' ')];
})();

const prefix = cond([
  [category == 'feat', '✨'],
  [
    category == 'fix',
    cond([
      [messageRest.includes('CI'), '💚'],
      [subcategory == 'ci', '💚'],
      [messageRest.includes('typo'), '✏️'],
      [true, '🐛'],
    ]),
  ],
  [category == 'ux', '🚸'],
  [category == 'docs', '📝'],
  [category == 'ui', '💄'],
  [category == 'style', '💄'],
  [category == 'refactor', '♻️'],
  [category == 'breaking', '💥'],
  [category == 'i18n', '🌐'],
  [category == 'perf', '⚡️'],
  [category == 'test', '🧪'],
  [category == 'wip', '🚧'],
  [category == 'revert', '⏪️'],
  [category == 'dev', '👩‍💻'],
  [
    category == 'chore',
    cond([
      [
        messageRest.includes('depend') || subcategory === 'deps',
        cond([
          [messageRest.includes('upgrade'), '⬆️'],
          [messageRest.includes('downgrade'), '⬇️'],
          [messageRest.includes('pin'), '📌'],
          [messageRest.includes('add'), '➕'],
          [messageRest.includes('remove'), '➖'],
          [true, '👩‍💻'],
        ]),
      ],
      [messageRest.includes('format') || subcategory === 'format', '🎨'],
      [messageRest.includes('lint') || subcategory === 'lint', '🚨'],
      [messageRest.includes('licen') || messageRest.includes('licen') || subcategory.startsWith('licen'), '📄'],
      [messageRest.includes('add'), '💬'],
      [
        messageRest.includes('remove') || messageRest.includes('delete'),
        cond([
          [messageRest.includes('log'), '🔇'],
          [true, '🗑️'],
        ]),
      ],
      [true, '👩‍💻'],
    ]),
  ],
]);

if (!prefix) {
  console.error(`[commit-message-format] Unknown category: "${category}"`);
  process.exit(1);
}

function guessSubCategory() {
  if (subcategory) {
    return `(${subcategory})`;
  }

  const restLower = rest.map((s) => s.toLowerCase());

  if (restLower.includes('ci')) {
    return '(ci)';
  }

  if (restLower.includes('deps') || restLower.includes('dependency') || restLower.includes('dependencies')) {
    return '(deps)';
  }

  if (restLower.includes('linter') && restLower.includes('happy')) {
    return '(lint)';
  }

  return '';
}

const output = [
  `${prefix ? prefix + ' ' : ''}${category}${guessSubCategory()}: ${messageRest}`.trim(),
  ...description,
].join('\n\n');

if (FLAG_FROM_STDIO) {
  console.log({
    prefix,
    category,
    subcategory,
    messageRest,
    output,
  });
} else {
  console.log('[Formatted commit message]:', output);
  await fs.writeFile(commitMsgPath, output);
}

process.exit(0);

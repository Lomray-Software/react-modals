import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import Ajv from 'ajv';

const root = new URL('../', import.meta.url);
const config = JSON.parse(await readFile(new URL('context7.json', root), 'utf8'));
const schemaResponse = await fetch('https://context7.com/schema/context7.json');
assert.equal(schemaResponse.status, 200);
const schema = await schemaResponse.json();
const ajv = new Ajv({ strict: false, formats: { uri: true } });
const validate = ajv.compile(schema);
assert.ok(validate(config), JSON.stringify(validate.errors));
assert.equal(config.branch, 'prod');
assert.ok(config.excludeFolders.includes('docs-tests'));
async function runExample(output) {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!doctype html><div id="root"></div>');
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { App } = await import(output.href);
  const root = createRoot(document.getElementById('root'));
  const click = async (text) => {
    const button = [...document.querySelectorAll('button')].find((el) => el.textContent === text);
    assert.ok(button, `Missing button: ${text}`);
    await React.act(async () => button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
  };
  try {
    await React.act(async () => root.render(React.createElement(App)));
    await click('Open');
    assert.equal(document.querySelector('section p')?.textContent, 'Hello');
    await click('Close');
    assert.equal(document.querySelector('section'), null);
    await click('Open');
    await click('Hide');
    assert.equal(document.querySelector('section'), null);
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    delete globalThis.window;
    delete globalThis.document;
    if (navigatorDescriptor) {
      Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
    } else {
      delete globalThis.navigator;
    }
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
}

const require = createRequire(import.meta.url);
const { build } = await import('esbuild');
const dir = new URL('.generated/', import.meta.url);
await mkdir(dir, { recursive: true });
try {
  const readme = await readFile(new URL('README.md', root), 'utf8');
  const matches = [...readme.matchAll(/<!-- docs-test:example -->\s*```(?:typescript|tsx)\n([\s\S]*?)```/g)];
  assert.equal(matches.length, 1, 'Expected exactly one marked README example');
  const input = new URL('example.tsx', dir);
  await writeFile(input, matches[0][1]);
  const tsc = require.resolve('typescript/bin/tsc');
  execFileSync(process.execPath, [tsc, '--noEmit', '--strict', '--skipLibCheck', '--target', 'ES2022', '--module', 'ESNext', '--moduleResolution', 'bundler', '--jsx', 'react-jsx', '--esModuleInterop', fileURLToPath(input)], { stdio: 'inherit' });
  const output = new URL('example.mjs', dir);
  await build({ entryPoints: [fileURLToPath(input)], outfile: fileURLToPath(output), bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic', logLevel: 'silent' });
  await runExample(output);
  console.log('PASS: Context7 schema, README semantic typecheck and released-package smoke');
} finally {
  await rm(dir, { recursive: true, force: true });
}

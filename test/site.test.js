import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const js = await readFile(new URL('../script.js', import.meta.url), 'utf8');

test('personal quote totals and coverage distinctions are present', () => {
  for (const value of ['$2,382.42', '$2,268', '$3,645', 'Full legs', 'Lower legs only']) {
    assert.ok(html.includes(value), `missing ${value}`);
  }
  assert.equal(html.includes('$2,732.42'), false);
  assert.equal(/ICON membership/i.test(html), false);
});

test('all requested navigation destinations exist', () => {
  for (const id of ['overview', 'waxing', 'quotes', 'long-term', 'locations']) {
    assert.match(html, new RegExp(`id="${id}"`));
    assert.match(html, new RegExp(`href="#${id}"`));
  }
});

test('calculator and chart defaults match the six-week comparison', () => {
  assert.match(html, /id="frequency"[^>]+value="6"/);
  for (const amount of [1647, 4940, 8233, 16467]) assert.ok(js.includes(String(amount)));
  assert.ok(js.includes('2382.42'));
});

test('mobile safeguards and breakpoints are defined', () => {
  assert.match(css, /overflow-x:hidden/);
  assert.match(css, /@media\(min-width:720px\)/);
  assert.match(css, /@media\(max-width:370px\)/);
  assert.match(html, /width=device-width/);
});

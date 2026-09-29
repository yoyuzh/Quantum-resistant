import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeFiles, MAX_FILE_BYTES, validateDraft } from '../src/utils/files.js';
import {
  codeLines,
  coverageText,
  filterFindings,
  formatStars,
  paginate,
  sortRepos,
} from '../src/utils/results.js';

test('files: duplicate identity, same names and limits', () => {
  const file = { name: 'same.py', size: 100, lastModified: 1 };
  const result = mergeFiles(
    [file],
    [
      file,
      { ...file, size: 101 },
      { name: 'bad.exe', size: 1 },
      { name: 'big.py', size: MAX_FILE_BYTES + 1 },
    ],
  );
  assert.equal(result.files.length, 2);
  assert.equal(result.errors.length, 2);
  assert.equal(
    mergeFiles(
      [],
      Array.from({ length: 81 }, (_, i) => ({ name: `${i}.py`, size: 10 })),
    ).files.length,
    80,
  );
  assert.equal(
    mergeFiles(
      [],
      Array.from({ length: 6 }, (_, i) => ({ name: `${i}.py`, size: MAX_FILE_BYTES })),
    ).files.length,
    4,
  );
});

test('validation: empty input, package names, GitHub host and UTF-8 bytes', () => {
  assert.ok(validateDraft('snippet', { content: ' ', filename: 'a.py' }));
  assert.ok(
    validateDraft('snippet', { content: '中'.repeat(MAX_FILE_BYTES / 2), filename: 'a.py' }),
  );
  assert.ok(validateDraft('files', { files: [] }));
  assert.ok(validateDraft('pypi', { value: '../bad' }));
  assert.ok(validateDraft('github', { value: 'https://github.com.evil/a/b' }));
  assert.equal(validateDraft('pypi', { value: 'cryptography' }), '');
  assert.equal(validateDraft('github', { value: 'https://github.com/a/b' }), '');
});

test('results: identity-based filter and code selection', () => {
  const findings = [
    {
      source_id: 'a',
      file_name: 'same.py',
      algorithm: 'RSA',
      evidence: 'gen()',
      recommendation: 'ML-KEM',
    },
    {
      source_id: 'b',
      file_name: 'same.py',
      algorithm: 'ECDSA',
      evidence: 'sign()',
      recommendation: 'ML-DSA',
    },
  ];
  assert.deepEqual(filterFindings(findings, { sourceId: 'b' }), [findings[1]]);
  assert.deepEqual(filterFindings(findings, { query: 'ml-kem' }), [findings[0]]);
  assert.deepEqual(filterFindings(findings, { algorithm: 'RSA', sourceId: 'b' }), []);
  const sources = [
    { source_id: 'a', content: 'first' },
    { source_id: 'b', content: 'second' },
  ];
  assert.equal(codeLines(sources, 'b', 1)[0].text, 'second');
  assert.deepEqual(codeLines(sources, 'missing', 1), []);
});

test('pagination clamps pages and supports 50-item chunks', () => {
  const items = Array.from({ length: 101 }, (_, i) => i);
  assert.equal(paginate(items, 1).items.length, 50);
  assert.deepEqual(paginate(items, 100).items, [100]);
  assert.equal(paginate([], 3).current, 1);
});

test('popular display uses stars and explicit unknown coverage', () => {
  assert.equal(formatStars(999), '999');
  assert.equal(formatStars(52300), '52.3k');
  const repos = [{ star_count: 1 }, { star_count: 3 }];
  assert.equal(sortRepos(repos)[0].star_count, 3);
  assert.equal(repos[0].star_count, 1);
  assert.match(coverageText(null), /未知/);
  assert.match(coverageText({ scanned_files: 6, candidate_files: null }), /候选总数未知/);
});

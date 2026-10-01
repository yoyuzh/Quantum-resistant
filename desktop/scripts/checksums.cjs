'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..', 'release');
const files = fs.readdirSync(root).filter((name) => /\.(exe|dmg|deb)$/.test(name)).sort();
const lines = files.map((name) => `${createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex')}  ${name}`);
fs.writeFileSync(path.join(root, 'SHA256SUMS.txt'), `${lines.join('\n')}\n`);

/**
 * This script should be run in electron context
 * @example
 *  ELECTRON_RUN_AS_NODE=1 electron scripts/update-electron-vendors.cjs
 */


const fs = require('node:fs')
const path = require('path')


const electronRelease = process.versions;

const node = electronRelease.node.split('.')[0];
const chrome = electronRelease.v8.split('.').splice(0, 2).join('');

const browserslistrcPath = path.resolve(process.cwd(), '.browserslistrc');

fs.writeFileSync('./.electron-vendors.cache.json', JSON.stringify({chrome, node}));
fs.writeFileSync(browserslistrcPath, `Chrome ${chrome}`, 'utf8');

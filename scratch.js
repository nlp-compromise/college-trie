'use strict';
const arr = require('./test/maleNames');
// const trieHard = require('./bits');
const trieHard = require('./lookup');

// var words = [
//   'cool',
//   'cool hat',
// ];
console.time('pack');
let str = trieHard.pack(arr);
console.log(str);
console.timeEnd('pack');

console.log('\n\n');

console.time('bench');
let trie = trieHard.unpack(str);

arr.forEach((str) => {
  let bool = trie.has(str);
  if (!bool) {
    console.log(str);
  }
});
console.timeEnd('bench');

import test from 'tape'
import efrt from './_lib.js'
import names from './data/maleNames.js'
import countries from './data/countries.js'

test('match-every-name:', function (t) {
  const str = efrt.pack(names)
  const ptrie = efrt.unpack(str)
  for (let i = 0; i < names.length; i++) {
    const has = ptrie.hasOwnProperty(names[i])
    t.equal(has, true, "trie has '" + names[i] + "'")
  }
  t.equal(ptrie.hasOwnProperty('woodstock'), false, 'no-false-positive')
  t.end()
})

test('match-every-country:', function (t) {
  const str = efrt.pack(countries)
  const ptrie = efrt.unpack(str)
  for (let i = 0; i < countries.length; i++) {
    const has = ptrie.hasOwnProperty(countries[i])
    t.equal(has, true, "trie has '" + countries[i] + "'")
  }
  t.equal(ptrie.hasOwnProperty('woodstock'), false, 'no-false-positive')
  t.end()
})

// test('match-every-adjective:', function(t) {
//   var str = efrt.pack(adjectives);
//   var ptrie = efrt.unpack(str);
//   for (var i = 0; i < adjectives.length; i++) {
//     var has = ptrie.has(adjectives[i]);
//     if (!has) {
//       //if not there, make sure it wasn't supposed to be there in the first place
//       t.ok(adjectives[i].match(/[0-9A-Z,;!]/), adjectives[i]);
//     }
//   }
//   t.equal(ptrie.has('woodstock'), false, 'no-false-positive');
//   t.end();
// });

test('test prefixes:', function (t) {
  const compressed = efrt.pack(countries)
  const ptrie = efrt.unpack(compressed)
  for (let i = 0; i < countries.length; i++) {
    const str = countries[i]
    for (let o = 1; o < str.length - 1; o++) {
      const partial = str.slice(0, o)
      const has = ptrie.hasOwnProperty(partial)
      t.equal(has, false, 'no-prefix-' + partial)
    }
  }
  t.end()
})

<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />
  <div>compression of key-value data</div>
  <a href="https://npmjs.org/package/efrt">
    <img src="https://img.shields.io/npm/v/efrt.svg?style=flat-square" />
  </a>
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-green.svg?style=flat-square" />
  </a>
</div>

<div align="center">
  <code>npm install efrt</code>
  <br/>
  (or alternatively:)
  <br/>
  <code>npm install efrt-unpack</code>
</div>

`efrt` turns a javascript object into a very-compressed prefix [trie](https://en.wikipedia.org/wiki/Trie) format, so that any redundancies in key-value paris are compressed, and nothing is repeated.

it is based on 
[lookups](https://github.com/mckoss/lookups) by [Mike Koss](https://github.com/mckoss), 
[tamper](https://nytimes.github.io/tamper/) by the [nyTimes](https://github.com/NYTimes/), 
and 
[bits.js](http://stevehanov.ca/blog/index.php?id=120) by [Steve Hanov](https://twitter.com/smhanov)

 * squeeze a key-value object into a very compact form
 * reduce filesize/bandwidth a bunch
 * ensure the unpacking overhead is negligible
 * word-lookups are critical-path

By doing the fancy stuff ahead-of-time, **efrt** lets you ship much bigger key-value data to the client-side, without much hassle.
The whole library is *8kb*, the unpack-half is only *2.5kb*. 

```js
var efrt = require('efrt')
var data = {
  bedfordshire   : 'England',
  aberdeenshire  : 'Scotland',
  berkshire      : 'England',
  buckinghamshire: 'England',
  argyllshire    : 'Scotland',
  bambridgeshire : 'England',
  angus          : 'Scotland',
  bristol        : 'England',
  cheshire       : 'England',
  ayrshire       : 'Scotland',
  banffshire     : 'Scotland',
  berwickshire   : 'Scotland'
}

//pack these words as tightly as possible
var compressed = efrt.pack(data);
//{"England":"b0che2;ambridge1e0ristol,uckingham1;dford0rk0;shire","Scotland":"a1b0;anff1erwick1;berdeen0ngus,rgyll0yr0;shire"}

//create a lookup-trie
var objAgain = efrt.unpack(compressed);

//hit it!
console.log(objAgain['bedfordshire']);//'England'
console.log(objAgain.hasOwnProperty('miles davis'));//false
```

<h3 align="center">
  <a href="https://rawgit.com/nlp-compromise/efrt/master/demo/index.html">Demo!</a>
</h3>

the keys you input are pretty normalized. Spaces and unicode are good, but numbers, case-sensitivity, and *some punctuation* (semicolon, comma, exclamation-mark) are not (yet) supported.


## Performance
*efrt* is tuned to be very quick to unzip. It is O(1) to lookup. Packing-up the data is the slowest part, which is usually cool.
```js
var compressed = efrt.pack(skateboarders);//1k words (on a macbook)
var trie = efrt.unpack(compressed)
// unpacking-step: 5.1ms

trie.hasOwnProperty('tony hawk')
// cached-lookup: 0.02ms
```

## Size
`efrt` will pack filesize down as much as possible, depending upon the redundancy of the prefixes/suffixes in the words, and the size of the list.
* list of countries - `1.5k -> 0.8k` *(46% compressed)*
* all adverbs in wordnet - `58k -> 24k` *(58% compressed)*
* all adjectives in wordnet - `265k -> 99k` *(62% compressed)*
* all nouns in wordnet - `1,775k -> 692k` *(61% compressed)*

but there are some things to consider:
* bigger files compress further (see [🎈 birthday problem](https://en.wikipedia.org/wiki/Birthday_problem))
* using efrt will reduce gains from gzip compression, which most webservers quietly use
* english is more suffix-redundant than prefix-redundant, so non-english words may benefit from other styles

Assuming your data has a low _category-to-data ratio_, you will hit-breakeven with at about 250 keys. If your data is in the thousands, you can very be confident about saving your users some considerable bandwidth.

## Use
**IE9+**
```html
<script src="https://unpkg.com/efrt@latest/builds/efrt.min.js"></script>
<script>
  var smaller=efrt.pack(['larry','curly','moe'])
  var trie=efrt.unpack(smaller)
  console.log(trie['moe'])
</script>
```

if you're doing the second step in the client, you can load just the unpack-half of the library(~3k):
```bash
npm install efrt-unpack
```
```html
<script src="https://unpkg.com/efrt@latest/builds/efrt-unpack.min.js"></script>
<script>
  var trie=unpack(compressedStuff);
  trie.hasOwnProperty('miles davis');
</script>
```

MIT

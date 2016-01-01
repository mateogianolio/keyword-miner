# keyword-miner

Extract a list of keywords from a website, sorted by word count. Uses [text-miner](https://github.com/Planeshifter/text-miner) and [cheerio](https://github.com/cheeriojs/cheerio) for HTML/text parsing.

Top 20 keywords for https://en.wikipedia.org/wiki/Data_mining:

```
words: [ { word: 'data', count: 260 },
  { word: 'mining', count: 154 },
  { word: 'learning', count: 51 },
  { word: 'software', count: 41 },
  { word: 'information', count: 35 },
  { word: 'conference', count: 35 },
  { word: 'machine', count: 33 },
  { word: 'analysis', count: 33 },
  { word: 'knowledge', count: 28 },
  { word: 'discovery', count: 25 },
  { word: 'language', count: 22 },
  { word: 'patterns', count: 19 },
  { word: 'research', count: 18 },
  { word: 'process', count: 17 },
  { word: 'privacy', count: 17 },
  { word: 'analytics', count: 17 },
  { word: 'set', count: 15 },
  { word: 'isbn', count: 15 },
  { word: 'algorithms', count: 14 },
  { word: 'database', count: 14 } ]
```

### Usage

```bash
$ npm install keyword-miner
```

```javascript
/**
 * keyword-miner exports a function with the following params:
 * @param {String|Object} url string or options object
 * @param {Function} done
 **/
var miner = require('keyword-miner');

var options = {
  site: 'https://en.wikipedia.org/wiki/Data_mining',

  // only include words with at least n occurences, default 0 (no threshold)
  threshold: 5,

  // limit output count, default 0 (no limit)
  limit: 20,

  // css element(s) to get keywords from, default 'body'
  element: 'body',

  // exclude keywords, default []
  exclude: []
};

// call function and print results when done
miner(
  options,
  (error, words) => {
    if (error)
      throw error;

    console.log('words:', words);
  }
);
```

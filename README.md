# keyword-miner

Obtain a list of keywords from a website, sorted by word count. Uses [text-miner](https://github.com/Planeshifter/text-miner) and [request](https://github.com/request/request) for HTML parsing and [leveldb](https://github.com/Level/levelup) for dictionary lookup ([SOWPODS](https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt)).

Top 20 keywords for https://en.wikipedia.org/wiki/Data_mining:

```
words: [ { word: 'data', count: 258 },
  { word: 'mining', count: 155 },
  { word: 'learning', count: 51 },
  { word: 'software', count: 43 },
  { word: 'information', count: 36 },
  { word: 'analysis', count: 35 },
  { word: 'machine', count: 34 },
  { word: 'conference', count: 32 },
  { word: 'knowledge', count: 25 },
  { word: 'edit', count: 25 },
  { word: 'discovery', count: 23 },
  { word: 'language', count: 22 },
  { word: 'patterns', count: 20 },
  { word: 'analytics', count: 19 },
  { word: 'process', count: 18 },
  { word: 'privacy', count: 17 },
  { word: 'processing', count: 15 },
  { word: 'research', count: 15 },
  { word: 'set', count: 15 },
  { word: 'intelligence', count: 14 } ]
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

  // only include words with at least n occurences, default 5
  threshold: 5,

  // limit output count, default 0 (no limit)
  limit: 20,

  // filter keywords with SOWPODS dictionary, default true
  dictionary: true
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

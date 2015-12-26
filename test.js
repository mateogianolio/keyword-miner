(function () {
  'use strict';

  var miner = require('./miner.js');

  miner(
    'https://en.wikipedia.org/wiki/Basketball',
    words => console.log(words)
  );
}());

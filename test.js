(function () {
  'use strict';

  var miner = require('./miner.js');

  var options = {
    site: 'https://en.wikipedia.org/wiki/Data_mining',
    threshold: 5,
    limit: 20,
    dictionary: true
  };

  console.log('site:', options.site);
  console.log('threshold:', options.threshold);
  console.log('limit:', options.limit);

  miner(options, words => console.log('words:', words));
}());

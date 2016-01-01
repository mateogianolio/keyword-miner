(function () {
  'use strict';

  var miner = require('./miner.js');

  var options = {
    site: 'https://en.wikipedia.org/wiki/Data_mining',
    threshold: 5,
    limit: 20,
    element: 'body',
    exclude: []
  };

  console.log('site:', options.site);
  console.log('threshold:', options.threshold);
  console.log('limit:', options.limit);

  miner(
    options,
    (error, words) => {
      if (error)
        throw error;

      console.log('words:', words);
    }
  );
}());

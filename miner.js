(function() {
  'use strict';

  var fs = require('fs'),
      request = require('request'),
      text = require('html-to-text'),
      miner = require('text-miner'),
      corpus = new miner.Corpus([]),
      dictionary = require('levelup')('./dictionary'),
      freqTerms,
      terms,
      words;

  function ascending(a, b) {
    return a.count > b.count ?
      -1 :
      (a.count < b.count) ?
        1 : 0;
  }

  function limit(max) {
    return (term, index) => index < max;
  }

  function query(options, done) {
    options = typeof options === 'string' ? { site: options } : options;
    options.threshold = options.threshold || 5;

    request(
      options.site,
      (error, response, body) => {
        if (error || response.statusCode !== 200)
          throw error || new Error('request failed');

        corpus.addDoc(text.fromString(body, {
          ignoreHref: true
        }));

        corpus
          .trim()
          .toLower()
          .removeInvalidCharacters()
          .removeInterpunctuation()
          .removeNewlines()
          .removeDigits()
          .removeWords(miner.STOPWORDS.EN);

        terms = new miner.Terms(corpus);
        freqTerms = terms.findFreqTerms(options.threshold);

        words = [];
        freqTerms.forEach(
          (term, index) => {
            dictionary.get(term.word, (error, value) => {
              if (!error)
                words.push(term);

              if (index !== freqTerms.length - 1)
                return;

              options.limit = options.limit || words.length;
              words = words
                .sort(ascending)
                .filter(limit(options.limit));

              done(words);
            });
          }
        );
      }
    );
  }

  module.exports = query;
}());

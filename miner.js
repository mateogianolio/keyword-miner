(function() {
  'use strict';

  var http = require('http'),
      https = require('https'),
      miner = require('text-miner'),
      cheerio = require('cheerio'),
      dictionary = require('levelup')(__dirname + '/dictionary');

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
    options.dictionary = options.dictionary === undefined ? true : options.dictionary;

    if (!options.site)
      return done(new Error('URL invalid: ' + options.site));

    var protocol =
      options.site.indexOf('https://') !== -1 ?
        https :
        http;

    protocol.get(
      options.site,
      (response) => {
        var body = '',
            corpus = new miner.Corpus([]),
            words = [],
            terms,
            dom;
        response.on('error', done);
        response.on('data', data => body += data);
        response.on('end', () => {
          dom = cheerio.load(body);
          corpus.addDoc(dom('body').text());
          corpus
            .trim()
            .toLower()
            .removeInvalidCharacters()
            .removeInterpunctuation()
            .removeNewlines()
            .removeDigits()
            .removeWords(miner.STOPWORDS.EN);

          terms = new miner.Terms(corpus)
            .findFreqTerms(options.threshold);
            
          if (!options.dictionary)
            return done(
              null,
              terms
                .sort(ascending)
                .filter(limit(options.limit))
            );

          terms.forEach(
            (term, index) => {
              dictionary.get(
                term.word,
                (error, value) => {
                  if (!error)
                    words.push(term);

                  if (index !== terms.length - 1)
                    return;

                  options.limit = options.limit || words.length;
                  words = words
                    .sort(ascending)
                    .filter(limit(options.limit));

                  done(null, words);
                }
              );
            }
          );
        });
      }
    );
  }

  module.exports = query;
}());

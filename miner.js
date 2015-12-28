(function() {
  'use strict';

  var http = require('http'),
      https = require('https'),
      miner = require('text-miner'),
      cheerio = require('cheerio');

  function ascending(a, b) {
    return a.count > b.count ?
      -1 :
      (a.count < b.count) ?
        1 : 0;
  }

  function validate(term) {
    return /[A-Za-z]/g.test(term.word);
  }

  function limit(max) {
    return (term, index) => index < max;
  }

  function query(options, done) {
    options =
      typeof options === 'string' ?
        { site: options } :
        options;

    options.threshold = options.threshold || 5;

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

          done(
            null,
            new miner.Terms(corpus)
              .findFreqTerms(options.threshold)
              .sort(ascending)
              .filter(validate)
              .filter(limit(options.limit))
          );
        });
      }
    );
  }

  module.exports = query;
}());

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
    return /^[a-zA-Z]+$/.test(term.word);
  }

  function limit(max) {
    return function (term, index) {
      return max ? index < max : true;
    };
  }

  function query(options, done) {
    if (!options)
      return done(new Error('options/url is null'));

    options =
      typeof options === 'string' ?
        { site: options } :
        options;

    if (!options.site)
      return done(new Error('URL invalid: ' + options.site));

    options.threshold = options.threshold || 0;
    options.limit = options.limit || 0;
    options.element = options.element || 'body';
    options.exclude = options.exclude || [];
    options.ignoreInlineCSS = options.ignoreInlineCSS || true;

    var protocol =
      options.site.indexOf('https://') !== -1 ?
        https :
        http;

    protocol.get(
      options.site,
      function (response) {
        var body = '',
            corpus = new miner.Corpus([]),
            words = [],
            terms,
            dom,
            doc;
        response.on('data', function (data) { body += data; });
        response.on('end', function () {
          dom = cheerio.load(body);
          if (options.ignoreInlineCSS) {
            doc = dom(options.element).html().replace(/style=(['"])[^\1]*?\1/ig, '').replace(/<style[^<]*?<\/style>/ig, '');
            doc = dom(doc).text();
          } else {
            doc = dom(options.element).text();
          }

          corpus.addDoc(doc);
          corpus
            .trim()
            .toLower()
            .removeInvalidCharacters()
            .removeInterpunctuation()
            .removeNewlines()
            .removeDigits()
            .removeWords(miner.STOPWORDS.EN)
            .stem();

          done(
            null,
            new miner.Terms(corpus)
              .findFreqTerms(options.threshold)
              .sort(ascending)
              .filter(validate)
              .filter(function (term) {
                return options.exclude.indexOf(term.word) === -1;
              })
              .filter(limit(options.limit))
          );
        });
      }
    ).on('error', done);
  }

  module.exports = query;
}());

var proxy = require('proxy-tamper').start({port: 8070});

// block all URLs that contain 'block' in them
// proxy.tamper(/block/, 'This content is blocked!');

// disallow Google 
/*
proxy.tamper(/google/, function (request) {
  request.url = request.url.replace(/google/g, 'bing'); 
});
*/
String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "\\n")
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
};
// http://toto-taiwan.hekk.org/quests/execute/80.json?e=Cv3acO+lByASakwzQmy/as5SeafVXJlHKJsHIPjo80UEujYAiK75GHzA2SDPiFnv2UX+q/Uqgypn30+FgubmikL9ImL0P7viDl54pC2SNvTJPO4DMWBoR2rkRSuMGc+gciGU1eoYzQ9gZGP8uEJ5YEbejMsqyyr1aX/Tdb+Hlv92hO/k7AhnwxSV4fXNQm/SFIUOxzRv5iqKXVRNGjSBu84PgEGbVOP5bKniL3y5pcHN6xUWmsCHCbZlHiive/Z8WRhLTU1X+wGRK/PbK6RyxCsqiWM98xly/F09L4J5UKrgD4trJJHIjuU3XqZ/IJ7A5DtCP+zdy4APxp8wMxrbBAgt+gyoh86/OUwSRs1mc042mtsyb23REh8WhhJCwNqA9rqOplNasIuNOzFl2uqO1jbHhf81RGiHQAxvJJ1R6hR4KnqUfILXuBSoAOTIvkUD7fK5DZwVNN9jHh+iIEmLcluhpzsBD3sxSrXD6K0OS5cj96fpzqKcY57Z9SfPx1TKGlJR4QsEWk7zXYaBp3BJd3ccEq/NZatQzKe8J7bCqWsxclYzX9zoDjwAXLSrFNWDcRN1NOAPJ3xa7hAnf5lTN8USGTRHL2isSB9Hszf90hk++UmYJhKXz4CcSCBxg3/UyyjZNAXTkL1greoZ/GE1kd/vDF5/P003YkfI2sdoMaF7CKUJ4So9VU7ImefhESDEB+Ta1ZVtsG1MkIMQNiXKQW35TIIObBLr0Jm+srTlXR6bjX098eh9H3vZ77jZJ7RL9zvFunhbaU5acjFw4r3KRjB4iRExYTGtJRthiyZulJk=
// replace all instances of 'Apple' with 'Orange' in Techcrunch articles
// proxy.tamper(/techcrunch.com.*\/$/, function (request) {
proxy.tamper(/toto-taiwan.hekk.org.*execute/, function (request) {
  console.log('tampering ' + request.url);

  // gzip encoding is not supported when tampering the body
  delete request.headers['accept-encoding'];

  request.onResponse(function (response) {
    // tamper the body
    // response.body = response.body.replace(/Apple/g, 'Orange');
    if (response.body.search('不足') == -1) {
      console.log('~~~ hacking sp point!');
      var resJson = JSON.parse(response.body.toString('utf8').escapeSpecialChars());
      resJson["units"][0]["bonus_sp"] *= 500;
      response.body = JSON.stringify(resJson);
      response.headers['server'] = 'proxy-tamper 1337';
    } else {
      console.log('~~~ quest execute faild!');
    }
    // complete the response
    response.complete();
  });
});

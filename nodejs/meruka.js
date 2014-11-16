var proxy = require('proxy-tamper').start({port: 8070});

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
// replace all instances of 'Apple' with 'Orange' in Techcrunch articles
proxy.tamper(/toto-taiwan.hekk.org.*execute.*json/, function (request) {
  console.log('tampering ' + request.url);

  // gzip encoding is not supported when tampering the body
  delete request.headers['accept-encoding'];

  request.onResponse(function (response) {
    // tamper the body
    if (response.body.search('不足') == -1) {
      console.log('~~~ hacking skill point!');
      var resJson = JSON.parse(response.body.escapeSpecialChars());
      resJson["units"][0]["bonus_sp"] *= 1000;
      response.body = JSON.stringify(resJson);
      response.headers['server'] = 'proxy-tamper 1337';
    } else {
      console.log('~~~ quest execute faild!');
    }
    // complete the response
    response.complete();
  });
});

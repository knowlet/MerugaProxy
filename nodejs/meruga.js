var proxy = require('proxy-tamper').start({port: 8070});

function log(str) {
  console.log(' [' + new Date().toTimeString().split(' ')[0] + '] ' + str);
}

proxy.tamper(/m.happyelements.com\/rest_v3/, function (request) {
  log('device connect!');
});
/*
// debug
proxy.tamper(/./, function (request) {
  console.log('debug ' + request.url);
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

proxy.tamper(/toto-taiwan.hekk.org.*execute/, function (request) {
  log('tampering ' + request.url.split('?')[0]);

  // gzip encoding is not supported when tampering the body
  delete request.headers['accept-encoding'];

  request.onResponse(function (response) {
    // tamper the body
    try {
      var resJson = JSON.parse(response.body.toString('utf8').escapeSpecialChars());
      if (response.body.search('modal') != -1)
        log(resJson['modal']['body'].replace(/\n/, ' '));
      else {
        log('hacking sp point!');
        // console.log(response.body.toString('utf8'));
        resJson['units'][0]['bonus_sp'] *= 500;
        response.body = JSON.stringify(resJson);
      }
    } catch (err) {
        log(err);
        response.body = '{"modal":{"title":"外掛錯誤","type":"yes","body":"外掛數據修改異常。\n請稍候再試","page_message":""}}';
        log('quest execute faild!');
    }
    // complete the response
    response.complete();
    log('response done!\n');
  });
});

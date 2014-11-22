var port = process.argv[2] || 8070;
var mult = 1000;
var proxy = require('proxy-tamper').start({port: port});
var crypto = require('crypto');

function log(str) {
  console.log(' [' + new Date().toLocaleTimeString() + '] ' + str);
}

log('Proxy Start at port: ' + port);
// block other website
// proxy.tamper(/^((?!toto)[\s\S])*$/, 'Sorry, The Proxy is for Meruga Only.');

proxy.tamper(/toto-taiwan.hekk.org\/users\/preset_data.json/, function (request) {
  log('Device connect: ' + request.headers.device_info.split(':::')[0]);
  delete request.headers['accept-encoding'];
  request.onResponse(function (response) {
    try {
      var resJson = JSON.parse(response.body);
      log('Welcome User ' + resJson.data.user.name);
      resJson.data.infos.unshift({"body": "癒術士大大安安~\r\n外掛已經成功連線了喔\r\n目前修改倍率為 " + mult + " 倍喔啾咪 O_<", "categories": [], "created_at": new Date().toISOString(), "deleted_at": null, "id": 0, "rich_body": "", "title": "外掛連線通知", "updated_at": new Date().toISOString(), "visible": true, "wordpress_id": 0, "created_sec": 0, "updated_sec": 0});
      response.body = JSON.stringify(resJson);
    } catch(err) {
      log('Unknown User Connect.');
      log(err);
    }
    response.complete();
  });
});
/*
proxy.tamper(/toto-taiwan.hekk.org\/users\/messages/, function (request) {
  delete request.headers['accept-encoding'];
  request.onResponse(function (response) {
    try {
      var resJson = JSON.parse(response.body);
      if (typeof(resJson.data.messages.user_comment) !== 'object') resJson.data.messages.user_comment = [];
      var id = crypto.randomBytes(4).toString('hex') + '-' + crypto.randomBytes(2).toString('hex') + '-' + crypto.randomBytes(2).toString('hex') + '-' + crypto.randomBytes(2).toString('hex') + '-' + crypto.randomBytes(6).toString('hex');
      resJson.data.messages.user_comment.unshift({"user_id":"","unit_id": 0,"user_name":"小精靈","text":"外掛使用中 O_<","type_id":"user_comment","id":id,"created_at":parseInt(new Date().getTime()/1000)});
      response.body = JSON.stringify(resJson);
      log('User ' + resJson.data.user.name + ' Connect Message Send.');
    } catch(err) {
      log('Message send ' + err);
    }
    response.complete();
  });
});
*/
// Show all album
proxy.tamper(/toto-taiwan.hekk.org\/albums\/$/, function (request) {
  delete request.headers['accept-encoding'];
  request.onResponse(function (response) {
    var resJson = JSON.parse(response.body);
    resJson.data.album_data.count = resJson.data.album_data.total_count;
    for (i in resJson.data.albums) {
      resJson.data.albums[i].is_user_unit = true;
      resJson.data.albums[i].is_waiting = true;
      resJson.data.albums[i].hide = false;
    }
    response.body = JSON.stringify(resJson);
    response.complete();
  });
});

// debug
/*
proxy.tamper(/./, function (request) {
  console.log('debug ' + request.url);
});
*/

// offline game mode.
// proxy.tamper(/toto-taiwan.hekk.org\/quests\/ap_use/, '{"status":"success"}');

proxy.tamper(/toto-taiwan.hekk.org.*execute.*json/, function (request) {
  log('tampering ' + request.url.split('?')[0]);

  // gzip encoding is not supported when tampering the body
  delete request.headers['accept-encoding'];

  request.onResponse(function (response) {
    // tamper the body
    Object.prototype.removeWave = function() {
      for (e in this) {
        if (this.hasOwnProperty(e)) {
          // if (e === '1') continue;
          // delete this[e];
          this[e].length = 0;
        }
      }
    };
    try {
      var resJson = JSON.parse(response.body);
      if (response.body.search('modal') != -1)
        log(resJson.modal.body.replace(/\n/, ' '));
      else {
        log(resJson.data.user.name + '進場ing...')
        log('hacking sp point!');
        resJson.units[0].bonus_sp *= mult;
        log('hacking wave_conf');
        resJson.quest.wave_conf.removeWave();
        // resJson.quest.wave_conf['1'].length /= 10;
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

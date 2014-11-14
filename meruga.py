import sys
sys.path.append('../')
import cherryproxy
import re, json, zlib

class MerugaProxy(cherryproxy.CherryProxy):
    def filter_response(self):
        if self.req.netloc == "toto-taiwan.hekk.org" and re.search("execute", self.req.path) and self.resp.content_type == 'application/json':
            decompress = zlib.decompress(self.resp.data, zlib.MAX_WBITS | 32)
            response_json = json.loads(decompress)
            response_json["units"][0]["bonus_sp"] *= 500
            fake_data = json.dumps(response_json, ensure_ascii=False, separators=(',', ':')).encode('utf8')
            self.resp.data = fake_data

cherryproxy.main(MerugaProxy)
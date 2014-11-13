import cherryproxy
import re, json, zlib

class MerugaProxy(cherryproxy.CherryProxy):
	def filter_response(self):
		if self.req.netloc == "toto-taiwan.hekk.org" and self.resp.content_type == 'application/json' and re.search("execute", self.req.path):
			try:
				print "~~~~~~~~~~~~~~~ It work!!! ~~~~~~~~~~~~~~~"
				decompress = zlib.decompress(self.resp.data, zlib.MAX_WBITS | 32)
				response_json = json.loads(decompress)
				print 'orgin_bonus_sp: %d' % response_json["units"][0]["bonus_sp"]
				response_json["units"][0]["bonus_sp"] *= 1000
				print 'edited_bonus_sp: %d' % response_json["units"][0]["bonus_sp"]
				fake_data = json.dumps(response_json, ensure_ascii=False, separators=(',', ':')).encode('utf8')
				gzip_compress = zlib.compressobj(9, zlib.DEFLATED, zlib.MAX_WBITS | 16)
				compress_data = gzip_compress.compress(fake_data) + gzip_compress.flush()
				self.resp.data = compress_data
				print "~~~~~~~~~~~~~~~~~ Done! ~~~~~~~~~~~~~~~~~"
			except Exception, e:
				print e

cherryproxy.main(MerugaProxy)
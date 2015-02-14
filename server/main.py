from tornado import ioloop, web, websocket
import pymongo


class MainHandler(web.RequestHandler):
    def get(self):
        self.write("Hello, world")

application = web.Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    ioloop.IOLoop.instance().start()



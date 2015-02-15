from tornado import ioloop, web, websocket
import string
import random
from math import sin, cos, acos, asin, sqrt, atan
import json

colors = ["#7FDBFF","#0074D9", "#01FF70", "#001F3F","#39CCCC","#3D9970", "#2ECC40", "#FF4136", "#85144B",  "#FF851B","#B10DC9", "#FFDC00", "#F012BE", "#aaa", "#fff"]

print("reboot")

def dist(lat1, lon1, lat2, lon2):
    r = sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon1 - lon2)
    return acos(r) * 6371.01 * 1000


games = {}
def id_generator(size=6, chars=string.digits): #Generates a random ID
    return ''.join(random.choice(chars) for _ in range(size))

def gen_player(sock,num=0):
    player = {"name":"Player "+str(num+1), "color":random.choice(colors), "currloc":None, "lochistory":[], "socket":sock, "pid":num}
    return player

def sendable_p(id):
    sp = []
    for p in games[id]['players']:
        sp.append({"name":p['name'], "color":p['color'], "pid":p['pid']})

    return sp

class WebSocketHandler(websocket.WebSocketHandler):
    def open(self):
        print("HERE")
        id=self.get_argument("id", None)
        print("ID",id)
        if id == None or id == "undefined":
            #Make Game
            print("MAKE GAME")
            id = id_generator()
            p = gen_player(self)
            games[id] = {"players" : [p]}


            self.write_message(json.dumps({"event":"youjoin", "data":{"gameid":id, "players": sendable_p(id), "youid":0}}))
            pass
        else:
            #Join Game
            if id not in games:
                print("NOT ID")
                self.write_message(json.dumps({"event":"error","message":"No such game ID"}))
                self.close()
                return

            pid = len(games[id]["players"])
            p = gen_player(self,pid)

            for pl in games[id]['players']:
                pl['socket'].write_message(json.dumps({"event":"playerjoin", "data":{"name":p['name'], "color":p['color'], "pid":pid}}))

            games[id]["players"].append(p)

            self.write_message(json.dumps({"event":"youjoin", "data":{"gameid":id, "players": sendable_p(id), "youid":pid}}))



    def on_message(self, message):
        print(message)
        j = json.loads(message)

        if j['event'] == "doping":
            pid = j['data']['pid']
            gid = j['gid']

            lat = games[gid]['players'][pid]['currloc']['lat']
            lon = games[gid]['players'][pid]['currloc']['lon']

            dists = []

            for p in games[gid]['players']:
                if p['pid'] == pid or p['curloc'] == None:
                    dists.append(None)
                    continue

                tdist = dist(lat,lon, p['currloc']['lat'], p['currloc']['lon'])

                print(tdist)

                dists.append(tdist)

            self.write_message(json.dumps({"event":"dopong", "data":{"dists":dists}}))
            print(games[gid])

        if j['event'] == "updateloc":
            lat = j['data']['lat']
            lon = j['data']['lon']
            pid = j['data']['pid']
            gid = j['gid']

            games[gid]['players'][pid]['currloc'] = {"lat":lat,"lon":lon}
            games[gid]['players'][pid]['lochistory'].append({"lat":lat,"lon":lon})





    def on_close(self):
        pass



class Test(web.RequestHandler):
    def get(self, *args, **kwargs):
        self.render("../www/game.html")



class MainHandler(web.RequestHandler):
    def get(self):
        self.write("Hello, world")

application = web.Application([
    (r"/", MainHandler),
    (r"/ws", WebSocketHandler),
    (r"/ws/([^/]+)", WebSocketHandler),
    (r"/test/([^/]+)", Test),
    (r"/test", Test),
], debug=True)

if __name__ == "__main__":
    application.listen(8888)
    ioloop.IOLoop.instance().start()



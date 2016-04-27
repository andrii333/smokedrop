from flask import Flask, request,Response
import os
import sys
import json





#read config file
t = open('config.txt','r')
cfg = t.read()
t.close()
cfg = json.loads(cfg);


app = Flask(__name__)
app.debug = True
os.chdir(cfg['PATH'])

@app.route('/')
def test_1():
#	return 'OIK'
#	return os.getcwd()

	t = open('./index.html','r')
	r = t.read()
	t.close()
	return r
	





if __name__=='__main__':
	app.run(debug=False, host=cfg['HOST'],port=8080)

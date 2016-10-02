from flask import Flask, request,Response
import os
import sys
import json
import time





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
	


@app.route('/custom.css')
def read_custom():
	time.sleep(70)
	t = open('./static/lib/custom.css','r')
	r = t.read()
	t.close()
	return r


@app.route('/jquery.min.js')
def read_jquery():
	time.sleep(70)
	t = open('./static/lib/jquery.min.js','r')
	r = t.read()
	t.close()
	return r


@app.route('/img/bg.jpg')
def read_img():
	time.sleep(3)
	t = open('./static/img/bg.jpg','r')
	r = t.read()
	t.close()
	return r



if __name__=='__main__':
	app.run(debug=False, host=cfg['HOST'],port=8080)

from flask import Flask, request,Response
import os
import sys










app = Flask(__name__)
#app.debug = True
os.chdir(os.getcwd()+'/html/smoke')

@app.route('/')
def test_1():
#	return 'OIK'
#	return os.getcwd()

	t = open('./index.html','r')
	r = t.read()
	t.close()
	return r
	





if __name__=='__main__':
	app.run(debug=False, host="46.101.122.41",port=81)

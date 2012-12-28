#!/usr/bin/env python2.7
import json
import os
import re
import urllib
import urllib2

from flask import Flask, render_template, request, make_response

import db


app = Flask(__name__)
data_lat_re = re.compile(r'data-latitude="([-\d.]+)"')
data_lng_re = re.compile(r'data-longitude="([-\d.]+)"')


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/url', methods=('POST',))
def add_url():
    url = request.form['url']
    response = urllib2.urlopen(url)
    html = response.read()
    data = {
        'url': url,
        'lat': float(data_lat_re.search(html).group(1)),
        'lng': float(data_lng_re.search(html).group(1)),
        }

    # TODO dump into database

    resp = make_response(json.dumps(data))
    resp.headers['Content-Type'] = 'application/json'
    return resp


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

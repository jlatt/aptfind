#!/usr/bin/env python2.7
import os
from flask import Flask, render_template

import db


app = Flask(__name__)

@app.route('/')
def hello():
    session = db.Session()
    return render_template('index.html')


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

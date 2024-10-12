from gevent import monkey
monkey.patch_all()
from flask import redirect, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from app.socket import socketio
from app import create_app
import os
app = create_app()
# Use ProxyFix to handle reverse proxy headers
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
socketio.init_app(app, cors_allowed_origins="*")


@app.before_request
def redirect_to_non_trailing():
    rpath = request.path
    if rpath != '/' and rpath.endswith('/'):
        return redirect(rpath[:-1], code=307)


if __name__ == '__main__':
    if os.environ.get('APP_MODE', 'development') == 'development':
        print("Development Server running on http://localhost:5000")
        socketio.run(app, port=5001, debug=True)
    else:
        from gevent import pywsgi
        from geventwebsocket.handler import WebSocketHandler

        server = pywsgi.WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)
        print("Production WSGI Server running on http://0.0.0.0:5000")
        server.serve_forever()
from flask import redirect, request
from werkzeug.middleware.proxy_fix import ProxyFix

from app import create_app

app = create_app()
# Use ProxyFix to handle reverse proxy headers
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)


@app.before_request
def redirect_to_non_trailing():
    rpath = request.path
    if rpath != '/' and rpath.endswith('/'):
        return redirect(rpath[:-1], code=307)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

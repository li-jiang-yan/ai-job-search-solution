import os
import sys
from pathlib import Path

from flask import Flask, abort, send_from_directory


def _frontend_directory():
    """Find the built React app in source and PyInstaller builds."""
    bundle_directory = getattr(sys, '_MEIPASS', None)
    if bundle_directory:
        return Path(bundle_directory) / 'frontend'

    return Path(__file__).resolve().parents[1].parent / 'vite-project' / 'dist'


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True, static_folder=None)
    app.config.from_mapping()

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    # apply the blueprints to the app
    from . import routes

    app.register_blueprint(routes.bp)
    # The Vite development proxy removes /api; keep those routes available while
    # also supporting the same-origin /api URLs used by the packaged frontend.
    app.register_blueprint(routes.bp, url_prefix='/api', name='api')

    frontend_directory = _frontend_directory()

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path == 'hello':
            return 'Hello, World!'

        if path == 'healthz':
            return {'status': 'ok'}

        if path.startswith('api/') or path == 'api':
            abort(404)

        requested_file = frontend_directory / path
        if path and requested_file.is_file():
            return send_from_directory(frontend_directory, path)

        index_file = frontend_directory / 'index.html'
        if not index_file.is_file():
            return 'Frontend build not found. Build vite-project before starting the app.', 503

        return send_from_directory(frontend_directory, 'index.html')

    return app

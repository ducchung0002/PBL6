from flask import Blueprint, send_from_directory, current_app
import os

# Define the blueprint
npm_modules_bp = Blueprint(
    'node_modules',
    __name__,
    static_folder='node_modules',
    static_url_path='/node_modules'
)

# Add a route to serve files
@npm_modules_bp.route('/<path:filename>')
def serve_node_modules(filename):
    project_root = os.path.dirname(current_app.root_path)
    node_modules_path = os.path.join(project_root, 'node_modules')
    return send_from_directory(node_modules_path, filename)


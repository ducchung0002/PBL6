from flask import Blueprint, jsonify
from app.routes.api.admin import api_admin_bp
from app.routes.api.user import api_user_bp
from app.routes.api.auth import api_auth_bp
from app.routes.api.artist import api_artist_bp
from app.routes.api.music import api_music_bp
from celery.result import AsyncResult

api_bp = Blueprint('api', __name__)
api_bp.register_blueprint(api_admin_bp, url_prefix='/admin')
api_bp.register_blueprint(api_auth_bp, url_prefix='/auth')
api_bp.register_blueprint(api_user_bp, url_prefix='/user')
api_bp.register_blueprint(api_artist_bp, url_prefix='/artist')
api_bp.register_blueprint(api_music_bp, url_prefix='/music')


@api_bp.get('/task/<task_id>')
def get_task_status(task_id):
    result = AsyncResult(task_id)

    if not result:
        return jsonify({'task_id': task_id, 'state': 'Task not found'}), 404

    if result.failed():
        # Handle failure case: Extract error message or traceback
        return jsonify({
            'task_id': task_id,
            'state': result.state,
            'error': str(result.result)  # Convert the exception to a string
        }), 500

    if result.successful():
        # Task succeeded, return the result
        return jsonify({
            'task_id': task_id,
            'state': result.state,
            'result': result.result
        })

    # Task is pending or in progress
    return jsonify({
        'task_id': task_id,
        'state': result.state
    })
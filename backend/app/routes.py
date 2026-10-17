from flask import Blueprint, jsonify, request

from app.search_jobs import search_jobs

bp = Blueprint('blog', __name__)


@bp.route('/search', methods=['GET'])
def search():
    """Search for jobs with the LinkedIn API"""
    query_params = request.args.to_dict(flat=True)
    result = search_jobs(query_params)
    return jsonify(result)

from flask import Blueprint, jsonify, request

from app.extract_job_post import extract_job_url
from app.search_jobs import search_jobs

bp = Blueprint('blog', __name__)


@bp.route('/search', methods=['GET'])
def search():
    """Search for jobs with the LinkedIn API"""
    query_params = request.args.to_dict(flat=True)
    result = search_jobs(query_params)
    return jsonify(result)


@bp.route('/extract', methods=['POST'])
def extract():
    """Extract job post from webpage link"""
    payload = request.get_json()
    url = payload['url']
    result = extract_job_url(url)
    return jsonify(result)

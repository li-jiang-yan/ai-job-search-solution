from flask import Blueprint, jsonify, request

from app.extract_job_post import extract_job_url
from app.search_jobs import search_jobs
from app.summarize_job_post import summarize_job_post
from app.tailor_resume import tailor_resume
from app.vectorize_resume import vectorize_sections

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


@bp.route('/summarize', methods=['POST'])
def summarize():
    """Extract job post from webpage link"""
    payload = request.get_json()
    html = payload['html']
    result = summarize_job_post(html)
    return jsonify(result)


@bp.route('/vectorize', methods=['POST'])
def vectorize():
    """vectorize a given list of resume sections"""
    payload = request.get_json()
    sections = payload['sections']
    result = vectorize_sections(sections)
    return jsonify(result)


@bp.route('/tailor', methods=['POST'])
def tailor():
    """Write a resume summary based on the given requirements"""
    payload = request.get_json()
    vectorized_resume = payload['vectorizedResume']
    job_summary = payload['jobSummary']
    result = tailor_resume(job_summary, vectorized_resume)
    return jsonify(result)

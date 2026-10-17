import json

from bs4 import BeautifulSoup

from app.extract_job_post import (
    clean_text,
    extract_job_post,
    extract_main_page_details,
    extract_structured_job,
    find_job_postings,
)


def test_clean_text_handles_missing_whitespace_and_nested_markup():
    assert clean_text(None) is None
    element = BeautifulSoup('<div>  Senior <b>Software</b>   Engineer  </div>', 'html.parser').div
    assert clean_text(element) == 'Senior Software Engineer'


def test_find_job_postings_walks_dicts_lists_and_type_lists():
    posting = {'@type': ['Thing', 'JobPosting'], 'title': 'Engineer'}
    document = {
        '@type': 'WebPage',
        'mainEntity': [None, {'@type': 'Organization'}, posting],
    }

    assert find_job_postings(document) == [posting]
    assert find_job_postings('not structured data') == []
    assert find_job_postings({'@type': 'JobPosting', 'title': 'Direct'}) == [
        {'@type': 'JobPosting', 'title': 'Direct'}
    ]


def test_extract_structured_job_skips_invalid_json_and_finds_nested_posting():
    posting = {'@type': 'JobPosting', 'title': 'Platform Engineer'}
    html = (
        '<script type="application/ld+json">{bad json</script>'
        '<script type="application/ld+json">'
        + json.dumps({'@graph': [{'@type': 'Organization'}, posting]})
        + '</script>'
    )
    assert extract_structured_job(BeautifulSoup(html, 'html.parser')) == posting


def test_extract_structured_job_handles_empty_scripts_and_no_posting():
    html = """<script type="application/ld+json"></script>
      <script type="application/ld+json">{"@type":"WebPage"}</script>"""
    assert extract_structured_job(BeautifulSoup(html, 'html.parser')) is None
    assert extract_structured_job(BeautifulSoup('<p>no metadata</p>', 'html.parser')) is None


def test_extract_main_page_details_reads_page_fields_and_apply_links():
    soup = BeautifulSoup(
        """<html><head><link rel="canonical" href="https://example.com/job"></head><body>
          <h1 class="topcard__title">  Senior <b>Engineer</b>  </h1>
          <a class="topcard__org-name-link" href="https://example.com"> Example Corp </a>
          <span class="topcard__flavor--bullet">Singapore</span>
          <span class="posted-time-ago__text"> 3 days ago </span>
          <span class="num-applicants__caption">Over 100 applicants</span>
          <div class="show-more-less-html__markup"><p>Build <b>systems</b></p></div>
          <section class="description__job-criteria-item">
            <h3 class="description__job-criteria-subheader">Employment type</h3>
            <span class="description__job-criteria-text">Full-time</span>
          </section>
          <section class="description__job-criteria-item">
            <h3 class="description__job-criteria-subheader">Experience</h3>
          </section>
          <section class="description__job-criteria-item">
            <span class="description__job-criteria-text">Ignored without a label</span>
          </section>
          <span class="compensation">$100,000 - $120,000</span>
          <a href="https://example.com/apply" data-tracking-control-name="external_apply">Apply</a>
          <button data-tracking-control-name="apply_button">Continue</button>
          <a href="/other">Apply now</a>
          <a href="/jobs/view/123" data-tracking-control-name="public_jobs_topcard">View job</a>
        </body></html>""",
        'html.parser',
    )

    result = extract_main_page_details(soup)

    assert result == {
        'title': 'Senior Engineer',
        'company': 'Example Corp',
        'company_url': 'https://example.com',
        'location': 'Singapore',
        'posted_text': '3 days ago',
        'applicant_count_text': 'Over 100 applicants',
        'description_html': (
            '<div class="show-more-less-html__markup"><p>Build <b>systems</b></p></div>'
        ),
        'description_text': 'Build systems',
        'criteria': {'Employment type': 'Full-time', 'Experience': None},
        'compensation_text': '$100,000 - $120,000',
        'job_url': '/jobs/view/123',
    }
    assert result['criteria']['Experience'] is None


def test_extract_main_page_details_falls_back_to_salary_and_canonical_url():
    soup = BeautifulSoup(
        '<link rel="canonical" href="/canonical">'
        '<div class="compensation__salary">$80,000</div>'
        '<a href="/jobs/view/1">Untracked job link</a>',
        'html.parser',
    )
    result = extract_main_page_details(soup)
    assert result['compensation_text'] == '$80,000'
    assert result['job_url'] == '/canonical'
    assert result['title'] is None
    assert result['company_url'] is None


def test_extract_main_page_details_handles_sparse_page_and_compensation_fallback():
    soup = BeautifulSoup(
        '<div class="compensation">Competitive</div>'
        '<a href="/jobs/view/1" data-tracking-control-name="public_jobs_topcard">Job</a>',
        'html.parser',
    )
    result = extract_main_page_details(soup)
    assert result['compensation_text'] == 'Competitive'
    assert result['job_url'] == '/jobs/view/1'
    assert result['criteria'] == {}
    assert result['description_html'] is None
    assert result['description_text'] is None


def test_extract_job_post_returns_structured_and_visible_description_text():
    posting = {
        '@type': 'JobPosting',
        'title': 'Engineer',
        'description': '&lt;p&gt;Design &amp;amp; build&lt;/p&gt;',
    }
    html = '<script type="application/ld+json">' + json.dumps(posting) + '</script>'
    result = extract_job_post(html)
    assert result['job_posting'] == posting
    assert result['job_posting_description_text'] == 'Design & build'
    assert result['main_job_page']['title'] is None


def test_extract_job_post_without_structured_description_omits_text_field():
    result = extract_job_post('<h1 class="topcard__title">  Analyst </h1>')
    assert result['job_posting'] is None
    assert 'job_posting_description_text' not in result
    assert result['main_job_page']['title'] == 'Analyst'

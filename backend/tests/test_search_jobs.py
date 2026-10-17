from bs4 import BeautifulSoup

from app.search_jobs import extract_job, extract_jobs, text_inside


def test_text_inside_returns_cleaned_text_or_none():
    card = BeautifulSoup(
        '<div><span class="title">  Senior <b>Engineer</b> </span></div>', 'html.parser'
    ).div

    assert text_inside(card, '.title') == 'Senior Engineer'
    assert text_inside(card, '.missing') is None


def test_extract_job_reads_all_available_fields():
    card = BeautifulSoup(
        """<div class="job-search-card" data-id="card-1">
          <a
            class="base-card__full-link"
            href="https://www.linkedin.com/jobs/view/software-engineer-12345?position=2"
          >
          </a>
          <h3 class="base-search-card__title"> Software Engineer </h3>
          <h4 class="base-search-card__subtitle">
            <a href="https://example.com"> Example Co </a>
          </h4>
          <span class="job-search-card__location">Singapore</span>
          <time class="job-search-card__listdate" datetime="2026-10-01"> 2 weeks ago </time>
          <span class="job-posting-benefits__text">Health insurance</span>
          <span class="job-posting-benefits__text"> </span>
          <img src="logo.png" alt="Example Co">
          <a href="https://example.com"> Visit </a>
        </div>""",
        'html.parser',
    ).div

    assert extract_job(card) == {
        'job_id': '12345',
        'title': 'Software Engineer',
        'company': 'Example Co',
        'location': 'Singapore',
        'listed_date': {'date': '2026-10-01', 'relative_text': '2 weeks ago'},
        'badges': ['Health insurance'],
        'job_url': 'https://www.linkedin.com/jobs/view/software-engineer-12345?position=2',
        'company_url': 'https://example.com',
        'search_result_position': '2',
    }


def test_extract_job_handles_missing_optional_fields():
    card = BeautifulSoup('<div class="job-search-card"></div>', 'html.parser').div

    assert extract_job(card) == {
        'job_id': None,
        'title': None,
        'company': None,
        'location': None,
        'listed_date': {'date': None, 'relative_text': None},
        'badges': [],
        'job_url': None,
        'company_url': None,
        'search_result_position': None,
    }


def test_extract_job_handles_job_url_without_position():
    card = BeautifulSoup(
        '<div><a class="base-card__full-link" href="https://example.com/jobs/job-987/"></a></div>',
        'html.parser',
    ).div

    result = extract_job(card)

    assert result['job_id'] == '987'
    assert result['search_result_position'] is None


def test_extract_jobs_returns_each_card_and_empty_for_no_results():
    html = """<main>
      <div class="job-search-card"><h3 class="base-search-card__title">First</h3></div>
      <div class="job-search-card"><h3 class="base-search-card__title">Second</h3></div>
    </main>"""

    assert [job['title'] for job in extract_jobs(html)] == ['First', 'Second']
    assert extract_jobs('<main>No job cards</main>') == []

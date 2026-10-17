#!/usr/bin/env python3
"""Extract the available information from one saved LinkedIn job-post HTML page."""

import html
import json
from typing import Any

import requests
from bs4 import BeautifulSoup, Tag


def clean_text(element: Tag | None) -> str | None:
    """Get readable text from an HTML element, or None if it is absent."""
    if element is None:
        return None
    return ' '.join(element.get_text(' ', strip=True).split())


def find_job_postings(value: Any) -> list[dict[str, Any]]:
    """Find JobPosting objects in JSON-LD, including nested lists/graphs."""
    found = []
    if isinstance(value, dict):
        if value.get('@type') == 'JobPosting' or (
            isinstance(value.get('@type'), list) and 'JobPosting' in value['@type']
        ):
            found.append(value)
        for child in value.values():
            found.extend(find_job_postings(child))
    elif isinstance(value, list):
        for child in value:
            found.extend(find_job_postings(child))
    return found


def extract_structured_job(soup: BeautifulSoup) -> dict[str, Any] | None:
    """Read the embedded Schema.org JobPosting record, when available."""
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            data = json.loads(script.string or script.get_text())
        except (json.JSONDecodeError, TypeError):
            continue

        postings = find_job_postings(data)
        if postings:
            return postings[0]
    return None


def extract_main_page_details(soup: BeautifulSoup) -> dict[str, Any]:
    """Extract the visible details from the main job page."""
    company = soup.select_one('.topcard__org-name-link')
    date_posted = soup.select_one('.posted-time-ago__text')
    applicant_count = soup.select_one('.num-applicants__caption')
    description = soup.select_one('.show-more-less-html__markup')

    criteria = {}
    for item in soup.select('.description__job-criteria-item'):
        label = clean_text(item.select_one('.description__job-criteria-subheader'))
        value = clean_text(item.select_one('.description__job-criteria-text'))
        if label:
            criteria[label] = value

    compensation = soup.select_one('.compensation__salary')
    if compensation is None:
        compensation = soup.select_one('.compensation')

    job_url = None
    for link in soup.select('a[href*="/jobs/view/"]'):
        if 'public_jobs_topcard' in str(link.get('data-tracking-control-name', '')):
            job_url = link.get('href')
            break
    if job_url is None:
        canonical = soup.select_one('link[rel="canonical"]')
        job_url = canonical.get('href') if canonical else None

    apply_links = []
    for link in soup.select('a[href], button'):
        tracking = str(link.get('data-tracking-control-name', ''))
        label = clean_text(link)
        if 'apply' in tracking.lower() or 'apply' in (label or '').lower():
            apply_links.append(
                {
                    'text': label,
                    'url': link.get('href'),
                    'tracking_name': tracking or None,
                }
            )

    return {
        'title': clean_text(soup.select_one('h1.topcard__title')),
        'company': clean_text(company),
        'company_url': company.get('href') if company else None,
        'location': clean_text(soup.select_one('.topcard__flavor--bullet')),
        'posted_text': clean_text(date_posted),
        'applicant_count_text': clean_text(applicant_count),
        'description_html': str(description) if description else None,
        'description_text': clean_text(description),
        'criteria': criteria,
        'compensation_text': clean_text(compensation),
        'job_url': job_url,
    }


def extract_job_post(html_source: str) -> dict[str, Any]:
    """Return one dictionary with the information found in a job-post HTML page."""
    soup = BeautifulSoup(html_source, 'html.parser')
    structured_job = extract_structured_job(soup)

    result = {
        'job_posting': structured_job,
        'main_job_page': extract_main_page_details(soup),
    }

    # Include a readable version of the description without discarding its source HTML.
    if structured_job and structured_job.get('description'):
        description_html = html.unescape(structured_job['description'])
        result['job_posting_description_text'] = clean_text(
            BeautifulSoup(description_html, 'html.parser')
        )

    return result


def extract_job_url(url: str) -> dict[str, Any]:
    """Return one dictionary with the information found in a job-post HTML page given the page's
    URL."""
    response = requests.get(url)
    response.raise_for_status()
    return extract_job_post(response.text)

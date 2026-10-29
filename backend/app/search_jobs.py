#!/usr/bin/env python3
"""Extract job details from a saved LinkedIn search-results HTML file."""

from typing import Any
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup, Tag


def text_inside(card: Tag, selector: str) -> str | None:
    """Return cleaned text from the first matching element, if present."""
    element = card.select_one(selector)
    return element.get_text(' ', strip=True) if element else None


def extract_job(card: Tag) -> dict[str, Any]:
    """Turn one LinkedIn result card into a readable dictionary."""
    title_link = card.select_one('a.base-card__full-link')
    company_link = card.select_one('h4.base-search-card__subtitle a')
    listed_date = card.select_one('time.job-search-card__listdate')

    job_url = title_link.get('href') if title_link else None
    job_id = None
    if job_url:
        # The final part of the URL path is the LinkedIn job posting ID.
        job_id = urlparse(job_url).path.rstrip('/').split('-')[-1]

    position = None
    if job_url:
        position = parse_qs(urlparse(job_url).query).get('position', [None])[0]

    return {
        'job_id': job_id,
        'title': text_inside(card, 'h3.base-search-card__title'),
        'company': text_inside(card, 'h4.base-search-card__subtitle'),
        'location': text_inside(card, '.job-search-card__location'),
        'listed_date': {
            'date': listed_date.get('datetime') if listed_date else None,
            'relative_text': listed_date.get_text(' ', strip=True) if listed_date else None,
        },
        'badges': [
            badge.get_text(' ', strip=True)
            for badge in card.select('.job-posting-benefits__text')
            if badge.get_text(' ', strip=True)
        ],
        'job_url': job_url,
        'company_url': company_link.get('href') if company_link else None,
        'search_result_position': position,
    }


def extract_jobs(html: str) -> list[dict[str, Any]]:
    """Extract all job result cards from an HTML document or fragment."""
    soup = BeautifulSoup(html, 'html.parser')
    return [extract_job(card) for card in soup.select('div.job-search-card')]


def search_jobs(query_params: dict) -> list[dict[str, Any]]:
    """Fetch and extract job result cards for the supplied search parameters."""
    response = requests.get(
        'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search',
        params=query_params,
        headers={
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/120.0.0.0 Safari/537.36'
            )
        },
    )
    response.raise_for_status()
    return extract_jobs(response.text)

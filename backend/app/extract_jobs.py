#!/usr/bin/env python3
"""Extract job details from a saved LinkedIn search-results HTML file."""

from typing import Any
from urllib.parse import parse_qs, urlparse

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
    logo = card.select_one('img')

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
        'company_logo': dict(logo.attrs) if logo else None,
        # Keep the original card metadata and links for any additional values.
        'card_attributes': dict(card.attrs),
        'links': [
            {
                'text': link.get_text(' ', strip=True),
                'url': link.get('href'),
                'attributes': dict(link.attrs),
            }
            for link in card.select('a[href]')
        ],
    }


def extract_jobs(html: str) -> list[dict[str, Any]]:
    """Extract all job result cards from an HTML document or fragment."""
    soup = BeautifulSoup(html, 'html.parser')
    return [extract_job(card) for card in soup.select('div.job-search-card')]

"""Returns the resume sections with embeddings used for RAG."""

from itertools import chain
from typing import Any

from openai import OpenAI


def vectorize_bulletlist(bulletlist: list, vectors: dict[str, int]) -> dict[str, Any]:
    """Vectorize a given bulletlist"""
    return [
        {
            'content': bulletpoint,
            'point': f'Experience: {bulletpoint}',
            'vector': vectors[f'Experience: {bulletpoint}'],
            'weight': 1.0,
        }
        for bulletpoint in bulletlist
    ]


def vectorize_entry(
    title: str, entry: Any, vectorize: str, vectors: dict[str, int]
) -> dict[str, Any]:
    """Vectorize a given resume section entry"""
    if vectorize == 'entries':
        point = get_entry_point(title, entry)
        return {
            'content': entry,
            'point': point,
            'vector': vectors[point],
            'weight': 0.2 if isinstance(entry, str) else 1.0,
        }
    elif vectorize == 'bulletlist':
        return {**entry, 'bulletlist': vectorize_bulletlist(entry['bulletlist'], vectors)}


def vectorize_section(section: dict[str, Any], vectors: dict[str, int]) -> dict[str, Any]:
    """Vectorize a given resume section represented as a dictionary"""
    title = section['title']
    vectorize = section['vectorize']
    entries = section['entries']

    return {
        'title': title,
        'vectorize': vectorize,
        'entries': [vectorize_entry(title, entry, vectorize, vectors) for entry in entries],
    }


def get_entry_point(title: str, entry: Any) -> str:
    """Get the point of a given entry"""
    if isinstance(entry, str):
        return f'{title}: {entry}'

    name = entry['name']
    dates = entry['dates']
    result = f'{title}: {name} '

    if 'institution' in entry:
        result += f'[{entry["institution"]}] '

    result += f'({dates})'

    if 'bulletlist' in entry:
        result += f' - {entry["bulletlist"]}'

    return result


def get_bulletlist_points(bulletlist: list) -> list[str]:
    """Get the points from a bulletlist"""
    return [f'Experience: {bulletpoint}' for bulletpoint in bulletlist]


def get_section_points(section: dict[str, Any]):
    """Get the points from a given section"""
    title = section['title']
    vectorize = section['vectorize']
    entries = section['entries']

    if vectorize == 'entries':
        return [get_entry_point(title, entry) for entry in entries]
    elif vectorize == 'bulletlist':
        return list(
            chain.from_iterable(get_bulletlist_points(entry['bulletlist']) for entry in entries)
        )


def vectorize_sections(sections: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Vectorize a list of resume sections suitable for the purposes of summary tailoring.
    """
    lines = list(chain.from_iterable(get_section_points(section) for section in sections))
    response = OpenAI(timeout=30).embeddings.create(model='text-embedding-3-small', input=lines)
    vectors = {line: response.data[index].embedding for (index, line) in enumerate(lines)}
    return [vectorize_section(section, vectors) for section in sections]

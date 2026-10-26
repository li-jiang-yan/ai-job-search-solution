"""Returns the resume sections with embeddings used for RAG."""

from typing import Any

from openai import OpenAI


def vectorize(nested_list: list) -> list:
    for item in nested_list:
        if isinstance(item, (list, tuple)):
            yield from vectorize(item)
        else:
            yield item


def vectorize_entry(title: str, type_: str, entry: Any) -> Any:
    """Vectorize a given resume section entry"""
    if isinstance(entry, str):  # type_ == 'skills'
        return {'content': f'{title}: {entry}', 'weight': 0.2}
    elif type_ == 'education':
        name = entry['name']
        dates = entry['dates']
        bulletlist = entry['bulletlist']
        return {'content': f'{title}: {name} ({dates}) - {bulletlist}', 'weight': 1.0}
    elif type_ == 'certification':
        name = entry['name']
        institution = entry['institution']
        dates = entry['dates']
        return {'content': f'{title}: {name} [{institution}] ({dates})', 'weight': 1.0}
    elif type_ in ('project', 'employment'):
        bulletlist = entry['bulletlist']
        return [{'content': f'Experience: {bullet}', 'weight': 1.0} for bullet in bulletlist]


def vectorize_section(section: dict[str, Any]) -> list[str]:
    """Vectorize a given resume section represented as a dictionary"""
    title = section['title']
    type_ = section['type']
    entries = section['entries']

    return [vectorize_entry(title, type_, entry) for entry in entries]


def vectorize_resume(sections: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Vectorize a list of resume sections suitable for the purposes of summary tailoring.
    """
    dicts = list(vectorize(vectorize_section(section) for section in sections))
    response = OpenAI(timeout=30).embeddings.create(
        model='text-embedding-3-small', input=[dict_['content'] for dict_ in dicts]
    )
    embeddings = [item.embedding for item in response.data]
    return [{**dict_, 'vector': embeddings[index]} for index, dict_ in enumerate(dicts)]

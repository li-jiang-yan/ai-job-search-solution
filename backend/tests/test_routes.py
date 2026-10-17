from unittest.mock import Mock

from app import routes


def test_search_route_passes_query_parameters_to_search_jobs(client, monkeypatch):
    search = Mock(return_value=[{'title': 'Engineer'}])
    monkeypatch.setattr(routes, 'search_jobs', search)

    response = client.get('/search?keywords=python&location=Singapore')

    assert response.status_code == 200
    assert response.get_json() == [{'title': 'Engineer'}]
    search.assert_called_once_with({'keywords': 'python', 'location': 'Singapore'})

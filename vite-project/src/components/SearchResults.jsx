import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

function SearchResult({ result }) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/view/${result.job_id}`)}
      style={{ cursor: 'pointer' }}
    >
      <td>
        <input type='checkbox' />
      </td>
      <td>{result.company}</td>
      <td>{result.title}</td>
      <td>{result.listed_date.date}</td>
    </tr>
  );
}

function SearchResults({ results, filterItems }) {
  const companies = filterItems.company;
  const titles = filterItems.title;
  const resultEntries = Object.entries(results)
    .filter(
      ([_, value]) => companies.size === 0 || companies.has(value.company),
    )
    .filter(([_, value]) => titles.size === 0 || titles.has(value.title));

  return (
    <Table hover>
      <tbody>
        {resultEntries.map(([key, value]) => (
          <SearchResult key={key} result={value} />
        ))}
      </tbody>
    </Table>
  );
}

export default SearchResults;

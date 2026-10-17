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

function SearchResults({ results }) {
  return (
    <Table hover>
      <tbody>
        {Object.entries(results).map(([key, value]) => (
          <SearchResult key={key} result={value} />
        ))}
      </tbody>
    </Table>
  );
}

export default SearchResults;

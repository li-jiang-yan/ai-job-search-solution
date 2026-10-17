import Table from 'react-bootstrap/Table';


function SearchResult({ result }) {return (
    <tr>
      <td><input type='checkbox' /></td>
      <td>{ result.company }</td>
      <td>{ result.title }</td>
      <td>{ result.listed_date.date }</td>
    </tr>
  );
}


function SearchResults({ results }) {
  return (
    <Table hover>
      <tbody>
        {
          results.map(
            result => <SearchResult key={result.job_id} result={result} />
          )
        }
      </tbody>
    </Table>
  );
}

export default SearchResults;

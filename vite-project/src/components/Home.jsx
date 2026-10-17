import BasicSearch from './BasicSearch';
import SearchResults from './SearchResults';

const Home = ({ results, setResults }) => {
  return (
    <>
      <BasicSearch setResults={setResults} />
      <hr className='my-4' />
      <SearchResults results={results} />
    </>
  );
};

export default Home;

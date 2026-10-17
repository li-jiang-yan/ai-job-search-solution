import BasicSearch from './BasicSearch';
import SearchResults from './SearchResults';

const Home = ({ setQueue, output }) => {
  return (
    <>
      <BasicSearch setQueue={setQueue} />
      <hr className='my-4' />
      <SearchResults results={output} />
    </>
  );
};

export default Home;

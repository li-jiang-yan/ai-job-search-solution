import BasicSearch from './BasicSearch';
import SearchResults from './SearchResults';

const Home = ({ formData, setFormData, setQueue, output }) => {
  return (
    <>
      <BasicSearch
        formData={formData}
        setFormData={setFormData}
        setQueue={setQueue}
      />
      <hr className='my-4' />
      <SearchResults results={output} />
    </>
  );
};

export default Home;

import BasicSearch from './BasicSearch';
import SearchResults from './SearchResults';

const Home = ({ formData, setFormData, output, setIsSearching }) => {
  return (
    <>
      <BasicSearch
        formData={formData}
        setFormData={setFormData}
        setIsSearching={setIsSearching}
      />
      <hr className='my-4' />
      <SearchResults results={output} />
    </>
  );
};

export default Home;

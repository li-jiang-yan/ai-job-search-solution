import BasicSearch from './BasicSearch';
import SearchResults from './SearchResults';

const Home = ({
  formData,
  setFormData,
  output,
  isSearching,
  setIsSearching,
}) => {
  return (
    <>
      <BasicSearch
        formData={formData}
        setFormData={setFormData}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
      <hr className='my-4' />
      <SearchResults results={output} />
    </>
  );
};

export default Home;

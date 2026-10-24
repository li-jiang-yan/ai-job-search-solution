import BasicSearch from './BasicSearch';
import FilterSort from './FilterSort';
import ResumeUpload from './ResumeUpload';
import SearchResults from './SearchResults';

const Home = ({
  setResume,
  formData,
  setFormData,
  isSearching,
  setIsSearching,
  filterItems,
  setFilterItems,
  output,
}) => {
  return (
    <>
      <ResumeUpload setResume={setResume} />
      <BasicSearch
        formData={formData}
        setFormData={setFormData}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
      <hr className='my-4' />
      <FilterSort
        results={output}
        filterItems={filterItems}
        setFilterItems={setFilterItems}
      />
      <hr className='my-4' />
      <SearchResults results={output} filterItems={filterItems} />
    </>
  );
};

export default Home;

import BasicSearch from './BasicSearch';
import ResumeUpload from './ResumeUpload';
import SearchResults from './SearchResults';

const Home = ({
  setResume,
  formData,
  setFormData,
  isSearching,
  setIsSearching,
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
      <SearchResults results={output} />
    </>
  );
};

export default Home;

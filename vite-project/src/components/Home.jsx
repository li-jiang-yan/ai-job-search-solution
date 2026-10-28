import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import BasicSearch from './BasicSearch';
import FilterSort from './FilterSort';
import ResumeUpload from './ResumeUpload';
import SearchResults from './SearchResults';

const Home = ({
  isUploading,
  setResume,
  vectorizedResume,
  formData,
  setFormData,
  isSearching,
  setIsSearching,
  filterItems,
  setFilterItems,
  sortTerm,
  setSortTerm,
  output,
}) => {
  return (
    <>
      <ResumeUpload setResume={setResume} vectorizedResume={vectorizedResume} />
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
        sortTerm={sortTerm}
        setSortTerm={setSortTerm}
      />
      <hr className='my-4' />
      {isUploading ? (
        <Alert variant='warning'>
          <Spinner as='span' animation='border' size='sm' role='status' />
          &ensp;Resume uploading in progress...
        </Alert>
      ) : (
        <SearchResults results={output} filterItems={filterItems} />
      )}
    </>
  );
};

export default Home;

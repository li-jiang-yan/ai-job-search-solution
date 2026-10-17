import { useState } from 'react';

import BasicSearch from './BasicSearch';
import SearchResults from './SearchResults';

const Main = () => {
  const [results, setResults] = useState([]);

  return (
    <main>
      <BasicSearch setResults={setResults} />
      <hr className='my-4' />
      <SearchResults results={results} />
    </main>
  );
};

export default Main;

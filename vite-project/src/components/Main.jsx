import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';

const Main = () => {
  const [results, setResults] = useState([]);

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Home results={results} setResults={setResults} />}
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default Main;

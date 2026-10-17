import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';
import View from './View';

const Main = () => {
  const [queue, setQueue] = useState([]);
  const [output, setOutput] = useState({});

  useEffect(() => {
    if (queue.length === 0) return;

    const [firstJob, ...remainingJobs] = queue;
    setQueue(remainingJobs);

    const extractPost = async () => {
      try {
        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: firstJob.job_url,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setOutput((previousOutput) => ({
          ...previousOutput,
          [firstJob.job_id]: { ...firstJob, ...data },
        }));
      } catch (error) {
        console.error('Fetch operation failed:', error);
        setQueue((queue) => queue.concat(firstJob));
      }
    };

    extractPost();
  }, [queue]);

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Home setQueue={setQueue} output={output} />}
          />
          <Route path='/view/:jobId' element={<View output={output} />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default Main;

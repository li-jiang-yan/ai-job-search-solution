import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';
import View from './View';

const Main = () => {
  const [queue, setQueue] = useState([]);
  const [output, setOutput] = useState({});

  // ResumeUpload
  const [resume, setResume] = useState({});
  const [flatResume, setFlatResume] = useState([]);

  // BasicSearch
  const [formData, setFormData] = useState({
    keywords: '',
    location: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (Object.keys(resume).length > 0) {
      const flattenResume = async () => {
        try {
          const response = await fetch('/api/flatten', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sections: resume.sections,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          setFlatResume(result);
        } catch (e) {
          console.error('Fetch operation failed:', e);
        }
      };

      flattenResume();
    }
  }, [resume]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only on isSearching
  useEffect(() => {
    const searchJobs = async () => {
      let start = 0;

      while (isSearching) {
        try {
          const queryParams = new URLSearchParams({
            ...formData,
            start: start,
          }).toString();
          const response = await fetch(`/api/search?${queryParams}`);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setQueue((queue) => queue.concat(data));

          if (data.length === 0) break;

          start += data.length;
        } catch (error) {
          console.error('Fetch operation failed:', error);
        }
      }
    };

    searchJobs();
  }, [isSearching]);

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

  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
  });

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                setResume={setResume}
                formData={formData}
                setFormData={setFormData}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                output={output}
              />
            }
          />
          <Route
            path='/view/:jobId'
            element={
              <View
                output={output}
                setOutput={setOutput}
                flatResume={flatResume}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default Main;

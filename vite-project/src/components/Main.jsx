import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';
import View from './View';

const Main = () => {
  const [queue, setQueue] = useState([]);
  const [output, setOutput] = useState({});

  // ResumeUpload
  const [resume, setResume] = useState({});
  const [vectorizedResume, setVectorizedResume] = useState([]);

  // BasicSearch
  const [formData, setFormData] = useState({
    keywords: '',
    location: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  // FilterSort
  const [filterItems, setFilterItems] = useState({
    company: new Set(),
    title: new Set(),
    date: '',
  });
  const [sortTerm, setSortTerm] = useState('');
  const sortTermArray =
    sortTerm.trim() === '' ? [] : sortTerm.trim().toLowerCase().split(' ');

  useEffect(() => {
    if (Object.keys(resume).length > 0) {
      const vectorizeResume = async () => {
        try {
          const response = await fetch('/api/vectorize', {
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
          setVectorizedResume(result);
          alert('Resume uploaded.');
        } catch (e) {
          console.error('Fetch operation failed:', e);
          alert('Error vectorizing resume. Please try again.');
        }
      };

      vectorizeResume();
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only on queue
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
          [firstJob.job_id]: {
            ...firstJob,
            ...data,
            matches: sortTermArray.filter((element) =>
              data.main_job_page.description_html
                .toLowerCase()
                .includes(element),
            ),
          },
        }));
      } catch (error) {
        console.error('Fetch operation failed:', error);
        setQueue((queue) => queue.concat(firstJob));
      }
    };

    extractPost();
  }, [queue]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only on sortTermArray
  useEffect(() => {
    for (const [key, _] of Object.entries(output)) {
      setOutput((previousOutput) => ({
        ...previousOutput,
        [key]: {
          ...previousOutput[key],
          matches: sortTermArray.filter((element) =>
            previousOutput[key].main_job_page.description_html
              .toLowerCase()
              .includes(element),
          ),
        },
      }));
    }
  }, [sortTerm]);

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
                filterItems={filterItems}
                setFilterItems={setFilterItems}
                sortTerm={sortTerm}
                setSortTerm={setSortTerm}
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
                vectorizedResume={vectorizedResume}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default Main;

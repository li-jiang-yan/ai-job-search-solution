import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const tailorSummary = async (flatResume, jobSummary) => {
  const response = await fetch('/api/tailor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resumePoints: flatResume,
      jobSummary: jobSummary,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

const ResumeSummary = ({ output, flatResume, jobId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const object = output[jobId];
  const jobSummary = object?.summary;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only on jobSummary
  useEffect(() => {
    const loadSummary = async () => {
      if (jobSummary !== undefined) {
        try {
          const result = await tailorSummary(flatResume, jobSummary);
          setSummary(result.summary);
        } catch (e) {
          console.error('Fetch operation failed:', e);
          setError(e.message);
        }

        setIsLoading(false);
      }
    };

    loadSummary();
  }, [jobSummary]);

  if (flatResume.length === 0) {
    return <Alert variant='danger'>No resume uploaded.</Alert>;
  }

  if (isLoading) {
    return <Spinner animation='border' role='status' />;
  }

  if (error) {
    return <Alert variant='danger'>{error}</Alert>;
  }

  return <div>{summary}</div>;
};

export default ResumeSummary;

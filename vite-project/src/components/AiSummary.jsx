import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

const summarizeHtml = async (htmlDescription) => {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      html: htmlDescription,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

const AiSummary = ({ output, setOutput, jobId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const object = output[jobId];
  const htmlDescription = object.main_job_page.description_html;
  const summary = object?.summary;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only on mount
  useEffect(() => {
    const loadSummary = async () => {
      if (summary === undefined) {
        try {
          const result = await summarizeHtml(htmlDescription);
          setOutput((previousOutput) => ({
            ...previousOutput,
            [jobId]: {
              ...previousOutput[jobId],
              summary: result,
            },
          }));
        } catch (e) {
          console.error('Fetch operation failed:', e);
          setError(e.message);
        }
      }

      setIsLoading(false);
    };

    loadSummary();
  }, []);

  if (isLoading) {
    return (
      <div className='mb-3'>
        <Spinner animation='border' role='status' />
      </div>
    );
  }

  if (error) {
    return <Alert variant='danger'>{error}</Alert>;
  }

  return (
    <ul>
      {summary.map((element) => (
        <li key={crypto.randomUUID()}>{element}</li>
      ))}
    </ul>
  );
};

export default AiSummary;

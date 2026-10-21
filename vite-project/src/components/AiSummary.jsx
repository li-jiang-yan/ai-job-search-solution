import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

const AiSummary = ({ output, setOutput, jobId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const object = output[jobId];
  const htmlDescription = object.main_job_page.description_html;
  const summary = object?.summary;

  useEffect(() => {
    const summarizePost = async () => {
      if (summary === undefined) {
        try {
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

          setOutput((previousOutput) => ({
            ...previousOutput,
            [jobId]: { ...previousOutput[jobId], summary: data },
          }));
        } catch (error) {
          console.error('Fetch operation failed:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    summarizePost();
  }, [
    summary,
    htmlDescription,
    jobId, // constant (needed by Biome)
    setOutput, // setter, does no harm (needed by Biome linter)
  ]);

  if (isLoading) {
    return <Spinner animation='border' role='status' />;
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

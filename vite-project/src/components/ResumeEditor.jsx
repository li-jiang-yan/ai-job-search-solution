import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ResumeSection from './EditorElements/ResumeSection';
import ResumeSummary from './EditorElements/ResumeSummary';

const tailorResume = async (vectorizedResume, jobSummary) => {
  const response = await fetch('/api/tailor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vectorizedResume: vectorizedResume,
      jobSummary: jobSummary,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

const ResumeEditor = ({ editorOpen, object, vectorizedResume }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [editorResume, setEditorResume] = useState({});
  const jobSummary = object.summary;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run only on editorOpen
  useEffect(() => {
    const loadEditor = async () => {
      try {
        const result = await tailorResume(vectorizedResume, jobSummary);
        setEditorResume(result);
      } catch (e) {
        console.error('Fetch operation failed:', e);
        setError(e.message);
      }

      setIsLoading(false);
    };

    loadEditor();
  }, [editorOpen]);

  if (!editorOpen) {
    return null;
  }

  if (isLoading) {
    return (
      <div className='mb-3'>
        <Spinner animation='border' role='status' />
      </div>
    );
  }

  return (
    <>
      <Button className='ms-2 mb-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          class='bi bi-download'
          viewBox='0 0 16 16'
        >
          <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5' />
          <path d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z' />
        </svg>
        &ensp;Resume
      </Button>
      <h6>Resume Summary</h6>
      <ResumeSummary
        editorResume={editorResume}
        setEditorResume={setEditorResume}
      />
      <h6>Resume Sections</h6>
      {editorResume.sections.map((section) => (
        <ResumeSection key={crypto.randomUUID()} section={section} />
      ))}
    </>
  );
};

export default ResumeEditor;

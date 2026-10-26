import parse from 'html-react-parser';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate, useParams } from 'react-router-dom';
import AiSummary from './AiSummary';
import ErrorBoundary from './ErrorBoundary';
import ResumeEditor from './ResumeEditor';

const View = ({ output, setOutput, flatResume }) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const object = output[jobId];

  const handleClick = () => {
    if (flatResume.length === 0) {
      alert('No resume uploaded. Please upload resume at main page.');
      return;
    }

    if (object?.summary === undefined) {
      alert('Please wait for AI Summary to be generated before continuing.');
      return;
    }

    setEditorOpen(true);
  };

  return (
    <>
      <Button className='me-1 mb-3' onClick={() => navigate('/')}>
        Home
      </Button>
      <Button
        className='mx-1 mb-3'
        href={object.job_url}
        target='_blank'
        rel='noopener noreferrer'
      >
        View on&ensp;
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-linkedin'
          viewBox='0 0 16 16'
        >
          <path d='M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z' />
        </svg>
      </Button>
      <h1 className='h5'>{object.title}</h1>
      <Row className='g-5 mb-3'>
        <Col md={6}>
          <h2 className='h6'>{object.company}</h2>
        </Col>
        <Col md={6} className='text-end'>
          {object.listed_date.date}
        </Col>
      </Row>
      <Row className='g-5'>
        <Col md={6}>
          <h6>Job Description</h6>
          {parse(object.main_job_page.description_html)}
        </Col>
        <Col md={6}>
          <h6>AI Summary</h6>
          <ErrorBoundary>
            <AiSummary output={output} setOutput={setOutput} jobId={jobId} />
          </ErrorBoundary>
          <Button className='mb-3' disabled={editorOpen} onClick={handleClick}>
            Edit Resume
          </Button>
          <ErrorBoundary>
            <ResumeEditor
              editorOpen={editorOpen}
              object={object}
              flatResume={flatResume}
            />
          </ErrorBoundary>
        </Col>
      </Row>
    </>
  );
};

export default View;

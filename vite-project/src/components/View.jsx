import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import JobDetails from './JobDetails';

const View = ({ output, setOutput }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Button className='mb-3' onClick={() => navigate('/')}>
        Home
      </Button>
      <ErrorBoundary>
        <JobDetails output={output} setOutput={setOutput} jobId={jobId} />
      </ErrorBoundary>
    </>
  );
};

export default View;

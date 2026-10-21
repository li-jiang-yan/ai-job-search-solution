import parse from 'html-react-parser';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate, useParams } from 'react-router-dom';
import AiSummary from './AiSummary';
import ErrorBoundary from './ErrorBoundary';

const View = ({ output, setOutput }) => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const object = output[jobId];

  return (
    <>
      <Button className='mb-3' onClick={() => navigate('/')}>
        Home
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
        </Col>
      </Row>
    </>
  );
};

export default View;

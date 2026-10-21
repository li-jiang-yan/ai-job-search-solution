import parse from 'html-react-parser';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import AiSummary from './AiSummary';

const JobDetails = ({ output, setOutput, jobId }) => {
  const object = output[jobId];

  return (
    <>
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
          <AiSummary output={output} setOutput={setOutput} jobId={jobId} />
        </Col>
      </Row>
    </>
  );
};

export default JobDetails;

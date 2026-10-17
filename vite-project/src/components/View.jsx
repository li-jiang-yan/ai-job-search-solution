import parse from 'html-react-parser';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate, useParams } from 'react-router-dom';

const View = ({ output }) => {
  const { jobId } = useParams();
  const object = output[jobId];
  const navigate = useNavigate();

  console.log(object);

  return (
    <>
      <Button onClick={() => navigate('/')}>Home</Button>
      <h1 className='h5 mt-3'>{object.title}</h1>
      <Row className='g-5 mb-3'>
        <Col md={6}>
          <h2 className='h6'>{object.company}</h2>
        </Col>
        <Col md={6} className='text-end'>
          {object.listed_date.date}
        </Col>
      </Row>
      <Row className='g-5'>
        <Col md={6}>{parse(object.main_job_page.description_html)}</Col>
        <Col md={6}></Col>
      </Row>
    </>
  );
};

export default View;

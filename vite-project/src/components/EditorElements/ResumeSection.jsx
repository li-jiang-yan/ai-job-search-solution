import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SectionEntry from './SectionEntry';

const ResumeSection = ({ section }) => {
  const vectorize = section.vectorize;

  return (
    <Card className='mb-3'>
      <Card.Body>
        <Form.Check type='checkbox'>
          <Row>
            <Col xs='auto'>
              <Form.Check.Input type='checkbox' defaultChecked={true} />
            </Col>
            <Col>
              <Card.Title>{section.title}</Card.Title>
              {section.entries.map((entry) => (
                <SectionEntry
                  key={crypto.randomUUID()}
                  vectorize={vectorize}
                  entry={entry}
                />
              ))}
            </Col>
          </Row>
        </Form.Check>
      </Card.Body>
    </Card>
  );
};

export default ResumeSection;

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const EntryBulletlist = ({ bulletlist }) => {
  if (bulletlist.every((item) => typeof item === 'string')) {
    return (
      <>
        {bulletlist.map((bulletpoint) => (
          <Form.Check
            key={crypto.randomUUID()}
            type='checkbox'
            className='mb-1'
          >
            <Row>
              <Col xs='auto'>
                <Form.Check.Input type='checkbox' defaultChecked={true} />
              </Col>
              <Col>{bulletpoint}</Col>
            </Row>
          </Form.Check>
        ))}
      </>
    );
  }

  if (bulletlist.every((item) => typeof item === 'object')) {
    return (
      <>
        {bulletlist.map((bulletpoint) => (
          <Form.Check
            key={crypto.randomUUID()}
            type='checkbox'
            className='mb-1'
          >
            <Row>
              <Col xs='auto'>
                <Form.Check.Input type='checkbox' defaultChecked={true} />
              </Col>
              <Col>{bulletpoint.content}</Col>
              <Col xs='auto'>
                ({(bulletpoint.similarity * 100).toFixed(1)}%)
              </Col>
            </Row>
          </Form.Check>
        ))}
      </>
    );
  }

  return null;
};

export default EntryBulletlist;

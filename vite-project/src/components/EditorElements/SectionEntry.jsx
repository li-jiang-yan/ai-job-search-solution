import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import EntryBulletlist from './EntryBulletlist';
import EntrySubheading from './EntrySubheading';

const SectionEntry = ({ vectorize, entry }) => {
  if (vectorize === 'entries') {
    const similarity = entry.similarity * 100;

    if (typeof entry.content === 'string') {
      return (
        <Form.Check type='checkbox'>
          <Row>
            <Col xs='auto'>
              <Form.Check.Input type='checkbox' defaultChecked={true} />
            </Col>
            <Col>{entry.content}</Col>
            <Col xs='auto'>({similarity.toFixed(1)}%)</Col>
          </Row>
        </Form.Check>
      );
    }

    const name = entry.content.name;
    const dates = entry.content.dates;

    return (
      <Form.Check type='checkbox' className='mb-3'>
        <Row>
          <Col xs='auto'>
            <Form.Check.Input type='checkbox' defaultChecked={true} />
          </Col>
          <Col>
            <Card.Subtitle className='mt-0 mb-2'>
              {name} ({dates})
            </Card.Subtitle>
            {Object.hasOwn(entry.content, 'institution') ? (
              <EntrySubheading innerText={entry.content.institution} />
            ) : null}
            {Object.hasOwn(entry.content, 'bulletlist') ? (
              <EntryBulletlist bulletlist={entry.content.bulletlist} />
            ) : null}
          </Col>
          <Col xs='auto'>({similarity.toFixed(1)}%)</Col>
        </Row>
      </Form.Check>
    );
  }

  if (vectorize === 'bulletlist') {
    const name = entry.name;
    const dates = entry.dates;

    return (
      <Form.Check type='checkbox' className='mb-3'>
        <Row>
          <Col xs='auto'>
            <Form.Check.Input type='checkbox' defaultChecked={true} />
          </Col>
          <Col>
            <Card.Subtitle className='mt-0 mb-2'>
              {name} ({dates})
            </Card.Subtitle>
            {Object.hasOwn(entry, 'company') ? (
              <EntrySubheading innerText={entry.company} />
            ) : null}
            <EntryBulletlist bulletlist={entry.bulletlist} />
          </Col>
        </Row>
      </Form.Check>
    );
  }

  return null;
};

export default SectionEntry;

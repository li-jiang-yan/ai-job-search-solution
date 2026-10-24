import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const FilterSort = () => {
  return (
    <Form className='mb-3'>
      <p>Filter/Sort Results</p>
      <Row className='mb-3'>
        <Form.Group as={Col}>
          <Form.Label>Company</Form.Label>
          <Form.Select></Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Title</Form.Label>
          <Form.Select></Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Earliest Post Date</Form.Label>
          <Form.Control type='date'></Form.Control>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Search</Form.Label>
          <Form.Control />
          <Form.Text></Form.Text>
        </Form.Group>
      </Row>
    </Form>
  );
};

export default FilterSort;

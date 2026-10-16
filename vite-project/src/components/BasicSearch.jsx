import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function BasicSearch() {
  const [formData, setFormData] = useState(
    {
      title: '',
      city: ''
    }
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(
      {
        ...formData,
        [name]: value
      }
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`title: ${formData.title}, city: ${formData.city}`);
  };

  return (
    <Form>
      <h4 className='mb-3'>Basic Search</h4>
      <Row>
        <Form.Group as={Col}>
          <Form.Control
            placeholder='Title, skill, or company'
            name='title'
            value={formData.title}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            placeholder='City, state, or zip code'
            name='city'
            value={formData.city}
            onChange={handleChange}
          />
        </Form.Group>
        <Col xs='auto'>
          <Button type='submit' onClick={handleSubmit}>
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default BasicSearch;

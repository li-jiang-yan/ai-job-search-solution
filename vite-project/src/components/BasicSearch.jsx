import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function BasicSearch({ setQueue }) {
  const [formData, setFormData] = useState({
    keywords: '',
    location: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let start = 0;

    while (true) {
      try {
        const queryParams = new URLSearchParams({
          ...formData,
          start: start,
        }).toString();
        const response = await fetch(`/api/search?${queryParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQueue((queue) => queue.concat(data));
        start += data.length;
      } catch (error) {
        console.error('Fetch operation failed:', error);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className='mb-3'>Basic Search</h4>
      <Row>
        <Form.Group as={Col}>
          <Form.Control
            placeholder='Title, skill, or company'
            name='keywords'
            value={formData.keywords}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            placeholder='City, state, or zip code'
            name='location'
            value={formData.location}
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

import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function getUniqueArrayOf(objectArray, key) {
  const set = new Set(
    Object.entries(objectArray).map(([_, value]) => value[key]),
  );
  return Array.from(set).sort();
}

function MultiSelectCheckbox({ objectArray, objectKey }) {
  const optionsList = getUniqueArrayOf(objectArray, objectKey);
  const [selectedItems, setSelectedItems] = useState([]);

  // Toggle selection
  const handleCheckboxChange = (id) => {
    setSelectedItems(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id) // Remove item
          : [...prevSelected, id], // Add item
    );
  };

  // Format button text dynamically
  const getDropdownLabel = () => {
    if (selectedItems.length === 0) return 'Select Options';
    if (selectedItems.length === optionsList.length) return 'All Selected';
    return `${selectedItems.length} Selected`;
  };

  return (
    <Dropdown autoClose='outside'>
      <Dropdown.Toggle
        variant='outline-secondary'
        className='w-100 text-start d-flex justify-content-between align-items-center'
      >
        {getDropdownLabel()}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className='w-100 px-3'
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        {optionsList.map((option) => (
          <Form.Check
            key={crypto.randomUUID()}
            type='checkbox'
            label={option}
            checked={selectedItems.includes(option.id)}
            onChange={() => handleCheckboxChange(option.id)}
            className='py-1'
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const FilterSort = ({ results }) => {
  return (
    <Form className='mb-3'>
      <p>Filter/Sort Results</p>
      <Row className='mb-3'>
        <Form.Group as={Col}>
          <Form.Label>Company</Form.Label>
          <MultiSelectCheckbox objectArray={results} objectKey='company' />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Title</Form.Label>
          <MultiSelectCheckbox objectArray={results} objectKey='title' />
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

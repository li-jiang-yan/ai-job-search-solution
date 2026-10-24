import { useState } from 'react';
import Button from 'react-bootstrap/Button';
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

function MultiSelectCheckbox({
  objectArray,
  objectKey,
  filterItems,
  setFilterItems,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const optionsList = getUniqueArrayOf(objectArray, objectKey);
  const filteredOptions = optionsList.filter((option) =>
    String(option).toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const selectedItems = filterItems[objectKey];

  // Toggle selection
  const handleCheckboxChange = (event, option) => {
    const newSelectedItems = new Set(selectedItems);

    if (event.target.checked) {
      newSelectedItems.add(option);
    } else {
      newSelectedItems.delete(option);
    }

    setFilterItems({
      ...filterItems,
      [objectKey]: newSelectedItems,
    });
  };

  const handleSelectAll = () => {
    setFilterItems({
      ...filterItems,
      [objectKey]: new Set(optionsList),
    });
  };

  const handleClear = () => {
    setFilterItems({
      ...filterItems,
      [objectKey]: new Set(),
    });
  };

  // Format button text dynamically
  const getDropdownLabel = () => {
    if (selectedItems.size === 0) return 'Select Options';
    if (selectedItems.size === optionsList.length) return 'All Selected';
    return `${selectedItems.size} Selected`;
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
        <Button variant='link' onClick={handleSelectAll}>
          Select All
        </Button>
        <Button variant='link' onClick={handleClear}>
          Clear
        </Button>
        <Form.Control
          type='search'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          className='mb-1'
        />
        {filteredOptions.map((option) => (
          <Form.Check
            key={crypto.randomUUID()}
            type='checkbox'
            label={option}
            checked={selectedItems.has(option)}
            onChange={(e) => handleCheckboxChange(e, option)}
            className='py-1'
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const FilterSort = ({ results, filterItems, setFilterItems }) => {
  const handleDateChange = (event) => {
    setFilterItems({
      ...filterItems,
      date: event.target.value,
    });
  };

  return (
    <Form className='mb-3'>
      <p>Filter/Sort Results</p>
      <Row className='mb-3'>
        <Form.Group as={Col}>
          <Form.Label>Company</Form.Label>
          <MultiSelectCheckbox
            objectArray={results}
            objectKey='company'
            filterItems={filterItems}
            setFilterItems={setFilterItems}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Title</Form.Label>
          <MultiSelectCheckbox
            objectArray={results}
            objectKey='title'
            filterItems={filterItems}
            setFilterItems={setFilterItems}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Earliest Post Date</Form.Label>
          <Form.Control type='date' onChange={handleDateChange}></Form.Control>
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

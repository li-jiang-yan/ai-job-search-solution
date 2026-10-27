import Form from 'react-bootstrap/Form';

const ResumeSummary = ({ resumeSummary }) => {
  return (
    <Form.Control
      as='textarea'
      value={resumeSummary}
      className='my-3'
      style={{
        fieldSizing: 'content',
      }}
    />
  );
};

export default ResumeSummary;

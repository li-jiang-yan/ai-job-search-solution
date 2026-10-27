import Form from 'react-bootstrap/Form';

const ResumeSummary = ({ editorResume, setEditorResume }) => {
  const handleChange = (event) => {
    setEditorResume({ ...editorResume, summary: event.target.value });
  };

  return (
    <Form.Control
      as='textarea'
      value={editorResume.summary}
      className='my-3'
      style={{
        fieldSizing: 'content',
      }}
      onChange={handleChange}
    />
  );
};

export default ResumeSummary;

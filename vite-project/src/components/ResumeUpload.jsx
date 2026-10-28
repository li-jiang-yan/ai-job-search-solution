import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const ResumeUpload = ({ setResume, vectorizedResume }) => {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setButtonEnabled(Boolean(event.target.files.length));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const text = await file.text();
      setResume(JSON.parse(text));
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  return (
    <Form className='mb-3' onSubmit={handleSubmit}>
      <p>Resume JSON</p>
      <Row>
        <Form.Group as={Col} controlId='formFile' className='mb-3'>
          <Form.Control
            type='file'
            accept='.json'
            onChange={handleFileChange}
          />
        </Form.Group>
        <Col xs='auto'>
          <Button type='submit' disabled={!buttonEnabled}>
            Upload
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {vectorizedResume &&
          Object.keys(vectorizedResume).length === 0 &&
          vectorizedResume.constructor === Object ? (
            <Alert variant='warning'>Resume not uploaded.</Alert>
          ) : (
            <Alert variant='success'>Resume successfully uploaded.</Alert>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default ResumeUpload;

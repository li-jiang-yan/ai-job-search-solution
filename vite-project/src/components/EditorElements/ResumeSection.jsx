import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ReactSortable } from 'react-sortablejs';
import SectionEntry from './SectionEntry';

const convertToKey = (value) => {
  return value
    .toLowerCase()
    .replaceAll(' ', '-')
    .replace(/[()[\]{}]/g, '');
};

const ResumeSection = ({ section, setEditorResume }) => {
  const vectorize = section.vectorize;
  const getKey = (entry) => {
    if (vectorize === 'entries') {
      if (typeof entry.content === 'string') {
        return convertToKey(entry.content);
      }

      return convertToKey(entry.content.name);
    }

    if (vectorize === 'bulletlist') {
      return convertToKey(entry.name);
    }

    return null;
  };

  const setEntries = (entries) => {
    return setEditorResume((currentResume) => {
      return {
        ...currentResume,
        sections: currentResume.sections.map((section_) =>
          section_.title === section.title ? { ...section, entries } : section_,
        ),
      };
    });
  };

  return (
    <Card className='mb-3'>
      <Card.Body>
        <Form.Check type='checkbox'>
          <Row>
            <Col xs='auto'>
              <Form.Check.Input type='checkbox' defaultChecked={true} />
            </Col>
            <Col>
              <Card.Title>{section.title}</Card.Title>
              <ReactSortable
                list={section.entries}
                setList={setEntries}
                group={{ name: 'resume-entries', pull: false, put: false }}
                setData={(dataTransfer) =>
                  dataTransfer.setData('text/plain', 'resume-entry')
                }
              >
                {section.entries.map((entry) => (
                  <SectionEntry
                    key={getKey(entry)}
                    sectionTitle={section.title}
                    vectorize={vectorize}
                    entry={entry}
                    setEditorResume={setEditorResume}
                  />
                ))}
              </ReactSortable>
            </Col>
          </Row>
        </Form.Check>
      </Card.Body>
    </Card>
  );
};

export default ResumeSection;

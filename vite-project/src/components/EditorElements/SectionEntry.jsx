import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import EntryBulletlist from './EntryBulletlist';
import EntrySubheading from './EntrySubheading';

const SectionEntry = ({ sectionTitle, vectorize, entry, setEditorResume }) => {
  const checked = entry.checked;
  const vectorizeBulletlist = vectorize === 'bulletlist';
  const handleCheckboxChange = (event) => {
    setEditorResume((currentResume) => ({
      ...currentResume,
      sections: currentResume.sections.map((section_) => {
        if (section_.title !== sectionTitle) {
          return section_;
        }

        return {
          ...section_,
          entries: section_.entries.map((entry_) => {
            if (vectorizeBulletlist) {
              if (entry_.name !== entry.name) return entry_;
            } else if (typeof entry_.content === 'string') {
              if (entry_.content !== entry.content) return entry_;
            } else if (entry_.content.name !== entry.content.name) {
              return entry_;
            }

            return { ...entry_, checked: event.target.checked };
          }),
        };
      }),
    }));
  };

  if (vectorize === 'entries') {
    const similarity = entry.similarity * 100;

    if (typeof entry.content === 'string') {
      return (
        <Form.Check type='checkbox'>
          <Row>
            <Col xs='auto'>
              <Form.Check.Input
                type='checkbox'
                checked={checked}
                onChange={handleCheckboxChange}
              />
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
            <Form.Check.Input
              type='checkbox'
              checked={checked}
              onChange={handleCheckboxChange}
            />
          </Col>
          <Col>
            <Card.Subtitle className='mt-0 mb-2'>
              {name} ({dates})
            </Card.Subtitle>
            {Object.hasOwn(entry.content, 'institution') ? (
              <EntrySubheading innerText={entry.content.institution} />
            ) : null}
            {Object.hasOwn(entry.content, 'bulletlist') ? (
              <EntryBulletlist
                sectionTitle={sectionTitle}
                entryName={entry.content.name}
                bulletlist={entry.content.bulletlist}
                setEditorResume={setEditorResume}
              />
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
            <Form.Check.Input
              type='checkbox'
              checked={checked}
              onChange={handleCheckboxChange}
            />
          </Col>
          <Col>
            <Card.Subtitle className='mt-0 mb-2'>
              {name} ({dates})
            </Card.Subtitle>
            {Object.hasOwn(entry, 'company') ? (
              <EntrySubheading innerText={entry.company} />
            ) : null}
            <EntryBulletlist
              sectionTitle={sectionTitle}
              entryName={entry.name}
              bulletlist={entry.bulletlist}
              setEditorResume={setEditorResume}
            />
          </Col>
        </Row>
      </Form.Check>
    );
  }

  return null;
};

export default SectionEntry;

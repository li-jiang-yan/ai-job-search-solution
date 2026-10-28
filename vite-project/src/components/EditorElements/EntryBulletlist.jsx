import LZString from 'lz-string';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ReactSortable } from 'react-sortablejs';

const EntryBulletlist = ({
  sectionTitle,
  entryName,
  bulletlist,
  setEditorResume,
}) => {
  const vectorizeBulletlist = bulletlist.every((bulletpoint) =>
    Object.hasOwn(bulletpoint, 'similarity'),
  );

  const setBulletlist = (updatedBulletlist) => {
    setEditorResume((currentResume) => ({
      ...currentResume,
      sections: currentResume.sections.map((section) => {
        if (section.title !== sectionTitle) {
          return section;
        }

        return {
          ...section,
          entries: section.entries.map((entry_) => {
            const entryName_ = vectorizeBulletlist
              ? entry_.name
              : entry_.content.name;

            if (entryName_ !== entryName) {
              return entry_;
            }

            if (vectorizeBulletlist) {
              return { ...entry_, bulletlist: updatedBulletlist };
            }

            return {
              ...entry_,
              content: { ...entry_.content, bulletlist: updatedBulletlist },
            };
          }),
        };
      }),
    }));
  };

  if (vectorizeBulletlist) {
    return (
      <ReactSortable list={bulletlist} setList={setBulletlist}>
        {bulletlist.map((bulletpoint) => (
          <Form.Check
            key={LZString.compressToEncodedURIComponent(bulletpoint.content)}
            type='checkbox'
            className='mb-1'
          >
            <Row>
              <Col xs='auto'>
                <Form.Check.Input type='checkbox' defaultChecked={true} />
              </Col>
              <Col>{bulletpoint.content}</Col>
              <Col xs='auto'>
                ({(bulletpoint.similarity * 100).toFixed(1)}%)
              </Col>
            </Row>
          </Form.Check>
        ))}
      </ReactSortable>
    );
  }

  return (
    <ReactSortable list={bulletlist} setList={setBulletlist}>
      {bulletlist.map((bulletpoint) => (
        <Form.Check
          key={LZString.compressToEncodedURIComponent(bulletpoint.string)}
          type='checkbox'
          className='mb-1'
        >
          <Row>
            <Col xs='auto'>
              <Form.Check.Input type='checkbox' defaultChecked={true} />
            </Col>
            <Col>{bulletpoint.string}</Col>
          </Row>
        </Form.Check>
      ))}
    </ReactSortable>
  );
};

export default EntryBulletlist;

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

  const handleCheckboxChange = (event, bulletpointText) => {
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
              if (entry_.name !== entryName) return entry_;
              return {
                ...entry_,
                bulletlist: entry_.bulletlist.map((bulletpoint_) => {
                  if (bulletpoint_.content !== bulletpointText) {
                    return bulletpoint_;
                  }

                  return {
                    checked: event.target.checked,
                    content: bulletpoint_.content,
                    similarity: bulletpoint_.similarity,
                  };
                }),
              };
            } else if (entry_.content.name !== entryName) {
              return entry_;
            }

            return {
              ...entry_,
              content: {
                ...entry_.content,
                bulletlist: entry_.content.bulletlist.map((bulletpoint_) => {
                  if (bulletpoint_.string !== bulletpointText) {
                    return bulletpoint_;
                  }

                  return {
                    checked: event.target.checked,
                    string: bulletpoint_.string,
                  };
                }),
              },
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
                <Form.Check.Input
                  type='checkbox'
                  checked={bulletpoint.checked}
                  onChange={(event) =>
                    handleCheckboxChange(event, bulletpoint.content)
                  }
                />
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
              <Form.Check.Input
                type='checkbox'
                checked={bulletpoint.checked}
                onChange={(event) =>
                  handleCheckboxChange(event, bulletpoint.string)
                }
              />
            </Col>
            <Col>{bulletpoint.string}</Col>
          </Row>
        </Form.Check>
      ))}
    </ReactSortable>
  );
};

export default EntryBulletlist;

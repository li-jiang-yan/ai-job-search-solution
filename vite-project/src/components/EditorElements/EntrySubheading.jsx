import Card from 'react-bootstrap/Card';

const EntrySubheading = ({ innerText }) => {
  return <Card.Subtitle className='mb-2 text-muted'>{innerText}</Card.Subtitle>;
};

export default EntrySubheading;

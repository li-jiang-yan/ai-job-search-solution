import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import ListItem from './StarterTemplate/ListItem';

const Main = () => {
  return (
    <main>
      <h1 className='text-body-emphasis'>
        Get started with Bootstrap
      </h1>
      <Col as='p' md={8} className='fs-5'>
        Quickly and easily get started with Bootstrap's compiled,
        production-ready files with this barebones example featuring some
        basic HTML and helpful links. Download all our examples to get
        started.
      </Col>
      <div className='mb-5'>
        <Button
          href='../examples'
          variant='primary'
          size='lg'
          className='px-4'
        >
          Download examples
        </Button>
      </div>
      <Col as='hr' xs={3} md={2} className='mb-5' />
      <Row className='g-5'>
        <Col md={6}>
          <h2 class='text-body-emphasis'>Starter projects</h2>
          <p>
            Ready to go beyond the starter template? Check out these open
            source projects that you can quickly duplicate to a new GitHub
            repository.
          </p>
          <ul className='list-unstyled ps-0'>
            <ListItem href='https://github.com/twbs/examples/tree/main/icons-font'>
              Bootstrap npm starter
            </ListItem>
            <ListItem href='https://github.com/twbs/examples/tree/main/parcel'>
              Bootstrap Parcel starter
            </ListItem>
            <ListItem href='https://github.com/twbs/examples/tree/main/vite'>
              Bootstrap Vite starter
            </ListItem>
            <ListItem href='https://github.com/twbs/examples/tree/main/webpack'>
              Bootstrap Webpack starter
            </ListItem>
          </ul>
        </Col>
        <Col md={6}>
          <h2 className='text-body-emphasis'>Guides</h2>
          <p>
            Read more detailed instructions and documentation on using or
            contributing to Bootstrap.
          </p>
          <ul className='list-unstyled ps-0'>
            <ListItem href='../getting-started/introduction'>
              Bootstrap quick start guide
            </ListItem>
            <ListItem href='../getting-started/webpack'>
              Bootstrap Webpack guide
            </ListItem>
            <ListItem href='../getting-started/parcel'>
              Bootstrap Parcel guide
            </ListItem>
            <ListItem href='../getting-started/vite'>
              Bootstrap Vite guide
            </ListItem>
            <ListItem href='../getting-started/contribute'>
              Contributing to Bootstrap
            </ListItem>
          </ul>
        </Col>
      </Row>
    </main>
  );
}

export default Main;

import Col from 'react-bootstrap/Col';
import ColorModeDropdown from './components/ColorModeDropdown';
import Footer from './components/Footer';
import Header from './components/Header';
import Main from './components/Main';

function App() {
  return (
    <>
      <ColorModeDropdown />
      <Col lg={8} className='mx-auto p-4 py-md-5'>
        <Header />
        <Main />
        <Footer />
      </Col>
    </>
  );
}

export default App;

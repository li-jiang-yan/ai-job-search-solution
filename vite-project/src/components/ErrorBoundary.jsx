import { Component } from 'react';
import Alert from 'react-bootstrap/Alert';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught frontend error:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <Alert variant='danger' role='alert'>
          <Alert.Heading>The page encountered an error</Alert.Heading>
          <p>{error.message || String(error)}</p>
          <details>
            <summary>Technical details</summary>
            <pre>{error.stack}</pre>
          </details>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

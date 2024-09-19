import  { Component, ReactNode, ErrorInfo } from 'react';
import style from './error.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleRetry = (): void => {
    // Reset the error boundary state and reload the page or attempt to recover
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally, reload the page:
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for the error
      return (
        <div className={style.errorBoundary}>
          <div className={style.errorContent}>
            <div className={style.errorTitle}>Oops! Something went wrong</div>
            <div className={style.errorDescription}>We're having some trouble.</div>
            {this.state.error && (
              <div className={style.errorMessage}>
                <strong>Error:</strong> {this.state.error.message}
              </div>
            )}
            <button className={style.retryButton} onClick={this.handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

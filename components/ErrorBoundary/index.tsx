import { Component } from 'react';
import Router from 'next/router';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          {`에러가 발생했어요 :(`}
          <button>페이지 다시 불러오기</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

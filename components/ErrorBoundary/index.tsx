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

  handleButtonClick = () => {
    Router.push('/list');
    Router.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-3xl mb-5">{`에러가 발생했어요 :(`}</p>
          <button
            className="py-2 px-6 bg-primary-dark text-white rounded-lg text-lg"
            onClick={this.handleButtonClick}
          >
            페이지 다시 불러오기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

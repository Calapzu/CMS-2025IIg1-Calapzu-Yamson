import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Error capturado en la UI:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">¡Algo salió mal!</h2>
          <p>Intenta salir y volver a entrar.</p>
          {this.props.children}
        </div>
      );
    }
    return this.props.children;
  }
}

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état afin de rendre l'interface de secours
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Tu peux également loguer l'erreur à un service de monitoring ici
    console.error("ErrorBoundary a attrapé une erreur :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Rends une interface de secours
      return <h2>Oups, quelque chose s'est mal passé.</h2>;
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;

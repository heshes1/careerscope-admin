import React from "react";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Unexpected application error",
    };
  }

  componentDidCatch(error) {
    console.error("Unhandled app error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
          <h1>App failed to load</h1>
          <p>{this.state.errorMessage}</p>
        </main>
      );
    }

    return this.props.children;
  }
}

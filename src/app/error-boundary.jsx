import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
          <section className="w-full max-w-lg text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
              Something went wrong
            </p>

            <h1 className="mt-4 font-heading text-4xl sm:text-5xl">
              We hit an unexpected problem.
            </h1>

            <p className="mt-4 leading-7 text-muted-foreground">
              Please try again. If the problem continues, refresh the page.
            </p>

            <button
              type="button"
              className="mt-7 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground"
              onClick={this.handleRetry}
            >
              Try again
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

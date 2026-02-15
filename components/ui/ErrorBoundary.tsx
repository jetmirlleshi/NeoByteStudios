'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-text-secondary text-sm">Something went wrong loading this section.</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-bg-card border border-border-custom text-text-primary hover:bg-bg-secondary transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

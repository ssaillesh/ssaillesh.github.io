import { Component } from 'react'

// Catches anything the 3D scene throws (failed chunk load, WebGL context
// creation errors, shader failures) and hands control back to the app.
export default class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('[residence] 3D scene failed, switching to plan view:', error)
    this.props.onFail?.(error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

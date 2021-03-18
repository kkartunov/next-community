/**
 * Renders the passed markdown into native React components.
 * Supports inlining a subset of JSX Components which can be found in
 * utils/markdown.js
 *
 * Support for additional components can be added to the above file.
 */
import PT from 'prop-types';
import React from 'react';

import md from 'utils/markdown';

class MarkdownRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: null,
    };
  }

  componentDidMount() {
    const { markdown } = this.props;
    this.renderElements(markdown);
  }

  componentDidUpudate(prevProps) {
    const { markdown } = this.props;
    if (markdown !== prevProps.markdown) {
      this.renderElements(markdown);
    }
  }

  renderElements(markdown) {
    if (markdown) {
      this.setState({
        elements: md(markdown),
      });
    }
  }

  render() {
    const { elements } = this.state;

    return (
      // Fragment prevents the Component from rendering an unnecessary div.
      // This is important if the component is rendering within a flexbox
      // for example.
      <>
        {elements}
      </>
    );
  }
}

MarkdownRenderer.defaultProps = {
  markdown: '',
};

MarkdownRenderer.propTypes = {
  markdown: PT.string,
};

export default MarkdownRenderer;

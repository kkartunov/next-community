/**
 * This generic component will implement the semi-transparent background
 * and the white window in the center, which wraps the content provided as
 * children.
 *
 * When semi-transparent background is clicked, it should trigger the onCancel()
 * callback passed from the parent.
 */

/* global document */

import { noop } from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/helpers';

import defaultStyle from './default.module.scss';

/* NOTE: Modal component is implemented as class, as it demands advanced
 * interaction with DOM upon mount and unmount. */
class BaseModal extends React.Component {
  constructor(props) {
    super(props);
    this.portal = document.createElement('div');
  }

  componentDidMount() {
    document.body.classList.add('scrolling-disabled-by-modal');
    document.body.appendChild(this.portal);
  }

  componentWillUnmount() {
    document.body.classList.remove('scrolling-disabled-by-modal');
    document.body.removeChild(this.portal);
  }

  render() {
    const {
      children,
      onCancel,
      theme,
      extraStylesForContainer,
    } = this.props;
    return ReactDom.createPortal(
      (
        <React.Fragment>
          <div
            className={theme.container}
            onWheel={event => event.stopPropagation()}
            style={fixStyle(extraStylesForContainer)}
          >
            {children}
          </div>
          <button
            onClick={() => onCancel()}
            className={theme.overlay}
            type="button"
          />
        </React.Fragment>
      ),
      this.portal,
    );
  }
}

BaseModal.defaultProps = {
  onCancel: noop,
  children: null,
  theme: {},
  extraStylesForContainer: null
};

BaseModal.propTypes = {
  onCancel: PT.func,
  children: PT.node,
  theme: PT.shape(),
  extraStylesForContainer: PT.shape(),
};

/* Non-themed version of the Modal. */
export { BaseModal };

export default themr('Modal', defaultStyle)(BaseModal);
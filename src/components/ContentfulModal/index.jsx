/**
 * Renders a Modal with data from Contentful
 */
import React, { useState } from 'react';
import PT from 'prop-types';
import fetch from 'unfetch';
import LoadingIndicator from 'components/LoadingIndicator';
// // import Banner from 'components/Contentful/Banner';
// import ContentBlock from 'components/Contentful/ContentBlock';
// import Viewport from 'components/Contentful/Viewport';
import Modal from 'components/Modal';
import { themr } from 'react-css-super-themr';
import classnames from 'classnames';
import { fixStyle } from 'utils/helpers';
import Button from 'components/Button';
import ContentBlock from 'components/ContentBlock';
import useSWR from 'swr'
import defaultModalTheme from './modal-styles.module.scss';
import defaultStyle from './style.module.scss';
import tc from 'components/buttons/themed/tc.module.scss';

const fetcher = async url => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

function ModalLoader(props) {
  const { data, error } = useSWR(`/api/contentful/${props.id}`, fetcher, { errorRetryCount: 1 })
  const modalInner = (content) => {
    switch(content.sys.contentType.sys.id) {
      case 'contentBlock': return <ContentBlock contentBlock={content} />;
      default: return null;
    }
  }
  console.log('ModalLoader', props, data, error);
  if (!data && !error) return <LoadingIndicator />;
  if (error) return <div>{`${error.status} | ${error.message}`}</div>;
  return modalInner(data.fields.content);
}

function ContentfulModal(props) {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const hideDismissIcon = false;
  const hideCloseButton = false;
  const extraStylesForContainer = null;
  return (
    <React.Fragment>
      {React.Children.map(props.children, child => React.cloneElement(child, {
        onClick: (e) => {
          e.preventDefault();
          if (child.props.onClick) {
            child.props.onClick(e);
          }
          setIsOpen(true);
        },
        className: classnames(props.theme.modalTrigger, child.props.className),
      }))}
      {isOpen && (
        <Modal
          onCancel={() => setIsOpen(false)}
          theme={defaultModalTheme}
        >
          {
            !hideDismissIcon && (
              <div
                className={props.theme.dismissButton}
                onClick={() => setIsOpen(false)}
                onKeyPress={() => setIsOpen(false)}
                role="button"
                tabIndex={0}
              >
                &times;
              </div>
            )
          }
          <ModalLoader { ...props } />
          {
            !hideCloseButton && (
              <div className={props.theme.closeButton} style={fixStyle(extraStylesForContainer)}>
                <Button
                theme={{
                  button: tc['primary-green-md'],
                  disabled: tc.themedButtonDisabled,
                }}
                onClick={() => setIsOpen(false)}
                onKeyPress={() => setIsOpen(false)}
              >
                CLOSE
              </Button>
              </div>
            )
          }
        </Modal>
      )}
    </React.Fragment>
  );
}

ContentfulModal.defaultProps = {
  isOpen: false,
  theme: {},
};

ContentfulModal.propTypes = {
  id: PT.string.isRequired,
  isOpen: PT.bool,
  children: PT.node.isRequired,
  theme: PT.shape({
    modalTrigger: PT.string,
    dismissButton: PT.any,
    closeButton: PT.any,
  })
};

/* Non-themed version of the Modal. */
export { ContentfulModal }
export default themr('ContentfulModal', defaultStyle)(ContentfulModal);

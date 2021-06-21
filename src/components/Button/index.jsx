/**
 * The Button component provide a standard button / button-like link:
 * - When disabled, it renders as <div>;
 * - When no "to" prop is passed in, it renders as <button>;
 * - Otherwise, it renders as <Link>.
 */

import PT from 'prop-types';
import React from 'react';

import Link from 'components/Link';

import defaultTheme from './style.module.scss';

export default function Button({
  active,
  children,
  disabled,
  enforceA,
  onClick,
  onMouseDown,
  openNewTab,
  replace,
  size,
  theme,
  to,
  type,
  style,
}) {
  let className = theme.button;
  if (theme[size]) className += ` ${theme[size]}`;
  if (active && theme.active) className += ` ${theme.active}`;
  if (disabled) {
    if (theme.disabled) className += ` ${theme.disabled}`;
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  if (to) {
    if (theme.link) className += ` ${theme.link}`;
    return (
      /* NOTE: This ESLint rule enforces us to use <a> and <button> properly
       * in the situations where they are supposed to be used; it is correct
       * from the document structure point of view, but it is not convenient
       * from the developer point of view! The reason is that during active
       * development / prototyping it is often necessary to replace a button
       * by a link, and vice-versa, thus having a component that hides the
       * visual and logic differences between button and links saves tons of
       * developer time. Thus, we sacrifice this rule here in exchange for
       * convenience and efficiency of development. */
      <Link
        className={className}
        enforceA={enforceA}
        onClick={onClick}
        onMouseDown={onMouseDown}
        openNewTab={openNewTab === 'true'}
        replace={replace}
        to={to}
        style={style}
      >
        {children}
      </Link>
    );
  }
  if (theme.regular) className += ` ${theme.regular}`;
  return (
    /* The rule is temporary disabled, as its current implementation bans
     * dynamic button types with no valid reason:
     * https://github.com/yannickcr/eslint-plugin-react/issues/1555 */
    /* eslint-disable react/button-has-type */
    <button
      className={className}
      onClick={onClick}
      onMouseDown={onMouseDown}
      type={type}
      style={style}
    >
      {children}
    </button>
    /* eslint-enable react/button-has-type */
  );
}

Button.defaultProps = {
  active: false,
  children: null,
  disabled: false,
  enforceA: false,
  onClick: null,
  onMouseDown: null,
  openNewTab: null,
  replace: false,
  size: null,
  theme: defaultTheme,
  to: null,
  type: 'button',
  style: {},
};

Button.propTypes = {
  active: PT.bool,
  children: PT.node,
  disabled: PT.bool,
  enforceA: PT.bool,
  onClick: PT.func,
  onMouseDown: PT.func,
  openNewTab: PT.string,
  replace: PT.bool,
  size: PT.string,
  theme: PT.shape({
    button: PT.string.isRequired,
    disabled: PT.string,
    link: PT.string,
    regular: PT.string,
  }),
  to: PT.oneOfType([PT.object, PT.string]),
  type: PT.oneOf(['button', 'reset', 'submit']),
  style: PT.shape(),
};

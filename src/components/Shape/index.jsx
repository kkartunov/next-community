/**
 * The core shape rendering.
 */

import PT from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/helpers'
import SVG from 'react-inlinesvg';

import LoadingIndicator from 'components/LoadingIndicator';
import defaultTheme from './themes/default.module.scss';

export function ShapeInner({
  shape,
}) {
  const {
    height,
    backgroundColor,
    inline,
    shapeSvg,
  } = shape.fields;

  const shapeSvgUrl = get(shapeSvg, 'fields.file.url');
  const style = fixStyle(shape.fields.extraStylesForContainer) || {};
  if (!shapeSvgUrl) {
    return (
      <div
        id={shape.sys.id}
        className={defaultTheme['shape-wrap']}
        style={style}
      />
    );
  }
  if (!inline) {
    style.backgroundImage = `url(${shapeSvgUrl})`;
  }
  if (height) {
    style.height = height;
  }
  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }
  return (
    <div
      id={shape.sys.id}
      className={defaultTheme['shape-wrap']}
      style={style}
    >
      {inline && (
        <SVG
          preloader={<LoadingIndicator />}
          src={shapeSvgUrl}
        />
      )}
    </div>
  );
}

ShapeInner.propTypes = {
  shape: PT.shape().isRequired,
};

export default themr('Shape', defaultTheme)(ShapeInner);

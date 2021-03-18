/**
 * The core image rendering.
 */

/* global document */

import PT from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/helpers'
import SVG from 'react-inlinesvg';

// AOS
import AOS from 'aos';

import LoadingIndicator from 'components/LoadingIndicator';
import defaultTheme from './themes/default.module.scss';

export class ImageInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onLoadSvg = this.onLoadSvg.bind(this);
  }

  componentDidMount() {
    const {
      image,
    } = this.props;
    // Animations only on client side
    const animateOnScroll = get(image, 'fields.animationOnScroll.fields')
    if (animateOnScroll && typeof window !== 'undefined') {
      AOS.init();
    }
  }

  componentDidUpdate() {
    const {
      image,
    } = this.props;
    const clipSvgUrl = get(image, 'fields.clipSvg.file.url');
    if (clipSvgUrl) {
      this.onLoadSvg();
    }
  }

  /**
   * event call after load svg success
   */
  onLoadSvg() {
    const {
      image,
    } = this.props;
    const imgTag = document.querySelector(`#image-${image.sys.id} img`);
    const svgClip = document.querySelector(`#image-${image.sys.id} svg clipPath`);
    if (svgClip && imgTag) {
      svgClip.id = `svg-id-${image.sys.id}`;
      imgTag.style['clip-path'] = `url(#${svgClip.id})`;
      imgTag.style['-webkit-clip-path'] = `url(#${svgClip.id})`;
      imgTag.style.display = 'block';
    }
  }

  render() {
    const {
      image,
    } = this.props;

    const imageUrl = get(image, 'fields.source.fields.file.url');
    const clipSvgUrl = get(image, 'fields.clipSvg.fields.file.url');
    const imgStyle = image.fields.extraStylesForImage ? fixStyle(image.fields.extraStylesForImage) : {};
    if (clipSvgUrl) {
      imgStyle.display = 'none';
    }

    return (
      <div
        id={`image-${image.sys.id}`}
        className={defaultTheme['img-wrap']}
        style={fixStyle(image.fields.extraStylesForContainer)}
      >
        {clipSvgUrl && (
          <SVG
            preloader={<LoadingIndicator />}
            src={clipSvgUrl}
            wrapper={React.createFactory('svg')}
            onLoad={this.onLoadSvg}
          />
        )}
        {
          image.fields.animateOnScroll ? (
            <img
              src={imageUrl}
              alt={image.alt || image.name}
              style={imgStyle}
              data-aos={image.fields.animateOnScroll}
              data-aos-once={image.fields.animateOnScrollOnce}
              data-aos-delay={image.fields.animateOnScrollDelay}
              data-aos-duration={image.fields.animateOnScrollDuration}
              data-aos-easing={image.fields.animateOnScrollEasing}
              data-aos-mirror={image.fields.animateOnScrollMirror}
              data-aos-anchor-placement={image.fields.animateOnScrollAnchor}
              data-aos-offset={image.fields.animateOnScrollOffset}
            />
          ) : (
            <img
              src={imageUrl}
              alt={image.alt || image.name}
              style={imgStyle}
            />
          )
        }
      </div>
    );
  }
}

ImageInner.propTypes = {
  image: PT.shape().isRequired
};

export default themr('Image', defaultTheme)(ImageInner);

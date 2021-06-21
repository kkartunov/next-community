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
import Image from 'next/image';

// AOS
import AOS from 'aos';

import LoadingIndicator from 'components/LoadingIndicator';
import defaultTheme from './themes/default.module.scss';

const myLoader = ({ src }) => {
  return src.indexOf('http') === 0 ? src : `https:${src}`;
}

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
    const imageDetails = get(image, 'fields.source.fields.file.details.image');
    const clipSvgUrl = get(image, 'fields.clipSvg.fields.file.url');
    const imgStyle = image.fields.extraStylesForImage ? fixStyle(image.fields.extraStylesForImage) : {};
    if (clipSvgUrl) {
      imgStyle.display = 'none';
    }
    const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient id="g">
      <stop stop-color="#e9e9e9" offset="20%" />
      <stop stop-color="#f9f9f9" offset="50%" />
      <stop stop-color="#e9e9e9" offset="70%" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#e9e9e9" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

    const toBase64 = (str) =>
      typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str)

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
            <Image
              src={`https:${imageUrl}`}
              alt={image.fields.alt || image.fields.name}
              style={imgStyle}
              data-aos={image.fields.animateOnScroll}
              data-aos-once={image.fields.animateOnScrollOnce}
              data-aos-delay={image.fields.animateOnScrollDelay}
              data-aos-duration={image.fields.animateOnScrollDuration}
              data-aos-easing={image.fields.animateOnScrollEasing}
              data-aos-mirror={image.fields.animateOnScrollMirror}
              data-aos-anchor-placement={image.fields.animateOnScrollAnchor}
              data-aos-offset={image.fields.animateOnScrollOffset}
              loader={myLoader}
              width={imageDetails.width}
              height={imageDetails.height}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(imageDetails.width, imageDetails.height))}`}
            />
          ) : (
            <Image
              src={`https:${imageUrl}`}
              alt={image.fields.alt || image.fields.name}
              style={imgStyle}
              loader={myLoader}
              width={imageDetails.width}
              height={imageDetails.height}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(imageDetails.width, imageDetails.height))}`}
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

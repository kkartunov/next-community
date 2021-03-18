/**
 * The core content block rendering.
 */

import PT from 'prop-types';
import React from 'react';
import { get } from 'lodash'

import MarkdownRenderer from 'components/MarkdownRenderer';
import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/helpers'

// AOS
import AOS from 'aos';
import defaultTheme from './themes/default.module.scss';
import veteranTheme from './themes/default_veteran.module.scss';
import rowItemTheme from './themes/row_item.module.scss';
import cardTheme from './themes/card.module.scss';
import TCO19Theme from './themes/TCO19.module.scss';
import zurichTheme from './themes/zurich.module.scss';
import generalTheme from './themes/general.module.scss';
import blobCard from './themes/blobCard.module.scss';
import TCO20Theme from './themes/TCO20.module.scss';
import largeCard from './themes/largeCard.module.scss';

const THEMES = {
  Default: defaultTheme,
  Veteran: veteranTheme,
  'Row Item': rowItemTheme,
  Card: cardTheme,
  TCO19: TCO19Theme,
  Zurich: zurichTheme,
  General: generalTheme,
  'Blob Card': blobCard,
  TCO20: TCO20Theme,
  'Large Card': largeCard,
};

function ContentBlock({
  contentBlock,
}) {
  const animateOnScroll = get(contentBlock, 'fields.animationOnScroll.fields')
  const theme = THEMES[contentBlock.fields.baseTheme || 'Default'];
  const innerContent = (
    <div
      className={theme.contentWrapper}
      style={fixStyle(contentBlock.fields.extraStylesForContentWrapper)}
    >
      {/* {
        background ? (
          <div className={theme.image}>
            <img alt={contentBlock.alt || contentBlock.name} src={background.file.url} />
          </div>
        ) : null
      } */}
      <div
        className={theme.content}
        style={fixStyle(contentBlock.fields.extraStylesForContent)}
      >
        <MarkdownRenderer markdown={contentBlock.fields.text} />
      </div>
    </div>
  );
  if (animateOnScroll) {
    // Animations only on client side
    if (typeof window !== 'undefined') {
      AOS.init();
    }
    return (
      <div
        id={contentBlock.sys.id}
        className={theme.container}
        style={fixStyle(contentBlock.fields.extraStylesForContainer)}
        data-aos={animateOnScroll.animateOnScroll}
        data-aos-once={animateOnScroll.animateOnScrollOnce}
        data-aos-delay={animateOnScroll.animateOnScrollDelay}
        data-aos-duration={animateOnScroll.animateOnScrollDuration}
        data-aos-easing={animateOnScroll.animateOnScrollEasing}
        data-aos-mirror={animateOnScroll.animateOnScrollMirror}
        data-aos-anchor-placement={animateOnScroll.animateOnScrollAnchor}
        data-aos-offset={animateOnScroll.animateOnScrollOffset}
      >
        {innerContent}
      </div>
    );
  }
  return (
    <div
      id={contentBlock.sys.id}
      className={theme.container}
      style={fixStyle(contentBlock.fields.extraStylesForContainer)}
    >
      {innerContent}
    </div>
  );
}

ContentBlock.propTypes = {
  contentBlock: PT.shape().isRequired,
};

export default themr('ContentBlock', defaultTheme)(ContentBlock);

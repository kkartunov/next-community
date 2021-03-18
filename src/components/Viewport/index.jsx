/**
 * Themed Viewport Component
 */
import { get, map, defaults } from 'lodash'
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import logger from 'services/logger'
import AOS from 'aos';
import { fixStyle } from 'utils/helpers'
import ContentBlock from 'components/ContentBlock'
import Shape from 'components/Shape'
import Image from 'components/Image'
import Tabs from 'components/Tabs'

import column from './themes/column.module.scss'
import row from './themes/row.module.scss'
import grid from './themes/grid.module.scss'
import zurich from './themes/zurich.module.scss'

// Viewport themes
const THEMES = {
  Column: column,
  'Row with Max-Width': row,
  Grid: grid,
  Zurich: zurich,
};

const ViewportContent = (content) => {
  return map(content, (item) => {
    switch (item.sys.contentType.sys.id) {
      case 'viewport': return <Viewport viewport={item} key={item.sys.id} />;
      case 'contentBlock': return <ContentBlock contentBlock={item} key={item.sys.id} />;
      case 'shape': return <Shape shape={item} key={item.sys.id} />
      case 'image': return <Image image={item} key={item.sys.id} />
      case 'tabs': return <Tabs tabs={item} key={item.sys.id} />
    }
  })
}

/* Viewport */
const Viewport = ({
  viewport,
}) => {
  const animateOnScroll = get(viewport, 'fields.animationOnScroll.fields')
  const theme = THEMES[viewport.fields.theme || 'Column'];
  let extraStylesForContainer = get(viewport, 'fields.extraStylesForContainer')
  logger.log('Viewport props', viewport, animateOnScroll)
  // Set grid columns based on items
  if (viewport.fields.theme === 'Grid') {
    extraStylesForContainer = defaults(extraStylesForContainer || {}, {
      'grid-template-columns': `repeat(${viewport.fields.gridColumns || 3}, 1fr)`,
      'grid-gap': `${viewport.fields.gridGap || 10}px`,
    });
  }
  // Animated on scroll viewport?
  if (animateOnScroll) {
    // Animations only on client side
    if (typeof window !== 'undefined') {
      AOS.init();
    }
    return (
      <div
        id={viewport.sys.id}
        className={theme.container}
        style={extraStylesForContainer}
        role="main"
        data-aos={animateOnScroll.animateOnScroll}
        data-aos-once={animateOnScroll.animateOnScrollOnce}
        data-aos-delay={animateOnScroll.animateOnScrollDelay}
        data-aos-duration={animateOnScroll.animateOnScrollDuration}
        data-aos-easing={animateOnScroll.animateOnScrollEasing}
        data-aos-mirror={animateOnScroll.animateOnScrollMirror}
        data-aos-anchor-placement={animateOnScroll.animateOnScrollAnchor}
        data-aos-offset={animateOnScroll.animateOnScrollOffset}
      >
        { ViewportContent(viewport.fields.content) }
      </div>
    );
  }
  return (
    <div id={viewport.sys.id} className={theme.container} style={fixStyle(extraStylesForContainer)} role="main">
      { ViewportContent(viewport.fields.content) }
    </div>
  );
};

Viewport.propTypes = {
  viewport: PT.shape().isRequired
};

export default themr('Viewport')(Viewport);

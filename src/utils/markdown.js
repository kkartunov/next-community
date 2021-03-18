/**
 * Renders markdown into native React components.
 * In most cases the <MarkdownRenderer> component should be utilized instead of
 * using this directly.
 *
 * Additional custom components can be added to the customComponents array found below.
 */

import _ from 'lodash';
import React from 'react';
import MarkdownIt from 'markdown-it';
import Link from 'components/Link';
import Button from 'components/Button'
import hljs from 'highlight.js';
import ReactHtmlParser from 'react-html-parser';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import 'highlight.js/styles/github.css';

import AnchorLink from 'react-anchor-link-smooth-scroll';

import tc from 'components/buttons/themed/tc.module.scss';

import Highlighter from './highlighter';

/** Themes for buttons
 * those overwrite PrimaryButton style to match achieve various styles.
 * Should implement pattern of classes.
 */
const buttonThemes = {
  tc,
};

/**
 * Add new Custom Components here.
 *
 * When a tag is encountered, this object is checked to see if it contains a field
 * with the name of the tag ( case sensitive ).
 * If it exists, the corresponding function will be called with the tag attributes.
 *
 * The function should return an objecting containing:
 *    type: The React Component
 *    props: The props to use when creating the component.
 *    These can simply be the passed attributes, or props derived from them
 *    in some way. Ex. Creating an array from a comma delimited string.
 */
const customComponents = {
  Link: attrs => ({ type: Link, props: attrs }),
  AnchorLink: attrs => ({ type: AnchorLink, props: attrs }),
  ThemedButton: (attrs) => {
    const t = attrs.theme.split('-');
    return {
      type: Button,
      props: {
        ...attrs,
        theme: {
          button: buttonThemes[t[0]][`${t[1]}-${t[2]}-${t[3]}`],
          disabled: buttonThemes[t[0]].themedButtonDisabled,
        },
      },
    };
  },
};

/**
 * The following functions are only used internally and should not need to be
 * changed for new components.
 */

function normalizeProps(props) {
  if (!props.style) return props;
  const res = _.clone(props);
  res.style = {};
  props.style.split(';').forEach((style) => {
    const [name, value] = style.split(':');
    res.style[_.camelCase(name)] = value;
  });
  return res;
}

/**
 * Maps token into properties for corresponding ReactJS component.
 * @param {Object} token
 * @param {Number} key
 * @return {Object}
 */
function getProps(token, key) {
  const res = { key };
  if (token.attrs) {
    token.attrs.forEach(([attr, value]) => {
      res[attr] = value;
    });
  }
  return normalizeProps(res);
}

/**
 * Renders tokens with zero nesting.
 * @param {Object} tokens
 * @param {Number} index
 * @return {Object}
 */
function renderToken(tokens, index, md) {
  const token = tokens[index];
  switch (token.type) {
    case 'image': {
      const props = getProps(token, index);
      props.alt = _.get(token, 'children[0].content', '');
      return React.createElement('img', props);
    }
    case 'inline':
      /* eslint-disable no-use-before-define */
      return renderTokens(token.children, 0, md);
      /* eslint-enable no-use-before-define */
    case 'text':
      return token.content;
    case 'fence':
      return Highlighter({
        codeString: token.content,
        language: token.info,
        showLineNumbers: true,
        key: index,
      });
    case 'code_inline':
      if (token.info && hljs.getLanguage(token.info)) {
        try {
          return ReactHtmlParser(`<code>${hljs.highlight(token.info, token.content, true).value}</code>`);
        } catch (__) { return _.noop(); }
      } else {
        try {
          return ReactHtmlParser(`<code>${hljs.highlightAuto(token.content).value}</code>`);
        } catch (__) { return _.noop(); }
      }
    default:
      return React.createElement(
        token.tag,
        getProps(token, index),
        token.content || undefined,
      );
  }
}

/**
 * Iterates through the non-nested children of an 'inline' node and calls
 * the traverse rendering function on each of them when necessary.
 * @param {Array} tokens The list of tokens
 * @param {Number} startFrom Starting index for the rendering pass.
 * @return {Array} The rendered React elements
 */
// Array destructuring is not appropriate for this use case
/* eslint-disable prefer-destructuring */
function renderTokens(tokens, startFrom, md) {
  let level = 0;
  const output = [];
  for (let pos = startFrom; pos < tokens.length; pos += 1) {
    const token = tokens[pos];
    const content = token.content;
    const html = token.type === 'html_inline';
    if (token.nesting === -1 || (html && content.startsWith('</'))) {
      level -= 1;
    } else if (level === 0) {
      if (token.nesting === 1) {
        output.push(React.createElement(
          token.tag,
          getProps(token, pos),
          renderTokens(tokens, 1 + pos, md),
        ));
        level += 1;
      } else if (token.type === 'html_inline') {
        if (!token.content.startsWith('</')) {
          const match = token.content.match(/^<(\w+) *(.*?)(\/)?>/);
          let tag = match[1];
          const attrs = match[2] ? match[2].match(/\w+(=".*?"| ?)/g) : [];
          let props = _.fromPairs(attrs.map((attr) => {
            const pair = attr.match(/^(\w+)="(.*)"/);
            return pair ? pair.slice(1) : [attr, true];
          }));
          const selfClosing = match[3] || tag === 'img' || tag === 'hr' || tag === 'br';
          if (customComponents[tag]) {
            ({ type: tag, props } = customComponents[tag]({ ...props, ...md.props }));
          }
          props = normalizeProps(props);
          if (selfClosing) {
            output.push(React.createElement(tag, { key: pos, ...props }));
          } else {
            level += 1;
            output.push(React.createElement(
              tag,
              { key: pos, ...props },
              renderTokens(tokens, pos + 1, md),
            ));
          }
        }
      } else output.push(renderToken(tokens, pos, md));
    } else if (token.nesting === 1) {
      level += 1;
    } else if (html) {
      if (!content.startsWith('</') && !content.endsWith('/>')) {
        level += 1;
      }
    }
    if (level < 0) break;
  }
  return output;
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
// Disable html_block detection to force all html tags to be evaluated inline,
// this is required to parse each tag individually
md.block.ruler.disable('html_block');

// plugins
md
  .use(sub)
  .use(sup);

// Assign the custom renderer
md.renderer.render = tokens => renderTokens(tokens, 0, md);

export default function render(text, props) {
  md.props = props;
  return md.render(text);
}
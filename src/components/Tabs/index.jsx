/**
 * Renders Tabs
 */
import { map } from 'lodash';
import MarkdownRenderer from 'components/MarkdownRenderer';
import ContentBlock from 'components/ContentBlock'
import Viewport from 'components/Viewport'
import PT from 'prop-types';
import React, { Component } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from 'react-tabs';
import { fixStyle } from 'utils/helpers';
import defaultTheme from './themes/style.module.scss';
import zurichTheme from './themes/zurich.module.scss';
import tabsGroup from './themes/tabsGroup.module.scss';
import tabsGroupChildren from './themes/tabsGroupChildren.module.scss';
import underlineTheme from './themes/underline.module.scss';
import underlineDarkTheme from './themes/underline-dark.module.scss';
import verticalTheme from './themes/vertical.module.scss';
import pillsTheme from './themes/pills.module.scss';

export const TAB_THEMES = {
  Default: defaultTheme,
  Zurich: zurichTheme,
  'Tabs Group': tabsGroup,
  'Tabs Group Children': tabsGroupChildren,
  Underline: underlineTheme,
  'Underline dark': underlineDarkTheme,
  Vertical: verticalTheme,
  Pills: pillsTheme,
};

export default class ContentfulTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };

    this.updatePageUrl.bind(this);
  }

  componentDidUpdate() {
    this.updatePageUrl();
  }

  updatePageUrl() {
    // const q = getQuery();
    // const { tabId } = this.props;
    // const { tabIndex } = this.state;
    // updateQuery({
    //   tabs: {
    //     ...q.tabs,
    //     [tabId]: tabIndex || 0,
    //   },
    // });
  }

  render() {
    const {
      tabs,
    } = this.props;
    const { tabIndex } = this.state;
    const theme = TAB_THEMES[tabs.fields.theme || 'Default'];

    return (
      <Tabs
        className={theme.container}
        selectedIndex={tabIndex}
        selectedTabClassName={theme.selected}
        onSelect={tIndx => this.setState({ tabIndex: tIndx })}
        forceRenderTabPanel
      >
        <div className={theme.tabListWrap}>
          <TabList className={theme.tablist}>
            {
              map(tabs.fields.tabsList, tabItem => (
                <Tab
                  className={theme.tab}
                  style={fixStyle(tabItem.fields.extraStyles)}
                  key={tabItem.sys.id}
                >
                  <MarkdownRenderer markdown={tabItem.fields.tab} />
                </Tab>
              ))
            }
          </TabList>
        </div>
        {
          map(tabs.fields.tabsList, tabItem => (
            <TabPanel
              className={theme.tabpannel}
              key={tabItem.sys.id}
              selectedClassName={theme.selectedTabPanel}
            >
              {
                tabItem.fields.panelDescription ? (
                  <div className={theme.panelDescription}>
                    <MarkdownRenderer markdown={tabItem.fields.panelDescription} />
                  </div>
                ) : null
              }
              {
                map(tabItem.fields.panel, panelItem => {
                  const entryType = panelItem.sys.contentType.sys.id;
                  switch (entryType) {
                    case 'contentBlock': return <ContentBlock contentBlock={panelItem} key={panelItem.sys.id} />
                    case 'tabs': return <ContentfulTabs tabs={panelItem} key={panelItem.sys.id} />
                    case 'viewport': return <Viewport viewport={panelItem} key={panelItem.sys.id} />
                    default: return null;
                  }
                })
              }
            </TabPanel>
          ))
        }
      </Tabs>
    );
  }
}

ContentfulTabs.propTypes = {
  tabs: PT.shape().isRequired,
};

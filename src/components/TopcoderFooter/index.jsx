/**
 * The Topcoder Footer component
 * 
 * TODO: add support for logged-in users and content based on it
 */

// import cookies from 'browser-cookies';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import Image from 'next/image';

import defaultTheme from './style.module.scss';

// mapping config from env vars
const config = {
  URL: {
    BASE: process.env.NEXT_PUBLIC_URL_BASE,
    FORUMS_VANILLA: process.env.NEXT_PUBLIC_FORUMS_VANILLA
  }
}

// generic link wrapper
function Link({
  children,
  to,
}) {
  return (
    <li className={defaultTheme.link}>
      <a href={to}>
        {children}
      </a>
    </li>
  );
}

Link.propTypes = {
  to: PT.string.isRequired,
  children: PT.node.isRequired,
};

/**
 * The Topcoder Footer component
 * @returns function
 */
export default function TopcoderFooter() {
  const base = config.URL.BASE;
  // const authUrl = config.URL.AUTH;
  // const retUrl = isomorphy.isClientSide() ? encodeURIComponent(window.location.href) : '';
  // const loggedIn = false
  const currentYear = moment().year();
  return (
    <div className={defaultTheme.footer} role="contentinfo">
      <div className={defaultTheme['footer-wrap']}>
        <div className={defaultTheme['logo-wrap']}>
          <Image src="/icons/TC-logo-inverted.svg" height={30} width={79} alt="Topcoder inverted logo" />
        </div>
        <div className={defaultTheme['navi-links']}>
          <div className={defaultTheme['navi-col']}>
            <h4 className={defaultTheme['navi-col-title']}>COMPETE</h4>
            <div className={defaultTheme['sep-line']} />
            <ul className={defaultTheme['navi-col-links']}>
              <Link to={`${base}/challenges`}>All Challenges</Link>
              <Link to={`${base}/community/arena`}>Competitive Programming</Link>
              <Link to={`${base}/gigs`}>Gig Work</Link>
              <Link to={`${base}/community/practice`}>Practice</Link>
            </ul>
          </div>
          <div className={defaultTheme['navi-col']}>
            <h4 className={defaultTheme['navi-col-title']}>TRACKS</h4>
            <div className={defaultTheme['sep-line']} />
            <ul className={defaultTheme['navi-col-links']}>
              <Link to={`${base}/thrive/tracks?track=Competitive%20Programming`}>Competitive Programming</Link>
              <Link to={`${base}/thrive/tracks?track=Data%20Science&tax=`}>Data Science</Link>
              <Link to={`${base}/thrive/tracks?track=Design&tax=`}>Design</Link>
              <Link to={`${base}/thrive/tracks?track=Development&tax=`}>Development</Link>
              <Link to={`${base}/thrive/tracks?track=QA&tax=`}>QA</Link>
            </ul>
          </div>
          <div className={defaultTheme['navi-col']}>
            <h4 className={defaultTheme['navi-col-title']}>COMMUNITY</h4>
            <div className={defaultTheme['sep-line']} />
            <ul className={defaultTheme['navi-col-links']}>
              <Link to={`${base}/blog`}>Blog</Link>
              <Link to={`${base}/community/pipeline`}>Challenge Pipeline</Link>
              <Link to={`${base}/community/events`}>Events Calendar</Link>
              <Link to={`${config.URL.FORUMS_VANILLA}`}>Forums</Link>
              <Link to={`${base}/community/member-programs`}>Programs</Link>
              <Link to={`${base}/community/statistics`}>Statistics</Link>
              <Link to={`${base}/community/member-programs/topcoder-open`}>TCO</Link>
              <Link to={`${base}/thrive`}>Thrive</Link>
            </ul>
          </div>
          <div className={defaultTheme['navi-col']}>
            <h4 className={defaultTheme['navi-col-title']}>HELP CENTER</h4>
            <div className={defaultTheme['sep-line']} />
            <ul className={defaultTheme['navi-col-links']}>
              <Link to={`${base}/thrive/tracks?track=Topcoder&tax=Getting%20Paid`}>Getting Paid</Link>
              <Link to={`${base}/thrive/tracks?track=Topcoder&tax=FAQ`}>FAQ</Link>
              <Link to={`${base}/thrive/tracks?track=Topcoder`}>General Info</Link>
              <Link to="mailto:support@topcoder.com">Website Help</Link>
            </ul>
          </div>
          <div className={defaultTheme['navi-col']}>
            <h4 className={defaultTheme['navi-col-title']}>ABOUT</h4>
            <div className={defaultTheme['sep-line']} />
            <ul className={defaultTheme['navi-col-links']}>
              <Link to={`${base}/community/admins`}>Admins</Link>
              <Link to={`${base}/community/contact`}>Contact Us</Link>
              {/* {!loggedIn
                && <Link to={`${authUrl}?utm_source=community&utm_campaign=tc-footer&utm_medium=promotion&retUrl=${retUrl}`}>Join Community</Link>
              } */}
              <Link to={`${base}/community/learn`}>About Community</Link>
              <Link to={`${base}/community/changelog`}>Changelog</Link>
              <Link to={`${base}/contact-us/`}>Talk to Sales</Link>
            </ul>
          </div>
          <div className={defaultTheme['navi-col']}>
            <h4 className={defaultTheme['navi-col-title']}>FOLLOW US</h4>
            <div className={defaultTheme['sep-line']} />
            <div className={defaultTheme['social-icons']}>
            <a href="https://www.facebook.com/topcoder/" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-fb.svg" height={24} width={24} alt="Facebook icon" /></a>
            <a href="https://www.youtube.com/c/TopcoderOfficial" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-youtube.svg" height={24} width={24} alt="Youtube icon" /></a>
            <a href="https://www.linkedin.com/company/topcoder" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-linkedln.svg" height={24} width={24} alt="Linkedin icon" /></a>
            <a href="https://twitter.com/topcoder" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-twitter.svg" height={24} width={24} alt="Twitter icon" /></a>
            <a href="https://www.instagram.com/topcoder" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-instagram.svg" height={24} width={24} alt="Instagram icon" /></a>
            </div>
          </div>
        </div>
        <div className={defaultTheme['sep-line']} />
        <div className={defaultTheme['mobile-navi']}>
          <div className={defaultTheme['mobile-navi-col']}>
            <a href={`${base}/challenges`}>COMPETE</a>
            <a href={`${base}/thrive`}>TRACKS</a>
          </div>
          <div className={defaultTheme['mobile-navi-col']}>
            <a href={`${base}/community/learn`}>COMMUNITY</a>
            <a href={`${base}/thrive/tracks?track=Topcoder&tax=Help%20Articles`}>HELP CENTER</a>
          </div>
          <div className={defaultTheme['mobile-navi-col']}>
            <a href={`${base}/ommunity/admins`}>ABOUT</a>
          </div>
        </div>
        <div className={defaultTheme['mobile-only']}>
          <div className={defaultTheme['social-icons']}>
            <a href="https://www.facebook.com/topcoder/" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-fb.svg" height={24} width={24} alt="Facebook icon" /></a>
            <a href="https://www.youtube.com/c/TopcoderOfficial" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-youtube.svg" height={24} width={24} alt="Youtube icon" /></a>
            <a href="https://www.linkedin.com/company/topcoder" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-linkedln.svg" height={24} width={24} alt="Linkedin icon" /></a>
            <a href="https://twitter.com/topcoder" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-twitter.svg" height={24} width={24} alt="Twitter icon" /></a>
            <a href="https://www.instagram.com/topcoder" target="_blank" rel="noopener noreferrer"><Image src="/icons/icon-instagram.svg" height={24} width={24} alt="Instagram icon" /></a>
          </div>
        </div>
        <div className={defaultTheme.bottom}>
          <span className={defaultTheme['copyright-notice']}>
            {`© ${currentYear} Topcoder`}
            <a href={`${base}/policy`} className={defaultTheme.link}>Policies</a>
          </span>
        </div>
      </div>
    </div>
  );
}

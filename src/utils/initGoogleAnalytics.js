// Google Analytics: executes if a google analytics tag is provided.
// Nothing is reported from here beyond what GA's own pageview tracking sends.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'SQL Generator';

// document titles per route.  keep in sync with the routes in App.js
const pageTitles = {
  '/': 'SQL Generator — Convert Excel, CSV & JSON to SQL',
  '/sql-in-clause-generator': `SQL In-Clause Generator | ${SITE_NAME}`,
  '/sql-converter/excel-to-sql': `Excel to SQL Converter | ${SITE_NAME}`,
  '/sql-converter/csv-to-sql': `CSV to SQL Converter | ${SITE_NAME}`,
  '/sql-converter/json-to-sql': `JSON to SQL Converter | ${SITE_NAME}`,
  '/sql-statement-generator/alter-statements': `Alter Statements Generator | ${SITE_NAME}`,
};

const getPageTitle = (pathname) => pageTitles[pathname] || SITE_NAME;

export const initGoogleAnalytics = () => {
  // Check if the script is already present and that the GTAG variable is defined
  if (!window.gtag && process.env.REACT_APP_GOOGLE_TAG_ID) {
    const gtag_id = process.env.REACT_APP_GOOGLE_TAG_ID;

    // Queue up js/config before the script loads.  gtag.js reads anything
    // already in dataLayer when it boots, so this has to come first.
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gtag_id);

    // Create the script element
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtag_id}`
    document.head.appendChild(script);
  }
};

// Gives each route its own document title.  Without this every page reported
// the same title and they all collapsed into one row in analytics.  GA picks
// up the new title on its own when the route changes, so nothing is sent here.
// Must be called from inside the Router, since useLocation needs that context.
export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);
};

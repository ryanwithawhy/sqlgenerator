# Overview

This project makes it easy to move excel, CSV, JSON, and other data into your data warehouse so you can analyze adhoc data sets with less data prep.  Simply upload a file or paste what you need into SQLGeneator and it will turn it into the SQL you need to either filter your existing data or ingest it directly into your warehouse.  Great for when you need to run adhoc analyses on data that's not natively available in a single warehouse.

It's hosted at [sqlgenerator.dev](https://sqlgenerator.dev) and runs everything client-side, so you can use this tool without sharing your data.  However, if you'd like to clone it and host it on your own tools for added safety, please provide attribution to the project on [GitHub](https://github.com/ryanwithawhy/sqlgenerator).

Additionally the initial structure was developed using [plandex](https://plandex.ai/), an open source, terminal-based AI coding engine that helps you complete large tasks, work around bad output, and maximize productivity.

## What this provides

This currently provides three options:

1/ [In-Clause Generator](https://github.com/ryanwithawhy/sqlgenerator/blob/main/src/pages/InClauseGenerator.js).  Generates SQL in-clauses from pasted data.  Great when you have a CSV containing identifiers like customer or order IDs that you want to filter an existing table on.

2/ [Excel to SQL](https://github.com/ryanwithawhy/sqlgenerator/blob/main/src/pages/TableGeneratorFromExcel.js).  Generates a SQL CREATE TABLE and SQL INSERT INTO statements from uploaded spreadsheet files like excel, CSV, and TSV and pasted data.  Great for when you need to ingest and join data sets into a warehouse for adhoc analyses.

3/ [JSON to SQL](https://github.com/ryanwithawhy/sqlgenerator/blob/main/src/pages/TableGeneratorFromJSON.js).  Generates SQL CREATE TABLE and SQL INSERT INTO statements from uploaded JSON files and pasted JSON.  Great for when you need to ingest and join data sets into a warehouse for adhoc analyses.  

# How to run this yourself

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

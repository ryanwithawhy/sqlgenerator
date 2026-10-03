import React from 'react';
import { Container, Typography, } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h1" gutterBottom>
        Welcome to SQL Generator
      </Typography>
      <Typography variant="body1" gutterBottom>
        This site provides tools to generate SQL statements from your local files so you can easily run ad hoc analytics on your data.  It currently provides two types of tools:
      </Typography>
      <Typography variant="body1" sx={{pl: 2}}>
        <ul>
          <li style={{'margin-top': "8px", "margin-bottom":"8px"}}>
            <strong>SQL Table Generators</strong> that convert your data into SQL CREATE TABLE and INSERT INTO TABLE statements. 
            Works for spreadsheet files (CSV, TSV, and excel), JSON files, and pasted tabular data.
          </li>
          <li style={{'margin-top': "8px", "margin-bottom":"8px"}}>
            <strong>SQL In-Clause Generator</strong> converts your data into WHERE or WHERE NOT statements so you can easily filter the data sets already in your warehouse.
          </li>
        </ul>
      </Typography>
      <Typography variant="body1">
        All operations are performed client-side so your data never leaves your computer.  Additionally, this is open source so feel free to clone the&nbsp;
        <a href='https://github.com/ryanwithawhy/sqlgenerator'>GitHub repository</a> and host it yourself.
      </Typography>
    </Container>
  );
};

export default Home;

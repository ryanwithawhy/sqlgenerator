import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { TextField, Button, Box, Tabs, Tab, Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import sqlGenerator from '../utils/sqlGenerator';
import Notice from '../components/Notice';
const { generateInClausesFromPaste, generateFullInClause  } = sqlGenerator;

function InClauseGenerator() {
  const [excelData, setExcelData] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [inClause, setInClause] = useState('');
  const [columnName, setColumnName] = useState('column_name');
  const [delimiter, setDelimiter] = useState('"');
  const [notIn, setNotIn] = useState(false);
  const [batchSize, setBatchSize] = useState(0);
  const [currentTab, setCurrentTab] = useState(0); // 0 for Pasted Data, 1 for In Clause
  const [unformattedClauses, setUnformattedClauses] = useState([]); // 0 for Pasted Data, 1 for In Clause
  const [disableButtons, setDisableButtons] = useState(true);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handlePaste = (event) => {
    const pastedText = event.target.value;
    setExcelData(pastedText);
  };

  const parseExcelData = () => {
    // Split the pasted text by new lines and then by tabs or other delimiters
    const rows = excelData.trim().split('\n').map(row => row.split('\t'));

    // Create a worksheet from the rows
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    setParsedData(jsonData);
    setUnformattedClauses(generateInClausesFromPaste(jsonData, batchSize));
    setInClause(generateFullInClause(unformattedClauses, notIn, columnName, delimiter));
    setCurrentTab(1);
  };

  useEffect(() => {
    if (parsedData.length !== 0) {
      const clauses = generateInClausesFromPaste(parsedData, batchSize);
      setUnformattedClauses(clauses);
    }
  }, [parsedData, batchSize]);

  useEffect(() => {
    if (unformattedClauses.length !== 0) {
      setInClause(generateFullInClause(unformattedClauses, notIn, columnName, delimiter));
      setCurrentTab(1);
    }
  }, [unformattedClauses, notIn, columnName, delimiter]);

  useEffect(() => {
    if (excelData){
      setDisableButtons(false);
    } else {
      setDisableButtons(true);
    }
  }, [excelData])

  const handleSQLCriteriaChange = (event) => {
    const { name, value } = event.target;
    if (name === 'columnName') setColumnName(value);
    if (name === 'delimiter') setDelimiter(value);
    if (name === 'notIn') setNotIn(value === 'EXCLUDE' ? true : false);
    if (name === 'batchSize') setBatchSize(value);
  };




  return (
    <Container>
      <Typography variant="h1">SQL In-Clause Generator</Typography>
      <Typography variant='body1' style={{"margin-top": '4px'}}>
        Copy and paste a list of values you want to include in a SQL in-clause from excel.  This will generate an in-clause allowing to easily include or exclude the data.
      </Typography>
      <Box>
        <Tabs 
            mb={2} 
            value={currentTab} 
            onChange={handleTabChange}
            >
            <Tab label="Pasted Data" />
            <Tab label="Generated In-Clause" />
            
        </Tabs>
      </Box>
      {currentTab === 0 && (
        <Box>
          <TextField 
            label="Paste Excel Data Here"
            multiline
            rows={10}
            variant="outlined"
            fullWidth
            value={excelData}
            onChange={handlePaste}
            style={{ marginTop: '10px', zIndex: 1 }} // Ensure it stays above other elements

          />
        </Box>
      )}
      {currentTab === 1 && (
        <Box>
          <TextField
            label="In Clause"
            multiline
            rows={10}
            variant="outlined"
            fullWidth
            value={inClause}
            onChange={(e) => setInClause(e.target.value)}
            style={{ marginTop: '10px', zIndex: 1 }} // Ensure it stays above other elements
          />
        </Box>
      )}
      <Grid id='sql-criteria' item xs={12}>
        <Box mt={2}>
          <Grid container spacing={2}>
          <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <TextField
                  labelId="column-name-label"
                  id="column-name-input"
                  label="Column Name"
                  name='columnName'
                  value={columnName}
                  onChange={handleSQLCriteriaChange}
                />
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="delimiter"
                  label="Delimiter"
                  name='delimiter'
                  value={delimiter}
                  onChange={handleSQLCriteriaChange}
                />
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="not-in">Include or Exclude</InputLabel>
                <Select
                  labelId="not-in"
                  id='not-in-select'
                  name='notIn'
                  value={notIn === true ? 'EXCLUDE' : 'INCLUDE'}
                  label='Include or Exclude'
                  onChange={handleSQLCriteriaChange}
                >
                  <MenuItem value='INCLUDE' selected>Include</MenuItem>
                  <MenuItem value='EXCLUDE'>Exclude</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="batch-size"
                  label="Batch Size"
                  name='batchSize'
                  type='number'
                  value={batchSize > 0 ? batchSize : ''}
                  onChange={handleSQLCriteriaChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Button
            variant="contained"
            color="primary"
            onClick={parseExcelData}
            style={{ marginTop: '10px' }}
            disabled={disableButtons}
          >
            Generate
        </Button>
      </Grid>
      <Notice />
    </Container>
  );
}

export default InClauseGenerator;

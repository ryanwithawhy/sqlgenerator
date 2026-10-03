import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
import { TextField, Button, Box, Tabs, Tab, Container, Typography, Grid, FormControl } from '@mui/material';
import Notice from '../../components/Notice';

function AlterStatementsGenerator() {
  const [excelData, setExcelData] = useState('');
  const [alterStatements, setAlterStatements] = useState('');
  const [alterStatementBeginning, setAlterStatementBeginning] = useState('ALTER TABLE');
  const [alterStatementEnd, setAlterStatementEnd] = useState('REPLICA IDENTITY FULL');
  const [beginningDelimiter, setBeginningDelimiter] = useState('"');
  const [endDelimiter, setEndDelimiter] = useState('"');
  const [currentTab, setCurrentTab] = useState(0); // 0 for Pasted Data, 1 for Alter Statements

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handlePaste = (event) => {
    setExcelData(event.target.value);
  };

  const generateAlterStatements = () => {
    const rows = excelData.trim().split('\n').map(row => row.split('\t'));
    const statements = rows.map(row => {
      const formattedColumns = row.map(col => `${beginningDelimiter}${col}${endDelimiter}`).join('.');
      return `${alterStatementBeginning} ${formattedColumns} ${alterStatementEnd};`;
    }).join('\n');
    setAlterStatements(statements);
    setCurrentTab(1); // Switch to the tab with the generated SQL statements
  };

  const handleSQLCriteriaChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'alterStatementBeginning':
        setAlterStatementBeginning(value);
        break;
      case 'alterStatementEnd':
        setAlterStatementEnd(value);
        break;
      case 'beginningDelimiter':
        setBeginningDelimiter(value);
        break;
      case 'endDelimiter':
        setEndDelimiter(value);
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <Typography variant="h1">Alter Statements Generator</Typography>
      <Typography variant="body1" style={{ marginTop: '4px' }}>
        Paste Excel data here and generate SQL ALTER statements with custom delimiters and formatting.
      </Typography>
      <Box>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          style={{ marginBottom: '10px' }}
        >
          <Tab label="Pasted Data" />
          <Tab label="Generated Alter Statements" />
        </Tabs>
        {currentTab === 0 && (
          <TextField
            label="Paste Excel Data Here"
            multiline
            rows={10}
            variant="outlined"
            fullWidth
            value={excelData}
            onChange={handlePaste}
            style={{ marginBottom: '10px' }}
          />
        )}
        {currentTab === 1 && (
          <TextField
            label="Generated Alter Statements"
            multiline
            rows={10}
            variant="outlined"
            fullWidth
            value={alterStatements}
            readOnly
            style={{ marginBottom: '10px' }}
          />
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              label="Alter Statement Beginning"
              name="alterStatementBeginning"
              value={alterStatementBeginning}
              onChange={handleSQLCriteriaChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              label="Alter Statement End"
              name="alterStatementEnd"
              value={alterStatementEnd}
              onChange={handleSQLCriteriaChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              label="Beginning Delimiter"
              name="beginningDelimiter"
              value={beginningDelimiter}
              onChange={handleSQLCriteriaChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              label="End Delimiter"
              name="endDelimiter"
              value={endDelimiter}
              onChange={handleSQLCriteriaChange}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={generateAlterStatements}
        disabled={!excelData}
        style={{ marginTop: '10px' }}
      >
        Generate
      </Button>
      <Notice />
    </Container>
  );
}

export default AlterStatementsGenerator;

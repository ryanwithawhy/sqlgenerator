import React, { useState, useEffect } from 'react';
import '../App.css';
import FileUpload from '../components/FileUpload';
// import SQLDownload from './components/SQLDownload';
import SQLDisplay from '../components/SQLDisplay';
import CopyToClipboard from '../components/CopyToClipboard';
import PasteDataModal from '../components/PasteDataModal';
import sqlGenerator from '../utils/sqlGenerator';
import Notice from '../components/Notice';

import { Container, Typography, Grid, Box, InputLabel, Select, FormControl, MenuItem, TextField, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button } from '@mui/material';
// import { downloadAsSingleFile } from './utils/sqlUnloader';

const { generateCreateAndInsertStatements } = sqlGenerator;

function TableGeneratorFromJSON() {
  const [sql, setSQL] = useState('');
  const [tableType, setTableType] = useState('TEMP');
  const [tableName, setTableName] = useState('table_name');
  const [batchSize, setBatchSize] = useState("");
  const [delimiter, setDelimiter] = useState('"');
  const [fileData, setFileData] = useState(null);
  const [fields, setFields] = useState([]);
  const [disableButtons, setDisableButtons] = useState(true);

  const handleData = (data) => { 
    setFileData(data) ;
    const fields = data[0].map((field, index) => ({
      index,
      name: field,
      type: 'VARCHAR',
      include: true
    }));
    setFields(fields);
    setDisableButtons(false);
  };

  const handleSQLCriteriaChange = (event) => {
    const { name, value } = event.target;
    if (name === 'tableType') setTableType(value);
    if (name === 'tableName') setTableName(value);
    if (name === 'batchSize') setBatchSize(value);
    if (name === 'delimiter') setDelimiter(value);
  };

  const handleSQLChange = (event) => {
    setSQL(event.value);
  }

  const handleFieldChange = (index, field, value) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const handleIncludeChange = (index) => {
    const newFields = [...fields];
    newFields[index].include = !newFields[index].include;
    setFields(newFields);
  };

  const downloadSQL = () => {
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  useEffect(() => {
    if (fileData ) {
      const allStatements = generateCreateAndInsertStatements(fileData, fields, tableName, tableType, batchSize, delimiter);
      const newSQL = allStatements.join("");
      setSQL(newSQL);
    }
  }, [fileData, tableName, tableType, batchSize, delimiter, fields]);

return (
  <Container>
    <Grid container>
      <Grid sm={10} xs={12}>
        <Typography variant="h1">JSON to SQL Converter</Typography>
      </Grid>
    </Grid>
    <Grid container >
      <Typography variant='body1'>
          Easily convert your JSON files to SQL.
          Allows you to easily extract, transform, and load small amounts of data between data warehouses.
          Use the options below to modify the SQL.
      </Typography>
      <Box mt={2} display="flex" flexDirection="row" spacing={2} > 
        <Box mr={1}><FileUpload onData={handleData} fileType='JSON'/></Box>
        <Box mr={1}><PasteDataModal onData={handleData} fileType = 'JSON'/></Box>
        <Box mr={1}><CopyToClipboard textToCopy={sql} disabled={disableButtons} /></Box>
        <Button variant="contained" color="primary" onClick={downloadSQL} disabled={disableButtons}>
            Download SQL
        </Button>
      </Box>
      <Grid item xs={12}>
        <Box mt={2}>
          <SQLDisplay sql={sql} onChange={handleSQLChange}/>
        </Box>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="table-type">Table Type</InputLabel>
                <Select
                  labelId="table-type"
                  id='table-type-select'
                  name='tableType'
                  value={tableType}
                  label='Table Type'
                  onChange={handleSQLCriteriaChange}
                >
                  <MenuItem value='TEMP'>Temp Table</MenuItem>
                  <MenuItem value='PERM'>Permanent Table</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="table-name"
                  label="Table Name"
                  name='tableName'
                  value={tableName}
                  onChange={handleSQLCriteriaChange}
                />
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="batch-size"
                  label="Batch Size"
                  type="number"
                  name='batchSize'
                  value={batchSize}
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
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
          <Box mt={2}>
            {/* ADDED: Table for Column Details */}
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Column Number</TableCell>
                    <TableCell>Column Name</TableCell>
                    <TableCell>Column Type</TableCell>
                    <TableCell>Include</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.index}>
                      <TableCell>{field.index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          value={field.name}
                          onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={field.type}
                          onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={field.include}
                          onChange={() => handleIncludeChange(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
    </Grid>
      <Notice />

  </Container>
);

}
export default TableGeneratorFromJSON;



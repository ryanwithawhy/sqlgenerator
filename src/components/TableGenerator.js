import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import SQLDisplay from './SQLDisplay';
import CopyToClipboard from './CopyToClipboard';
import PasteDataModal from './PasteDataModal';
import Notice from './Notice';
import sqlGenerator from '../utils/sqlGenerator';
import { downloadAsSingleFile } from '../utils/sqlUnloader';
import { Container, Typography, Grid, Box, InputLabel, Select, FormControl, MenuItem, TextField,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button } from '@mui/material';

// import from sqlGenerator
const { generateCreateAndInsertStatements  } = sqlGenerator;

// Shared body for the CSV, Excel, and JSON converters.  Those pages differ only
// in their heading, intro copy, and which file type they accept.
function TableGenerator({ title, description, fileType }) {
  const [sql, setSQL] = useState('');
  const [tableType, setTableType] = useState('TEMP');
  const [tableName, setTableName] = useState('table_name');
  const [batchSize, setBatchSize] = useState("");
  const [delimiter, setDelimiter] = useState('"');
  const [providedData, setProvidedData] = useState(null);
  const [fields, setFields] = useState([]);
  const [disableButtons, setDisableButtons] = useState(true);

  const handleData = (data) => {
    setProvidedData(data) ;
    const fields = data[0].map((field, index) => ({
      index,
      name: field,
      type: 'VARCHAR',
      include: true,
      quote: true
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

  const handleCheckboxChange = (index, field) => {
    const newFields = [...fields];
    newFields[index][field] = !newFields[index][field];
    setFields(newFields);
  };

  const downloadSQL = () => downloadAsSingleFile(sql, tableName);

  useEffect(() => {
    if (providedData ) {
      const allStatements = generateCreateAndInsertStatements(providedData, fields, tableName, tableType, batchSize, delimiter);
      const newSQL = allStatements.join("");
      setSQL(newSQL);
    }
  }, [providedData, tableName, tableType, batchSize, delimiter, fields]);

return (
  <Container>
    <Grid container>
      <Grid sm={10} xs={12}>
        <Typography variant="h1">{title}</Typography>
      </Grid>
    </Grid>
    <Typography variant='body1' style={{ marginTop: '4px' }}>
        {description}
    </Typography>
    <Box mt={2}  >
    <Grid container>
      <Box mr={1}><FileUpload onData={handleData} fileType={fileType} /></Box>
      <Box mr={1}><PasteDataModal onData={handleData} fileType={fileType} /></Box>
      <Box mr={1}><CopyToClipboard textToCopy={sql} disabled={disableButtons} /></Box>
      <Button variant="contained" color="primary" onClick={downloadSQL} disabled={disableButtons}>
          Download SQL
      </Button>
      </Grid>
    </Box>
    <Grid container >
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
                    <TableCell>Quote Values</TableCell>
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
                          onChange={() => handleCheckboxChange(index, 'include')}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={field.quote}
                          onChange={() => handleCheckboxChange(index, 'quote')}
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

export default TableGenerator;

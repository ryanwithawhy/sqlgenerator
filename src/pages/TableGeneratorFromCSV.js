import React from 'react';
import TableGenerator from '../components/TableGenerator';

function TableGeneratorFromCSV() {
  return (
    <TableGenerator
      title="CSV to SQL Converter"
      description="Upload a CSV or paste the data into this tool.  This will generate SQL CREATE TABLE and INSERT INTO TABLE statements that you can copy to your clipboard or download as a file.  Run the SQL statements in your warehouse and start querying your data."
      fileType="SPREADSHEET"
    />
  );
}

export default TableGeneratorFromCSV;

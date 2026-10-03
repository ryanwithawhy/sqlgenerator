import React from 'react';
import TableGenerator from '../components/TableGenerator';

function TableGeneratorFromExcel() {
  return (
    <TableGenerator
      title="Excel to SQL Converter"
      description="Upload an excel file or paste your spreadsheet data into this tool.  This site generate SQL CREATE TABLE and INSERT INTO TABLE statements that you can copy to your clipboard or download as a file.  Run the SQL statements in your warehouse and start querying your data."
      fileType="SPREADSHEET"
    />
  );
}

export default TableGeneratorFromExcel;

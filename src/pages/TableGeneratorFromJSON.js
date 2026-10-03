import React from 'react';
import TableGenerator from '../components/TableGenerator';

function TableGeneratorFromJSON() {
  return (
    <TableGenerator
      title="JSON to SQL Converter"
      description="Easily convert your JSON files to SQL. Allows you to easily extract, transform, and load small amounts of data between data warehouses. Use the options below to modify the SQL."
      fileType="JSON"
    />
  );
}

export default TableGeneratorFromJSON;

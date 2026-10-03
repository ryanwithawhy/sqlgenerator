const generateCreateAndInsertStatements = (data, fields, tableName, tableType, batchSize, delimiter = '"') => {
  return [
    generateCreateTableSQL(fields, tableName, tableType, delimiter),
    generateInsertStatements(data, fields, tableName, batchSize, delimiter)
  ].flat()
}

const generateInClausesFromPaste = (jsonData, batchSize = null) => {
  const formattedItems = jsonData.flat().map((item) => `'${item}'`);
  let chunkedDataPoints = []
  if(validBatchSize(batchSize) && batchSize > 0){
    chunkedDataPoints = [...breakIntoChunks(formattedItems, batchSize)]
  } else {
    chunkedDataPoints = [formattedItems]
  }
  return chunkedDataPoints;
};

const generateFullInClause = (chunkedDataPoints, notIn = false, attributeName = 'column_name', delimiter = '"') => {
  // console.log(chunkedDataPoints)
  const inStatement = notIn ? 'NOT IN (' : 'IN (';
  const statements = chunkedDataPoints.map((chunk, i) => {
    const whereOrOr = i===0 ? '(\n\t' : 'OR '; 
    const formattedData = `\n\t\t${chunk.join(',\n\t\t')}\n\t)\n`
    return `${whereOrOr}${delimiter}${attributeName}${delimiter} ${inStatement} ${formattedData}`
  })
  return `${statements.join('\n')})`;
}

function breakIntoChunks(allDataPoints, batchSize) { // Changed from generator function

  const result = [];
  for (let i = 0; i < allDataPoints.length; i += Number(batchSize)) {
    const batch = allDataPoints.slice(i, i + Number(batchSize));
    result.push(batch);
  }
  return result;
}


const generateCreateTableSQL = (fields, tableName, tableType, delimiter = '"') => {
  const columns = fields
    .filter(field => field.include === true)
    .map((field) => `${delimiter}${field.name}${delimiter} ${field.type}`).join(', ');
  const createTableSQL = `CREATE ${tableType === 'TEMP' ? "TEMP " : ""}TABLE ${delimiter}${tableName}${delimiter} (${columns});`;
  return createTableSQL;
}

const generateInsertStatements = (data, fields, tableName, batchSize, delimiter = '"') => {
  const rows = data.slice(1);
  console.log('rows')
  console.log(rows)
  // removes fields where index != true
  const includedFieldIndexes = fields.map((field, index) => field.include === true ? index : null).filter((index) => index !== null);
  const insertIntoClause = generateInsertIntoClause(tableName, delimiter);
  const insertStatements = rows.map((row, rowNumber) => {
    return generateInsertLine(insertIntoClause, includedFieldIndexes, row, rows.length, rowNumber, batchSize)
  });
  return insertStatements.join('');
};

// const generateAlterStatements = (tableData) => {
//   return null
// }

const generateInsertIntoClause = (tableName, delimiter = '"') => {
  return `\n\nINSERT INTO ${delimiter}${tableName}${delimiter} VALUES`
}

const generateInsertLine = (insertIntoClause, includedFieldIndexes, row, totalRows, rowNumber, batchSize) => {

  const beginningOfStatement = isFirstLineOfStatement(rowNumber, batchSize) ? insertIntoClause : '';
  
  let values = [];
  for (let index = 0; index < row.length; index++) {

    // this mechanism ensures empty array values at the beginning of the string are included
    if (includedFieldIndexes.includes(index)) {
      // 
      const value = row[index] === undefined ? '' : row[index];
      values.push(`'${value}'`);
    }
  }

  // ensures trailing empty values are included
  if(values.length !== includedFieldIndexes.length){
    for(let index = 0; index < includedFieldIndexes.length - values.length; index++){
      values.push("''");
    }
  }

  const endOfStatement = isEndOfStatement(totalRows, rowNumber, batchSize) ? ";" : ",";
  const valuesString = values.join(', ');
  console.log(valuesString);
  return beginningOfStatement + "\n\t(" + valuesString + ")" + endOfStatement;
}

const isEndOfStatement = (totalRows, rowNumber, batchSize) => {
  // last row or end of batch
    if(
      // last row 
      rowNumber === totalRows - 1
      // valid batch size and end of batch
      || ( validBatchSize(batchSize) && rowNumber % batchSize === batchSize - 1)
    ){
      return true;
    } else {
      return false;
    }
  }

// HELPERS

const isFirstLineOfStatement = (rowNumber, batchSize) => {
  // if it is the first row
  if(rowNumber === 0){
    return true;
  } 
  // if it is a new barch
  else if (validBatchSize(batchSize) && rowNumber % batchSize === 0) 
    return true;
  else {
    return false;
  }
}

const validBatchSize = (batchSize) => {
  // console.log(`batchSize: ${batchSize}`)
  if(Number.isInteger(Number(batchSize)) === true && batchSize > 0){
    // console.log('valid')
    return true;
  } else {
    // console.log('not valid')
    return false;
  }
}

const sqlGenerator = {
  generateCreateAndInsertStatements,
  generateInClausesFromPaste,
  generateFullInClause,
};

if (process.env.NODE_ENV === 'test') {
  sqlGenerator.breakIntoChunks = breakIntoChunks;
  sqlGenerator.generateCreateTableSQL = generateCreateTableSQL;
  sqlGenerator.generateInsertStatements = generateInsertStatements;
  sqlGenerator.generateInsertIntoClause = generateInsertIntoClause;
  sqlGenerator.generateInsertLine = generateInsertLine;
  sqlGenerator.isEndOfStatement = isEndOfStatement;
  sqlGenerator.isFirstLineOfStatement = isFirstLineOfStatement;
  sqlGenerator.validBatchSize = validBatchSize;
}

export default sqlGenerator;
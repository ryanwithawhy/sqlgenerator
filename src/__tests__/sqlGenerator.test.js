// sqlGenerator.test.js

import sqlGenerator from '../utils/sqlGenerator';

const {
    generateCreateAndInsertStatements,
    generateInClausesFromPaste,
    generateFullInClause,
    breakIntoChunks,
    generateCreateTableSQL,
    generateInsertStatements,
    generateInsertIntoClause,
    generateInsertLine,
    isEndOfStatement,
    isFirstLineOfStatement,
    validBatchSize
  } = sqlGenerator;

describe('SQL Generator Functions', () => {

  test('generateCreateAndInsertStatements', () => {
    const data = [
      ['id', 'name'],
      [1, 'John'],
      [2, 'Jane']
    ];
    const fields = [
      { name: 'id', type: 'INT', include: true },
      { name: 'name', type: 'VARCHAR(255)', include: true }
    ];
    const tableName = 'users';
    const tableType = 'TEMP';
    const batchSize = 1;

    const result = sqlGenerator.generateCreateAndInsertStatements(data, fields, tableName, tableType, batchSize);
    
    expect(result).toEqual(expect.arrayContaining([
      'CREATE TEMP TABLE "users" ("id" INT, "name" VARCHAR(255));',
      '\n\nINSERT INTO "users" VALUES\n\t(\'1\', \'John\');\n\nINSERT INTO "users" VALUES\n\t(\'2\', \'Jane\');'
    ]));
  });

  test('generateInClausesFromPaste', () => {
    const jsonData = [[1, 2], [3, 4]];
    const batchSize = 2;

    const result = sqlGenerator.generateInClausesFromPaste(jsonData, batchSize);

    expect(result).toEqual([
      ["'1'", "'2'"],
      ["'3'", "'4'"]
    ]);
  });

  test('generateFullInClause', () => {
    const chunkedDataPoints = [["'1'", "'2'"], ["'3'", "'4'"]];
    const notIn = false;
    const attributeName = 'id';

    const result = sqlGenerator.generateFullInClause(chunkedDataPoints, notIn, attributeName);

    expect(result).toEqual(
      '(\n\t"id" IN ( \n\t\t\'1\',\n\t\t\'2\'\n\t)\n\nOR "id" IN ( \n\t\t\'3\',\n\t\t\'4\'\n\t)\n)'
    );
  });

  test('breakIntoChunks', () => {
    const allDataPoints = [1, 2, 3, 4, 5];
    const batchSize = 2;

    const result = sqlGenerator.breakIntoChunks(allDataPoints, batchSize);

    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('generateCreateTableSQL', () => {
    const fields = [
      { name: 'id', type: 'INT', include: true },
      { name: 'name', type: 'VARCHAR(255)', include: true }
    ];
    const tableName = 'users';
    const tableType = 'TEMP';

    const result = sqlGenerator.generateCreateTableSQL(fields, tableName, tableType);

    expect(result).toBe('CREATE TEMP TABLE "users" ("id" INT, "name" VARCHAR(255));');
  });

  test('generateInsertStatements', () => {
    const data = [
      ['id', 'name'],
      [1, 'John'],
      [2, 'Jane']
    ];
    const fields = [
      { name: 'id', type: 'INT', include: true },
      { name: 'name', type: 'VARCHAR(255)', include: true }
    ];
    const tableName = 'users';
    const batchSize = 1;

    const result = sqlGenerator.generateInsertStatements(data, fields, tableName, batchSize);

    expect(result).toBe(
      '\n\nINSERT INTO "users" VALUES\n\t(\'1\', \'John\');\n\nINSERT INTO "users" VALUES\n\t(\'2\', \'Jane\');'
    );
  });

  test('isEndOfStatement', () => {
    expect(sqlGenerator.isEndOfStatement(5, 4, 2)).toBe(true);
    expect(sqlGenerator.isEndOfStatement(5, 2, 2)).toBe(false);
    expect(sqlGenerator.isEndOfStatement(5, 4, null)).toBe(true);
  });

  test('isFirstLineOfStatement', () => {
    expect(sqlGenerator.isFirstLineOfStatement(0, 2)).toBe(true);
    expect(sqlGenerator.isFirstLineOfStatement(2, 2)).toBe(true);
    expect(sqlGenerator.isFirstLineOfStatement(1, 2)).toBe(false);
  });

  test('validBatchSize', () => {
    expect(sqlGenerator.validBatchSize(2)).toBe(true);
    expect(sqlGenerator.validBatchSize(-1)).toBe(false);
    expect(sqlGenerator.validBatchSize(null)).toBe(false);
  });

});

describe('Custom delimiter', () => {

  const fields = [
    { name: 'id', type: 'INT', include: true },
    { name: 'name', type: 'VARCHAR(255)', include: true }
  ];

  test('generateCreateTableSQL wraps identifiers in a backtick delimiter', () => {
    const result = sqlGenerator.generateCreateTableSQL(fields, 'users', 'TEMP', '`');

    expect(result).toBe('CREATE TEMP TABLE `users` (`id` INT, `name` VARCHAR(255));');
  });

  test('generateCreateAndInsertStatements delimits identifiers but not row values', () => {
    const data = [
      ['id', 'name'],
      [1, 'John']
    ];

    const result = sqlGenerator.generateCreateAndInsertStatements(data, fields, 'users', 'TEMP', 1, '`');

    expect(result).toEqual([
      'CREATE TEMP TABLE `users` (`id` INT, `name` VARCHAR(255));',
      '\n\nINSERT INTO `users` VALUES\n\t(\'1\', \'John\');'
    ]);
  });

  test('generateFullInClause delimits the column name but not the values', () => {
    const chunkedDataPoints = [["'1'", "'2'"]];

    const result = sqlGenerator.generateFullInClause(chunkedDataPoints, false, 'id', '`');

    expect(result).toBe('(\n\t`id` IN ( \n\t\t\'1\',\n\t\t\'2\'\n\t)\n)');
  });

  test('an empty delimiter produces unquoted identifiers', () => {
    const result = sqlGenerator.generateCreateTableSQL(fields, 'users', 'TEMP', '');

    expect(result).toBe('CREATE TEMP TABLE users (id INT, name VARCHAR(255));');
  });

  // The delimiter is unvalidated free text, so a single quote is passed through
  // verbatim. The resulting SQL is invalid in most dialects -- that is the
  // documented behavior, not a bug to "fix" here.
  test('a single-quote delimiter is passed through verbatim', () => {
    const result = sqlGenerator.generateCreateTableSQL(fields, 'users', 'TEMP', "'");

    expect(result).toBe("CREATE TEMP TABLE 'users' ('id' INT, 'name' VARCHAR(255));");
  });

});

describe('Per-column value quoting', () => {

  const data = [
    ['id', 'name'],
    [1, 'John'],
    [2, 'Jane']
  ];

  test('unquoted columns emit bare values, quoted ones keep their quotes', () => {
    const fields = [
      { name: 'id', type: 'INT', include: true, quote: false },
      { name: 'name', type: 'VARCHAR(255)', include: true, quote: true }
    ];

    const result = sqlGenerator.generateInsertStatements(data, fields, 'users', null);

    expect(result).toBe(
      '\n\nINSERT INTO "users" VALUES\n\t(1, \'John\'),\n\t(2, \'Jane\');'
    );
  });

  test('fields without a quote property stay quoted', () => {
    const fields = [
      { name: 'id', type: 'INT', include: true },
      { name: 'name', type: 'VARCHAR(255)', include: true }
    ];

    const result = sqlGenerator.generateInsertStatements(data, fields, 'users', null);

    expect(result).toBe(
      '\n\nINSERT INTO "users" VALUES\n\t(\'1\', \'John\'),\n\t(\'2\', \'Jane\');'
    );
  });

  test('an empty value in an unquoted column becomes NULL, not an empty string', () => {
    const sparse = [
      ['id', 'name'],
      ['', 'John']
    ];
    const fields = [
      { name: 'id', type: 'INT', include: true, quote: false },
      { name: 'name', type: 'VARCHAR(255)', include: true, quote: true }
    ];

    const result = sqlGenerator.generateInsertStatements(sparse, fields, 'users', null);

    expect(result).toBe('\n\nINSERT INTO "users" VALUES\n\t(NULL, \'John\');');
  });

  // Trailing values missing from the row are padded; the padding has to respect
  // each column's own quote setting rather than always emitting ''.
  test('trailing missing values respect the column quote setting', () => {
    const ragged = [
      ['id', 'name', 'score'],
      [1]
    ];
    const fields = [
      { name: 'id', type: 'INT', include: true, quote: false },
      { name: 'name', type: 'VARCHAR(255)', include: true, quote: true },
      { name: 'score', type: 'INT', include: true, quote: false }
    ];

    const result = sqlGenerator.generateInsertStatements(ragged, fields, 'users', null);

    expect(result).toBe('\n\nINSERT INTO "users" VALUES\n\t(1, \'\', NULL);');
  });

  test('formatValue', () => {
    expect(sqlGenerator.formatValue('John', false)).toBe("'John'");
    expect(sqlGenerator.formatValue(42, true)).toBe('42');
    expect(sqlGenerator.formatValue('', true)).toBe('NULL');
    expect(sqlGenerator.formatValue('', false)).toBe("''");
  });

  test('generateInClausesFromPaste can emit unquoted values', () => {
    const jsonData = [[1, 2], [3, 4]];

    expect(sqlGenerator.generateInClausesFromPaste(jsonData, null, false)).toEqual([
      ['1', '2', '3', '4']
    ]);
    // defaults to quoted, so existing callers are unaffected
    expect(sqlGenerator.generateInClausesFromPaste(jsonData, null)).toEqual([
      ["'1'", "'2'", "'3'", "'4'"]
    ]);
  });

});

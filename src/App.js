import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider from Material-UI
import theme from './styles/theme.js';
import InClauseGenerator from './pages/InClauseGenerator';
import TableGeneratorFromExcel from './pages/TableGeneratorFromExcel';
import TableGeneratorFromJSON from './pages/TableGeneratorFromJSON';
import TableGeneratorFromCSV from './pages/TableGeneratorFromCSV';
import AlterStatementsGenerator from './pages/statements/AlterStatementsGenerator';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { initGoogleAnalytics, usePageTitle } from './utils/initGoogleAnalytics'; // Import initGA

// Lives inside the Router so usePageTitle can read the current location
function AppRoutes() {
  usePageTitle();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sql-in-clause-generator" element={<InClauseGenerator />} />
        <Route path="/sql-converter/excel-to-sql" element={<TableGeneratorFromExcel />} />
        <Route path="/sql-converter/csv-to-sql" element={<TableGeneratorFromCSV />} />
        <Route path="/sql-converter/json-to-sql" element={<TableGeneratorFromJSON />} />
        <Route path="/in-clause-generator" element={<Navigate to="/sql-in-clause-generator" />} />
        <Route path="/sql-statement-generator/alter-statements" element={<AlterStatementsGenerator />} />
        {/* Add a catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    initGoogleAnalytics(); // Initialize Google Analytics
  }, []);

  return (
    <ThemeProvider theme={theme}> {/* Wrap the application with ThemeProvider */}
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;

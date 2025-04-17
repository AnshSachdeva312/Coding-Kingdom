// src/api/scan.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Flask server URL

export const scanSmartContract = async (code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scan`, { code });
    
    // Ensure consistent response format
    if (!response.data.issues) {
      response.data.issues = [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error scanning smart contract:', error);
    return {
      error: error.message || 'Scan failed',
      issues: [],
      risk: 'Unknown'
    };
  }
};

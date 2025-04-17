import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Results = () => {
  const style = {
    container: {
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
        padding: '20px',
        color: '#e0e0e0',
        width: '100vw',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      },
    header: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#4fd1c5',
      textAlign: 'center',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: '#2b2b2b',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff',
    },
    resultText: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#aaa',
    },
    icon: {
      fontSize: '24px',
    },
    positive: {
      color: '#4fd1c5',
    },
    negative: {
      color: '#f44336',
    },
  };

  return (
    <div style={style.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={style.header}>Audit Results</h1>

        {/* Sample Results */}
        <div style={style.card}>
          <div>
            <h2 style={style.cardTitle}>Reentrancy Vulnerability</h2>
            <p style={style.resultText}>High Risk, Vulnerability Detected</p>
          </div>
          <FiAlertTriangle style={{ ...style.icon, color: '#f44336' }} />
        </div>

        <div style={style.card}>
          <div>
            <h2 style={style.cardTitle}>Gas Optimization</h2>
            <p style={style.resultText}>Optimized for gas usage</p>
          </div>
          <FiCheckCircle style={{ ...style.icon, color: '#4fd1c5' }} />
        </div>

        <div style={style.card}>
          <div>
            <h2 style={style.cardTitle}>SafeMath Implementation</h2>
            <p style={style.resultText}>No vulnerabilities detected</p>
          </div>
          <FiCheckCircle style={{ ...style.icon, color: '#4fd1c5' }} />
        </div>
      </motion.div>
    </div>
  );
};

export default Results;

import React from 'react';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Vote = () => {
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
    button: {
      padding: '12px 25px',
      fontSize: '18px',
      backgroundColor: '#2d2d2d',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#4fd1c5',
    },
    buttonText: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    card: {
      backgroundColor: '#2b2b2b',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff',
    },
    icon: {
      color: '#f0c674',
    },
  };

  return (
    <div style={style.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={style.header}>Vote for Smart Contract Auditing</h1>

        <div style={style.card}>
          <div>
            <h2 style={style.cardTitle}>Reentrancy Vulnerability</h2>
            <p style={{ color: '#aaa' }}>Voting on whether this vulnerability is critical or not.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={style.button}>
              <FiCheckCircle style={style.icon} />
              Approve
            </button>
            <button style={style.button}>
              <FiAlertTriangle style={style.icon} />
              Reject
            </button>
          </div>
        </div>

        <div style={style.card}>
          <div>
            <h2 style={style.cardTitle}>Gas Optimization Issue</h2>
            <p style={{ color: '#aaa' }}>Voting on whether this contract is optimized for gas usage.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={style.button}>
              <FiCheckCircle style={style.icon} />
              Approve
            </button>
            <button style={style.button}>
              <FiAlertTriangle style={style.icon} />
              Reject
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Vote;

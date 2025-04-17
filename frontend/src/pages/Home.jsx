import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiShield, FiSend, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const messages = [
    "Secure your code against exploits",
    "Enterprise-grade vulnerability detection",
    "Protect your applications",
    "Audit before deployment"
  ];

  // Rotate through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scanCode = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        risk: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
        issues: []
      };

      const potentialIssues = [
        {
          type: 'Reentrancy',
          severity: 'High',
          description: 'Potential reentrancy vulnerability detected in external calls.',
          lines: [Math.floor(Math.random() * 20) + 1]
        },
        {
          type: 'Integer Overflow',
          severity: 'Medium',
          description: 'Possible integer overflow/underflow detected.',
          lines: [Math.floor(Math.random() * 20) + 1]
        },
        {
          type: 'Unchecked Call',
          severity: 'Medium',
          description: 'Return value of external call not checked.',
          lines: [Math.floor(Math.random() * 20) + 1]
        }
      ];

      const numIssues = Math.floor(Math.random() * 3);
      for (let i = 0; i < numIssues; i++) {
        mockResult.issues.push(potentialIssues[Math.floor(Math.random() * potentialIssues.length)]);
      }

      setResult(mockResult);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="header-message">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {messages[activeMessageIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="editor-container">
        <div className="editor-header">
          <div className="editor-tabs">
            <div className="tab active">contract.sol</div>
            <div className="tab">config.json</div>
          </div>
          <button className="action-button">
            <FiCode /> Format
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-editor"
          placeholder={`// Paste your code here\n// Supported languages: Solidity, Rust, JavaScript, TypeScript\n\ncontract Example {\n  // Your code will be analyzed for vulnerabilities\n}`}
          spellCheck="false"
        />

        <div className="editor-footer">
          <div className="language-selector">
            <select>
              <option>Solidity</option>
              <option>Rust</option>
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Go</option>
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scanCode}
            disabled={isLoading || !code.trim()}
            className={`scan-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Analyzing...
              </>
            ) : (
              <>
                <FiShield /> Scan Code
              </>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="results-panel"
          >
            <div className="results-header">
              <h2>
                <FiShield /> Scan Results
              </h2>
              <span className={`risk-level ${result.risk.toLowerCase()}`}>
                {result.risk} Risk
              </span>
            </div>

            {result.issues.length > 0 ? (
              <div className="issues-list">
                {result.issues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`issue ${issue.severity.toLowerCase()}`}
                  >
                    <div className="issue-header">
                      <span className="issue-type">{issue.type}</span>
                      <span className="issue-severity">{issue.severity}</span>
                    </div>
                    <p className="issue-description">{issue.description}</p>
                    {issue.lines && issue.lines.length > 0 && (
                      <div className="issue-lines">
                        <FiCode /> Lines: {issue.lines.join(', ')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-issues">
                <FiCheckCircle /> No vulnerabilities detected
              </div>
            )}

            <div className="results-footer">
              <button className="action-button">
                <FiSend /> Share Report
              </button>
              <button className="action-button primary">
                <FiAlertTriangle /> View Fixes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
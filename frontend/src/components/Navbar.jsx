import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiShield, 
  FiUser, 
  FiPlusCircle, 
  FiChevronDown, 
  FiLogOut,
  FiAward,
  FiDollarSign,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBountiesOpen, setIsBountiesOpen] = useState(false);
  const [isMyBountiesOpen, setIsMyBountiesOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [allBounties, setAllBounties] = useState([]);
  const [myBounties, setMyBounties] = useState([]);
  const [newBounty, setNewBounty] = useState({
    name: '',
    file: null,
    vulnerabilities: '',
    dueDate: '',
    amount: ''
  });
  const navigate = useNavigate();

  // Get user data and bounties
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
      fetchBounties(user._id);
    }
  }, []);

  const fetchBounties = async (userId) => {
    try {
      // Fetch all bounties
      const allBountiesRes = await axios.get('http://localhost:3000/app/bounties', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllBounties(allBountiesRes.data);
      
      // Fetch user's bounties
      const token = localStorage.getItem('authToken');
const myBountiesRes = await axios.get('http://localhost:3000/app/bounties/my/bounties', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
      setMyBounties(myBountiesRes.data);
    } catch (error) {
      console.error('Error fetching bounties:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateBounty = async () => {
    try {
      const formData = new FormData();
      const token = localStorage.getItem('token');
      formData.append('name', newBounty.name);
      if (newBounty.file) {
        formData.append('file', newBounty.file);
      }
      formData.append('vulnerabilities', newBounty.vulnerabilities || '');
      formData.append('dueDate', newBounty.dueDate);
      formData.append('bountyAmount', newBounty.amount); // Changed from 'amount' to 'bountyAmount'
      const response = await axios.post('http://localhost:3000/app/bounties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      // Handle successful creation
      if (response.status === 201) {
        if (userData) {
          await fetchBounties(userData._id);
        }
        setNewBounty({
          name: '',
          file: null,
          vulnerabilities: '',
          dueDate: '',
          amount: ''
        });
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating bounty:', error);
      // Add user feedback here (e.g., toast notification)
    }
  };

  // Helper function to determine bounty status
  const getBountyStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (timeDiff < 0) return 'expired';
    if (daysDiff <= 1) return 'ending soon';
    return 'active';
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const navItemHover = {
    scale: 1.05,
    color: "#4fd1c5",
    transition: { duration: 0.2 }
  };

  const navItemTap = {
    scale: 0.98
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      style={{
        backgroundColor: '#121212',
        padding: '0 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        height: '70px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Left section - Logo and Bounties */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <FiShield style={{ color: '#4fd1c5', fontSize: '24px' }} />
          <span style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #4fd1c5, #38ef7d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SmartFix
          </span>
        </motion.div>

        <motion.div
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsBountiesOpen(true)}
          onMouseLeave={() => setIsBountiesOpen(false)}
        >
          <motion.button
            whileHover={navItemHover}
            whileTap={navItemTap}
            style={{
              background: 'none',
              border: 'none',
              color: '#aaa',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 15px',
              borderRadius: '8px'
            }}
          >
            <FiAward style={{ fontSize: '18px' }} />
            Bounties
            <FiChevronDown style={{
              transition: 'transform 0.3s',
              transform: isBountiesOpen ? 'rotate(180deg)' : 'rotate(0)'
            }} />
          </motion.button>

          <AnimatePresence>
            {isBountiesOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#1e1e1e',
                  borderRadius: '12px',
                  padding: '20px',
                  minWidth: '400px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  zIndex: 1001
                }}
              >
                <div style={{
                  color: '#4fd1c5',
                  fontWeight: '600',
                  marginBottom: '5px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FiAward /> Active Bounties
                </div>
                <div style={{ 
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '10px'
                }}>
                  {allBounties.map(bounty => {
                    const status = getBountyStatus(bounty.dueDate);
                    if (status === 'expired') return null;
                    
                    return (
                      <motion.div
                        key={bounty._id}
                        whileHover={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}
                        style={{
                          padding: '15px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          borderLeft: `3px solid ${
                            status === 'ending soon' ? '#FFA500' : '#4fd1c5'
                          }`,
                          marginBottom: '10px'
                        }}
                        onClick={() => navigate(`/bounty/${bounty._id}`)}
                      >
                        <div style={{ 
                          color: 'white', 
                          fontWeight: '500',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          {bounty.name}
                          <span style={{ 
                            color: '#4fd1c5',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FiDollarSign /> {bounty.bountyAmount} ETH
                          </span>
                        </div>
                        <div style={{ 
                          color: '#aaa', 
                          fontSize: '13px',
                          fontStyle: status === 'ending soon' ? 'italic' : 'normal',
                          marginTop: '5px'
                        }}>
                          Status: {status}
                        </div>
                        <div style={{ 
                          color: '#888', 
                          fontSize: '12px',
                          marginTop: '5px'
                        }}>
                          Due: {new Date(bounty.dueDate).toLocaleDateString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Center section - Navigation */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {[
          { path: '/', icon: <FiHome />, label: 'Home' },
          { path: '/vote', icon: <FiFileText />, label: 'Vote' },
          { path: '/results', icon: <FiShield />, label: 'Results' }
        ].map((item) => (
          <motion.div
            key={item.path}
            whileHover={navItemHover}
            whileTap={navItemTap}
          >
            <Link
              to={item.path}
              style={{
                color: '#aaa',
                fontSize: '16px',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 15px',
                borderRadius: '8px'
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          </motion.div>
        ))}

        {/* Create Bounty Button */}
        <motion.div
          whileHover={navItemHover}
          whileTap={navItemTap}
          style={{ position: 'relative' }}
        >
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #4fd1c5, #38ef7d)',
              border: 'none',
              color: '#121212',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(79, 209, 197, 0.3)'
            }}
          >
            <FiPlusCircle /> Create Bounty
          </button>
        </motion.div>

        {/* My Bounties Dropdown */}
        <motion.div
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsMyBountiesOpen(true)}
          onMouseLeave={() => setIsMyBountiesOpen(false)}
        >
          <motion.button
            whileHover={navItemHover}
            whileTap={navItemTap}
            style={{
              background: 'none',
              border: 'none',
              color: '#aaa',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 15px',
              borderRadius: '8px'
            }}
          >
            <FiUser style={{ fontSize: '18px' }} />
            My Bounties
            <FiChevronDown style={{
              transition: 'transform 0.3s',
              transform: isMyBountiesOpen ? 'rotate(180deg)' : 'rotate(0)'
            }} />
          </motion.button>

          <AnimatePresence>
            {isMyBountiesOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#1e1e1e',
                  borderRadius: '12px',
                  padding: '20px',
                  minWidth: '350px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  zIndex: 1001
                }}
              >
                <div style={{
                  color: '#4fd1c5',
                  fontWeight: '600',
                  marginBottom: '5px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FiUser /> My Published Bounties
                </div>
                <div style={{ 
                  maxHeight: '300px',
                  overflowY: 'auto',
                  paddingRight: '10px'
                }}>
                  {myBounties.map(bounty => {
                    const status = getBountyStatus(bounty.dueDate);
                    return (
                      <motion.div
                        key={bounty._id}
                        whileHover={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}
                        style={{
                          padding: '15px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          borderLeft: `3px solid ${
                            status === 'expired' ? '#888' : 
                            status === 'ending soon' ? '#FFA500' : '#4fd1c5'
                          }`,
                          marginBottom: '10px'
                        }}
                        onClick={() => navigate(`/my-bounty/${bounty._id}`)}
                      >
                        <div style={{ 
                          color: 'white', 
                          fontWeight: '500',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          {bounty.name}
                          <span style={{ 
                            color: '#4fd1c5',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FiDollarSign /> {bounty.bountyAmount} ETH
                          </span>
                        </div>
                        <div style={{ 
                          color: '#aaa', 
                          fontSize: '13px',
                          marginTop: '5px'
                        }}>
                          Status: {status}
                        </div>
                        <div style={{ 
                          color: '#888', 
                          fontSize: '12px',
                          marginTop: '5px'
                        }}>
                          Due: {new Date(bounty.dueDate).toLocaleDateString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right section - User profile */}
      {userData && (
        <motion.div
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <motion.div
            whileHover={navItemHover}
            whileTap={navItemTap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              background: isProfileOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4fd1c5, #38ef7d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <FiChevronDown style={{
              transition: 'transform 0.3s',
              transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0)',
              color: '#aaa'
            }} />
          </motion.div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#1e1e1e',
                  borderRadius: '8px',
                  padding: '20px',
                  minWidth: '280px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  zIndex: 1001
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4fd1c5, #38ef7d)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ 
                      color: 'white', 
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>
                      {userData.name}
                    </div>
                    <div style={{ 
                      color: '#aaa', 
                      fontSize: '13px',
                      wordBreak: 'break-all'
                    }}>
                      {userData.email}
                    </div>
                  </div>
                </div>

                <div style={{
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  margin: '5px 0'
                }} />

                {[
                  { icon: <FiUser />, label: 'Profile', action: () => navigate('/profile') },
                  { icon: <FiAward />, label: 'My Bounties', action: () => setIsMyBountiesOpen(true) },
                  { icon: <FiShield />, label: 'Security', action: () => navigate('/security') }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#aaa'
                    }}
                    onClick={item.action}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.div>
                ))}

                <div style={{
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  margin: '5px 0'
                }} />

                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255, 75, 43, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#ff4b2b'
                  }}
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create Bounty Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2000
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                backgroundColor: '#1e1e1e',
                borderRadius: '12px',
                padding: '30px',
                width: '500px',
                maxWidth: '90%',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  color: '#4fd1c5',
                  margin: 0,
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FiPlusCircle /> Create New Bounty
                </h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#aaa',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  <FiX />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#aaa',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    Bounty Name
                  </label>
                  <input
                    type="text"
                    value={newBounty.name}
                    onChange={(e) => setNewBounty({...newBounty, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: '#121212',
                      color: 'white',
                      fontSize: '14px'
                    }}
                    placeholder="e.g. Uniswap V3 Audit"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#aaa',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    Code File
                  </label>
                  <div style={{
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="file"
                      onChange={(e) => setNewBounty({...newBounty, file: e.target.files[0]})}
                      style={{ display: 'none' }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer'
                    }}>
                      <FiFileText style={{ fontSize: '24px', color: '#4fd1c5' }} />
                      <span style={{ color: '#aaa' }}>
                        {newBounty.file ? newBounty.file.name : 'Click to upload code file'}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#aaa',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    Known Vulnerabilities (Optional)
                  </label>
                  <textarea
                    value={newBounty.vulnerabilities}
                    onChange={(e) => setNewBounty({...newBounty, vulnerabilities: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: '#121212',
                      color: 'white',
                      fontSize: '14px',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    placeholder="Describe any known vulnerabilities or areas of concern..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#aaa',
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newBounty.dueDate}
                      onChange={(e) => setNewBounty({...newBounty, dueDate: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: '#121212',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#aaa',
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      Bounty Amount (ETH)
                    </label>
                    <input
                      type="number"
                      value={newBounty.amount}
                      onChange={(e) => setNewBounty({...newBounty, amount: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: '#121212',
                        color: 'white',
                        fontSize: '14px'
                      }}
                      placeholder="e.g. 2.5"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#38b2ac' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateBounty}
                  disabled={!newBounty.name || !newBounty.file || !newBounty.dueDate || !newBounty.amount}
                  style={{
                    background: '#4fd1c5',
                    color: '#121212',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: (!newBounty.name || !newBounty.file || !newBounty.dueDate || !newBounty.amount) ? 0.7 : 1
                  }}
                >
                  <FiPlusCircle /> Publish Bounty
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
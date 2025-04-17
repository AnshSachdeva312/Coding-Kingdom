import React from "react";

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  button: {
    padding: "8px 16px",
    marginRight: "10px",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

const VoteCard = ({ title }) => (
  <div style={styles.card}>
    <div style={styles.title}>{title}</div>
    <div style={{ marginTop: "10px" }}>
      <button style={styles.button}>Vote Yes</button>
      <button style={styles.button}>Vote No</button>
    </div>
  </div>
);

export default VoteCard;
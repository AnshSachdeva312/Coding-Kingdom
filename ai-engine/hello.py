from flask import Flask, request, jsonify
import os
import uuid
import subprocess
import json
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
PROJECT_DIR = r"C:\Users\ANSH SACHDEVA\OneDrive\Desktop\auditai\ai-engine"
SLITHER_PATH = r"C:\Users\ANSH SACHDEVA\AppData\Local\Programs\Python\Python312\Scripts\slither.exe"
SOLC_PATH = r"C:\Users\ANSH SACHDEVA\.solcx\solc-v0.8.20\solc.exe"

def analyze_solidity_code(code):
    try:
        # Save file
        file_name = f"contract_{uuid.uuid4().hex}.sol"
        file_path = os.path.join(PROJECT_DIR, file_name)
        
        with open(file_path, "w", encoding='utf-8') as f:
            f.write(code)

        logger.info(f"[+] Solidity code saved to: {file_path}")

        # Run Slither
        cmd = [
            SLITHER_PATH,
            file_path,
            "--json", "-",
            "--fail-low",
            f"--solc={SOLC_PATH}",
            "--ignore-compile"
        ]

        logger.info(f"[+] Running Slither on file: {file_path}")
        result = subprocess.run(cmd, capture_output=True, text=True, shell=False)

        if result.returncode != 0:
            return {
                "error": "Slither failed",
                "stderr": result.stderr.strip(),
                "stdout": result.stdout.strip()
            }

        try:
            slither_output = json.loads(result.stdout)
        except json.JSONDecodeError:
            return {
                "error": "Slither output is not valid JSON",
                "stdout": result.stdout,
                "stderr": result.stderr
            }

        # Extract vulnerability info
        issues = []
        for detector in slither_output.get("results", {}).get("detectors", []):
            issues.append({
                "type": detector.get("check", "Unknown"),
                "severity": detector.get("impact", "Medium"),
                "description": detector.get("description", "No description"),
                "lines": detector.get("lines", [])
            })

        risk = "Low"
        if any(i["severity"] == "High" for i in issues):
            risk = "High"
        elif any(i["severity"] == "Medium" for i in issues):
            risk = "Medium"

        return {
            "file_path": file_path,
            "issues": issues,
            "risk": risk,
            "success": True
        }

    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}", exc_info=True)
        return {"error": str(e)}

@app.route('/analyze', methods=['POST'])
def analyze():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    code = request.json.get("code", "").strip()
    if not code:
        return jsonify({"error": "No Solidity code provided"}), 400

    result = analyze_solidity_code(code)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

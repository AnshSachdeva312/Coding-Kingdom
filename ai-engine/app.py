from flask import Flask, request, jsonify
import os
import uuid
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/create-temp', methods=['POST'])
def create_temp_solidity_file():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    code = request.json.get("code", "").strip()
    if not code:
        return jsonify({"error": "No code provided"}), 400

    try:
        # ✅ Custom path
        project_dir = r"C:\Users\ANSH SACHDEVA\OneDrive\Desktop\auditai\ai-engine"
        os.makedirs(project_dir, exist_ok=True)

        # ✅ Generate unique file name
        file_name = f"contract_{uuid.uuid4().hex}.sol"
        file_path = os.path.join(project_dir, file_name)

        # ✅ Write the file
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)
            f.flush()
            os.fsync(f.fileno())

        # ✅ Confirm by reading back
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        print(f"\n[+] Solidity file created at: {file_path}\n")
        print("[+] File contents:\n")
        print(content)

        return jsonify({
            "message": "File created and printed",
            "file_path": file_path,
            "content": content
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

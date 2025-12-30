# phase3_server.py — Phase 3 local server with debug logging
from flask import Flask, send_from_directory, Response
from flask_cors import CORS
import os
import mimetypes

# -----------------------------
# Project root (script lives here)
# -----------------------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Flask app, no static folder because we serve everything manually
app = Flask(__name__, static_folder=None)
CORS(app)  # allow all origins for local testing

# -----------------------------
# Serve any file from project root with debug
# -----------------------------
@app.route('/', defaults={'path': 'default.html'})
@app.route('/<path:path>')
def serve_file(path):
    full_path = os.path.join(BASE_DIR, path)

    # Debug logging
    print(f"[DEBUG] Requested URL path: {path}")
    print(f"[DEBUG] Full filesystem path: {full_path}")

    if not os.path.exists(full_path):
        print(f"[DEBUG] File not found: {full_path}")
        return "Not Found", 404

    # Determine MIME type
    mimetype, _ = mimetypes.guess_type(full_path)
    if path.endswith(".js"):
        mimetype = "application/javascript"

    print(f"[DEBUG] Serving with MIME type: {mimetype}")

    return send_from_directory(
        BASE_DIR,
        path,
        mimetype=mimetype
    )

# -----------------------------
# Run server
# -----------------------------
if __name__ == "__main__":
    print(f"[DEBUG] Serving from project root: {BASE_DIR}")
    app.run(debug=True)

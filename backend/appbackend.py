# appbackend.py
import os
import math
import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from collections import defaultdict
from typing import List, Dict

#firebase
FIREBASE_CRED_FILE = "firebase_credentials.json"
cred = credentials.Certificate(FIREBASE_CRED_FILE)
firebase_admin.initialize_app(cred)
db = firestore.client()

API_KEY = "AIzaSyAu7EaCkPbYZ4lacxmtaSkkaX261GN3EGs"

app = Flask(__name__)
CORS(app)

# utilities
def doc_to_obj(doc):
    d = doc.to_dict() or {}
    d["id"] = doc.id
    return d

def safe_get_json(required=[]):
    data = request.get_json(silent=True) or {}
    for key in required:
        if key not in data:
            return None, jsonify({"error": f"Missing field: {key}"}), 400
    return data, None, None

# similarity
def cosine_similarity(v1, v2):
    if not v1 or not v2: return 0
    if len(v1) != len(v2): return 0
    dot = sum(a*b for a,b in zip(v1,v2))
    mag1 = math.sqrt(sum(a*a for a in v1))
    mag2 = math.sqrt(sum(a*a for a in v2))
    if mag1 == 0 or mag2 == 0: return 0
    return dot / (mag1 * mag2)

def compute_similarity(target_vec, all_vectors, all_names, target_name, all_roles, target_role, project_goal_roles):
    results = []
    for vec, name, role in zip(all_vectors, all_names, all_roles):
        sim = cosine_similarity(target_vec, vec) * 100  # 0–100%
        role_bonus = 20 if role in project_goal_roles else 0
        total_score = sim + role_bonus

        results.append({
            "name": name,
            "role": role,
            "match_percentage": round(total_score, 2),
            "skill_score": round(sim, 2),
            "role_bonus": role_bonus
        })

    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results[:3]

#root/home
@app.route("/")
def home():
    return jsonify({"message": "Backend running successfully"}), 200

#signup
@app.route("/signup", methods=["POST"])
def signup():
    data, err, code = safe_get_json(required=["email", "password"])
    if err: return err, code

    email = data["email"]
    password = data["password"]

    try:
        user = auth.create_user(email=email, password=password)
        db.collection("users").document(user.uid).set({
            "email": email,
            "username": email.split("@")[0],
            "bio": "",
            "skills": [],
            "interests": [],
            "xp": 0,
            "level": 1,
            "created_at": firestore.SERVER_TIMESTAMP
        })
        return jsonify({"uid": user.uid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

#login
@app.route("/login", methods=["POST"])
def login():
    data, err, code = safe_get_json(required=["email", "password"])
    if err: return err, code

    payload = {
        "email": data["email"],
        "password": data["password"],
        "returnSecureToken": True
    }

    resp = requests.post(
        f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}",
        json=payload
    ).json()

    if "error" in resp:
        return jsonify({"error": resp["error"]["message"]}), 400

    return jsonify({"uid": resp["localId"]}), 200

# profile
@app.route("/users/<uid>", methods=["GET"])
def get_user(uid):
    try:
        doc = db.collection("users").document(uid).get()
        if not doc.exists:
            return jsonify({"error": "User not found"}), 404

        d = doc.to_dict()
        return jsonify({
            "id": uid,
            "email": d.get("email"),
            "username": d.get("username"),
            "bio": d.get("bio", ""),
            "skills": d.get("skills", []),
            "interests": d.get("interests", []),
            "xp": d.get("xp", 0),
            "level": d.get("level", 1)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/users/<uid>", methods=["PUT"])
def update_user(uid):
    data = request.get_json() or {}
    try:
        db.collection("users").document(uid).update(data)
        return jsonify({"message": "User updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# projects
@app.route("/projects", methods=["POST"])
def create_project():
    data, err, code = safe_get_json(required=["name", "created_by"])
    if err: return err, code

    ref = db.collection("projects").add({
        "name": data["name"],
        "created_by": data["created_by"],
        "created_at": firestore.SERVER_TIMESTAMP
    })

    return jsonify({"project_id": ref[1].id}), 201


@app.route("/user/<uid>/projects", methods=["GET"])
def get_user_projects(uid):
    try:
        docs = db.collection("projects").where("created_by", "==", uid).stream()
        return jsonify({"projects": [doc_to_obj(d) for d in docs]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# tasks
@app.route("/projects/<project_id>/tasks", methods=["GET"])
def get_tasks(project_id):
    docs = db.collection("projects").document(project_id).collection("tasks").stream()
    return jsonify({"tasks": [doc_to_obj(d) for d in docs]}), 200


@app.route("/projects/<project_id>/tasks", methods=["POST"])
def create_task(project_id):
    data, err, code = safe_get_json(required=["title", "status"])
    if err: return err, code

    ref = db.collection("projects").document(project_id).collection("tasks").add({
        "title": data["title"],
        "description": data.get("description", ""),
        "status": data["status"],
        "created_at": firestore.SERVER_TIMESTAMP
    })

    return jsonify({"task_id": ref[1].id}), 201

# Update Task
@app.route("/projects/<project_id>/tasks/<task_id>", methods=["PUT"])
def update_task(project_id, task_id):
    data = request.get_json() or {}

    task_ref = db.collection("projects").document(project_id).collection("tasks").document(task_id)
    task_doc = task_ref.get()

    if not task_doc.exists:
        return jsonify({"error": "Task not found"}), 404

    task_ref.update(data)
    return jsonify({"message": "Task updated"}), 200

# Delete Task
@app.route("/projects/<project_id>/tasks/<task_id>", methods=["DELETE"])
def delete_task(project_id, task_id):
    db.collection("projects").document(project_id).collection("tasks").document(task_id).delete()
    return jsonify({"message": "Task deleted"}), 200

#collaborator connection
@app.route("/connect/send", methods=["POST"])
def send_connection():
    data, err, code = safe_get_json(required=["from", "to"])
    if err: return err, code

    ref = db.collection("connections").add({
        "from": data["from"],
        "to": data["to"],
        "status": "pending",
        "created_at": firestore.SERVER_TIMESTAMP
    })

    return jsonify({"request_id": ref[1].id}), 201


@app.route("/connect/requests/<uid>", methods=["GET"])
def get_requests(uid):
    docs = db.collection("connections").where("to", "==", uid).where("status", "==", "pending").stream()
    return jsonify({"requests": [doc_to_obj(d) for d in docs]}), 200


@app.route("/connect/accept/<req_id>", methods=["PUT"])
def accept_request(req_id):
    db.collection("connections").document(req_id).update({
        "status": "accepted",
        "responded_at": firestore.SERVER_TIMESTAMP
    })
    return jsonify({"message": "Connection accepted"}), 200


@app.route("/connect/reject/<req_id>", methods=["PUT"])
def reject_request(req_id):
    db.collection("connections").document(req_id).update({
        "status": "rejected",
        "responded_at": firestore.SERVER_TIMESTAMP
    })
    return jsonify({"message": "Connection rejected"}), 200

# peer review
@app.route("/reviews", methods=["POST"])
def submit_review():
    data, err, code = safe_get_json(required=["reviewer", "reviewee", "team_id", "scores"])
    if err: return err, code

    ref = db.collection("peer_reviews").add({
        "reviewer": data["reviewer"],
        "reviewee": data["reviewee"],
        "team_id": data["team_id"],
        "scores": data["scores"],
        "comments": data.get("comments"),
        "created_at": firestore.SERVER_TIMESTAMP
    })

    return jsonify({"review_id": ref[1].id}), 201


# quiz system
@app.route("/create_quiz", methods=["POST"])
def create_quiz():
    data, err, code = safe_get_json(required=["project_id"])
    if err: return err, code

    questions = data.get("questions", [])
    if len(questions) != 10:
        return jsonify({"error": "Quiz must have exactly 10 questions"}), 400

    for q in questions:
        if len(q.get("options", [])) != 4:
            return jsonify({"error": "Each question must have 4 options"}), 400
        if q.get("correct_answer") not in q.get("options"):
            return jsonify({"error": "Correct answer must be one of the options"}), 400

    ref = db.collection("projects").document(data["project_id"]).collection("quizzes").add({
        "questions": questions,
        "created_at": firestore.SERVER_TIMESTAMP
    })

    return jsonify({"quiz_id": ref[1].id}), 201


@app.route("/send_quiz", methods=["POST"])
def send_quiz():
    data, err, code = safe_get_json(required=["project_id", "quiz_id", "target_uid"])
    if err: return err, code

    db.collection("projects").document(data["project_id"]).collection("connections").document(data["target_uid"]).set({
        "quiz_id": data["quiz_id"],
        "status": "pending",
        "score": -1,
        "sent_at": firestore.SERVER_TIMESTAMP
    })

    return jsonify({"message": "Quiz sent"}), 200


@app.route("/submit_quiz", methods=["POST"])
def submit_quiz():
    data, err, code = safe_get_json(required=["project_id", "quiz_id", "uid", "answers"])
    if err: return err, code

    quiz_doc = db.collection("projects").document(data["project_id"]).collection("quizzes").document(data["quiz_id"]).get()
    if not quiz_doc.exists():
        return jsonify({"error": "Quiz not found"}), 404

    quiz = quiz_doc.to_dict()
    qs = quiz.get("questions", [])

    score = 0
    for i, q in enumerate(qs):
        correct = q["correct_answer"].lower().strip()
        selected = data["answers"][i]["answer"].lower().strip()
        if correct == selected:
            score += 1

    db.collection("projects").document(data["project_id"]).collection("connections").document(data["uid"]).update({
        "answers": data["answers"],
        "score": score,
        "status": "completed"
    })

    return jsonify({"score": score}), 200


@app.route("/recommend_connection", methods=["POST"])
def recommend_connection():
    data, err, code = safe_get_json(required=["project_id"])
    if err: return err, code

    docs = db.collection("projects").document(data["project_id"]).collection("connections").stream()
    best = None
    best_score = -1

    for d in docs:
        row = d.to_dict()
        if row.get("score", -1) > best_score:
            best_score = row["score"]
            best = row

    return jsonify({"best_connection": best, "best_score": best_score}), 200

#server
if __name__ == "__main__":
    app.run(debug=True)

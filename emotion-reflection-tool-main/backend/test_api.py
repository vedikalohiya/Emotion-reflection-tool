import requests
import time
import json

BASE_URL = "http://localhost:8000"

def wait_for_server():
    for _ in range(10):
        try:
            r = requests.get(f"{BASE_URL}/health")
            if r.status_code == 200:
                print("Server is up!")
                return True
        except:
            time.sleep(0.5)
    print("Server failed to start.")
    return False

def test_analyze():
    print("Testing /analyze...")
    payload = {"text": "I am feeling very happy and excited today!"}
    r = requests.post(f"{BASE_URL}/analyze", json=payload)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.status_code == 200
    data = r.json()
    assert data["emotion"] in ["Happy", "Excited"]
    assert "quote" in data
    return data

def test_history():
    print("Testing /history...")
    r = requests.get(f"{BASE_URL}/history")
    print(f"Status: {r.status_code}")
    data = r.json()
    print(f"History items: {len(data)}")
    assert r.status_code == 200
    assert len(data) > 0
    assert data[0]["text"] == "I am feeling very happy and excited today!"

if __name__ == "__main__":
    if wait_for_server():
        test_analyze()
        test_history()
        print("All tests passed!")

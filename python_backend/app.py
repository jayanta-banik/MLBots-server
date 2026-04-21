import uvicorn
from fastapi import FastAPI

app = FastAPI(title="MLBots Python Backend")


@app.get("/")
def get_root():
    return {
        "service": "python_backend",
        "status": "ok",
        "message": "Dummy FastAPI server is running.",
    }


@app.get("/api/status")
def get_status():
    return {
        "status": "OK",
        "service": "python_backend",
        "version": "0.0.1",
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)

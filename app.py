import uvicorn

from python_backend import createApp

app = createApp()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)

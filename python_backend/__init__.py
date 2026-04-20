from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from python_backend.middleware.requestLogger import registerRequestLogger
from python_backend.routes import registerRoutes

PACKAGE_ROOT = Path(__file__).resolve().parent
STATIC_FOLDER = PACKAGE_ROOT.parent / "static"


def createApp():
    app = FastAPI(title="MLBots Python Backend")

    app.mount("/static", StaticFiles(directory=str(STATIC_FOLDER)), name="static")

    registerRequestLogger(app)
    registerRoutes(app)

    return app

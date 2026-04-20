from python_backend.routes.healthRoutes import healthRouter

API_PREFIX = "/api/python"


def registerRoutes(app):
    app.include_router(healthRouter, prefix=API_PREFIX)

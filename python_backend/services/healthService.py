from python_backend.models.healthModel import buildHealthModel

SERVICE_NAME = "python_backend"
SERVICE_STATUS = "ok"


def getHealthPayload():
    return buildHealthModel(serviceName=SERVICE_NAME, status=SERVICE_STATUS)

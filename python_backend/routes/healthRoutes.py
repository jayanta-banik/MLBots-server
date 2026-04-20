from fastapi import APIRouter

from python_backend.services.healthService import getHealthPayload
from python_backend.utils.jsonResponse import buildJsonResponse

healthRouter = APIRouter()


@healthRouter.get("/health")
def getHealth():
    return buildJsonResponse(getHealthPayload())

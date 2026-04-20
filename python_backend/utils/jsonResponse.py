from fastapi.responses import JSONResponse

DEFAULT_STATUS_CODE = 200


def buildJsonResponse(payload, statusCode=DEFAULT_STATUS_CODE):
    return JSONResponse(content=payload, status_code=statusCode)

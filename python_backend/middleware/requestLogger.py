from time import perf_counter

REQUEST_LOG_PREFIX = "[python_backend]"


def registerRequestLogger(app):
    @app.middleware("http")
    async def writeRequestLog(request, call_next):
        requestStartTime = perf_counter()
        response = await call_next(request)
        durationMs = (perf_counter() - requestStartTime) * 1000

        print(f"{REQUEST_LOG_PREFIX} {request.method} {request.url.path} {response.status_code} {durationMs:.2f}ms")
        return response

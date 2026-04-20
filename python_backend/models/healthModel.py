from datetime import UTC, datetime


def buildHealthModel(serviceName, status):
    return {
        "serviceName": serviceName,
        "status": status,
        "timestamp": datetime.now(UTC).isoformat(),
        "message": f"{serviceName} is responding.",
    }

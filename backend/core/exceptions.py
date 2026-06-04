from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

class BusinessLogicException(Exception):
    def __init__(self, name: str, detail: str):
        self.name = name
        self.detail = detail

async def business_logic_exception_handler(request: Request, exc: BusinessLogicException):
    logger.error(f"BusinessLogicError: {exc.name} - {exc.detail}")
    return JSONResponse(
        status_code=400,
        content={"message": f"Business Rule Violation: {exc.name}", "detail": exc.detail},
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"ValidationError: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"DatabaseError: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error related to the database."},
    )

def setup_exception_handlers(app):
    app.add_exception_handler(BusinessLogicException, business_logic_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)

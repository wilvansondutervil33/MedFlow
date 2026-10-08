from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, hospital, equipment, order, report, technician, user, analytics
from app.config import settings

FRONTEND_ORIGIN = settings.frontend_origin

app = FastAPI(
    title= "Med-Flow Command Center",
    description=" This is scound app",
    version= "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:5173"],
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(hospital.router)
app.include_router(equipment.router)
app.include_router(order.router)
app.include_router(report.router)
app.include_router(technician.router)
app.include_router(user.router)
app.include_router(analytics.router)


@app.get("/heath", tags=["heath"])
async def heath() -> dict[str, str]:
    return {'status': 'OK'}

# Handle DB errors 
@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={"detail": "A database constraint was violated"}
    )

@app.exception_handler(Exception)
async def unhandled_errors(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code= 500,
        content={"detail": "An unexpected error has occured."}
    )
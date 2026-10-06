from decimal import Decimal
from fastapi.responses import Response
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import ServiceReport, User, UserRole
from app.schemas.report import ReportCreate, ReportRead, ReportUpdate

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("", response_model=list[ReportRead], status_code= status.HTTP_200_OK)
async def get_list_reports(db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> list[ServiceReport]:
    statment = select(ServiceReport)
    res = await db.execute(statment)
    return list(res.scalars().all())

@router.get("/{rid}", response_model=ReportRead, status_code= status.HTTP_200_OK)
async def get_report(rid:int, db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> ServiceReport:
    rep = await db.get(ServiceReport, rid) 

    if rep == None:
        raise HTTPException(
                    status_code= status.HTTP_404_NOT_FOUND,
                    detail= f"Service Report {rid} is not found"
                )
    return rep

@router.post("", response_model=ReportCreate, status_code= status.HTTP_201_CREATED)
async def create_report(payload: ReportCreate ,db: AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN, UserRole.FIELD_TECHNICIAN))) -> ServiceReport:
    
    rep = ServiceReport(**payload.model_dump())
    db.add(rep)
    await db.commit()
    await db.refresh(rep)

    return rep

@router.put("/{rid}", response_model=ReportUpdate, status_code= status.HTTP_202_ACCEPTED)
async def update_report(rid:int, payload: ReportUpdate ,db: AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> ServiceReport:
    
    rep = await db.get(ServiceReport, rid)

    rep.filr_url = payload.filr_url
    rep.note = payload.note
    rep.order_id = payload.order_id

    db.add(rep)
    await db.commit()
    await db.refresh(rep)
    return rep

@router.delete("/{rid}", status_code= status.HTTP_204_NO_CONTENT)
async def delete_report(rid:int, db:AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))):

    rep = await db.get(ServiceReport, rid)
    await db.delete(rep)
    await db.commit()

    return Response(status_code=204)

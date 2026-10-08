from decimal import Decimal
from fastapi.responses import Response
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import Technician, User, UserRole
from app.schemas.technician import TechnicianCreate, TechnicianRead, TechnicianUpdate

router = APIRouter(prefix="/technicians", tags=["technicians"])

@router.get("", response_model=list[TechnicianRead], status_code= status.HTTP_200_OK)
async def get_list_technicians(db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> list[Technician]:
    statment = select(Technician)
    res = await db.execute(statment)
    return list(res.scalars().all())

@router.get("/{tid}", response_model=TechnicianRead, status_code= status.HTTP_200_OK)
async def get_technician(tid:int, db:AsyncSession =  Depends(get_db), _:User = Depends(get_current_user)) -> Technician:
    tec = await db.get(Technician, tid) 

    if tec == None:
        raise HTTPException(
                    status_code= status.HTTP_404_NOT_FOUND,
                    detail= f"Technician {tid} is not found"
                )
    return tec

@router.post("", response_model=TechnicianCreate, status_code= status.HTTP_201_CREATED)
async def create_technician(payload: TechnicianCreate ,db: AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> Technician:
    
    tec = Technician(**payload.model_dump())
    db.add(tec)
    await db.commit()
    await db.refresh(tec)

    return tec

@router.put("/{tid}", response_model=TechnicianUpdate, status_code= status.HTTP_202_ACCEPTED)
async def update_technician(tid:int, payload: TechnicianUpdate ,db: AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))) -> Technician:
    
    tec = await db.get(Technician, tid)

    tec.hospital_id = payload.hospital_id
    tec.name = payload.name

    db.add(tec)
    await db.commit()
    await db.refresh(tec)
    return tec

@router.delete("/{tid}", status_code= status.HTTP_204_NO_CONTENT)
async def delete_technician(tid:int, db:AsyncSession = Depends(get_db), _:User = Depends(require_role(UserRole.CLINICAL_ADMIN))):

    tec = await db.get(Technician, tid)
    await db.delete(tec)
    await db.commit()

    return Response(status_code=204)

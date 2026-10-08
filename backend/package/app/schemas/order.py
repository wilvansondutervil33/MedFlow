from pydantic import BaseModel, ConfigDict, Field

class OrderBase(BaseModel):
    title: str = Field(min_length= 3, max_length= 50)
    priorty: str = Field(min_length=1, max_length= 50)
    status: str
    technician_id:int
    equipment_id: int

class OrderCreate(OrderBase):
    "Same Fields"

class OrderRead(OrderBase):
    id:int

    model_config = ConfigDict(from_attributes=True)

class OrderUpdate(OrderBase):
    "Same Fields"

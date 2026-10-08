from pydantic import BaseModel, ConfigDict, Field

class EquipmentBase(BaseModel):
    serial_number: str = Field(min_length= 3, max_length= 50)
    model: str = Field(min_length=1, max_length= 50)
    charge_level: float = Field(ge= 0, le = 100)
    status:str
    hospital_id: int
    
class EquipmentCreate(EquipmentBase):
    "Same Fields"

class EquipmentRead(EquipmentBase):
    id:int

    model_config = ConfigDict(from_attributes=True)

class EquipmentUpdate(EquipmentBase):
    "Same Fields"

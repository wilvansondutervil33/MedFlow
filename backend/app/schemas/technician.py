from pydantic import BaseModel, ConfigDict, Field

class TechnicianBase(BaseModel):
    name: str = Field(min_length= 3, max_length= 50)
    hospital_id: int
    
class TechnicianCreate(TechnicianBase):
    "Same Fields"

class TechnicianRead(TechnicianBase):
    id:int

    model_config = ConfigDict(from_attributes=True)

class TechnicianUpdate(TechnicianBase):
    "Same Fields"

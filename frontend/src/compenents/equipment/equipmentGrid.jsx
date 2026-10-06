import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from '@mui/material/Link';
import { Alert, Box, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import apiClient from '../../api/client.js';
//import PieChart from '../chart/piechart.jsx';

const baseColumns = [
    {field: 'id', headername: 'ID', width:70, flex:1},
    {field : 'serial_number', headername: 'Serial Number', width: 150, flex: 1},
    {field: 'model', headername: 'Model', width: 160, flex: 1},
    {field: 'status', headername: 'Status', width: 160, flex: 1},
    {field: 'charge_level', headername: "Charge Level", width:120, type: 'number', flex: 1},
    {field: 'hospital_id', headername: "Hospital Id", width:120, type: 'number', flex: 1}
]


const STATUS_OPTIONS = ['Available', 'In-Use', 'Maintenance', 'Offline']

function EquipmentGrid({onSuccess, role, hospital_id}){
    const [equipments, setEquipments] = useState([])
    const [id, setId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [adddialogOpen, setaddDialogOpen] = useState(false);
    const [editdialogOpen, seteditDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        serial_number: '',
        model: '',
        status: 'Offline',
        charge_level: "",
        hospital_id: '',
    });

    const actionColumns = [
        {field: 'actions', type: 'actions', headername: 'Actions', width:100, 
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={()=>{
                        setId(params.row.id)
                        setFormValues({
                            serial_number: params.row.serial_number,
                            model: params.row.model,
                            status: params.row.status,
                            charge_level: params.row.charge_level,
                            hospital_id: params.row.hospital_id,
                        })
                        
                    seteditDialogOpen(true)}}/>,
                    <GridActionsCellItem
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={() => handleDelete(params.row.id)}/>
                ]
        }
    ]

    const columns = role == 'Clinical Admin' ? [...baseColumns, ...actionColumns] : baseColumns;

    async function fetchEquipment() {
        setLoading(true);
        try{
            const res = await apiClient.get('/equipments'); 
            setEquipments(res.data.filter(n => n.hospital_id == parseInt(hospital_id)));
            console.log(res)
            setError(null);
        }catch(e){
            console.log("Could not fetch your information")
        }finally{
            setLoading(false)

        }
    }

    useEffect(()=> {
        fetchEquipment()
    }, []);

    const handleFieldChange = (field) => (event) => {
      setFormValues((prev)=> ({ ...prev, [field]: event.target.value}));
    }

    const handleCreate = async() => {
        try {
            await apiClient.post('/equipments', {
                ...formValues,
            charge_level: Number(formValues.charge_level),
            hospital_id: Number(formValues.hospital_id),
            });
            setaddDialogOpen(false);
            onSuccess(`Equipment ${formValues.serial_number} created.`);
            setFormValues({serial_number: '', model: '', status: 'Offline', charge_level: '', hospital_id: ''});
            await fetchEquipment(); //see the table data refreshed with the new robot
        } catch {
            //a real app would surface this inline in the dialog
        }
    }

    const handleEdit = async() => {
        try {
            await apiClient.put(`/equipments/${id}`, {
                ...formValues,
            //id : id,
            charge_level: Number(formValues.charge_level),
            hospital_id: Number(formValues.hospital_id),
            });
            seteditDialogOpen(false);
            setId(0)
            onSuccess(`Equipment ${formValues.serial_number} Edited.`);
            setFormValues({serial_number: '', model: '', status: '', charge_level: '', hospital_id: ''});
            await fetchEquipment(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    const handleDelete = async(equipmentid) => {
        try {
            await apiClient.delete(`/equipments/${equipmentid}`);

            onSuccess(`Equipment Deleted.`);
            await fetchEquipment(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    if (loading) return <CircularProgress/>

    if (error) return <Alert severity='error'>{error}</Alert>

    return(
        <Box> 
            {role == 'Clinical Admin' && (<Button variant="outlined" sx={{ mb: 2}} onClick={() => setaddDialogOpen(true)}>Add Equipment</Button>)}
            <Box sx={{height:400, width: '100%', display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
                <DataGrid rows={equipments} columns={columns} getRowId={(row) => row.id} />
            </Box>
            <Dialog open={adddialogOpen} onClose={() => setaddDialogOpen(false)}>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                        <TextField label="Serial Number" value={formValues.serial_number} onChange={handleFieldChange('serial_number')} />
                        <TextField label="Model" value={formValues.model} onChange={handleFieldChange('model')} />
                        <TextField label="Charge Level" type="number" value={formValues.charge_level} onChange={handleFieldChange('charge_level')} />
                        <TextField label="Hospital ID" type="number" value={formValues.hospital_id} onChange={handleFieldChange('hospital_id')} />
                        <TextField select label="Status" value={formValues.status} onChange={handleFieldChange('status')}>
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                        <DialogActions>
                        <Button onClick={() => setaddDialogOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreate}>Create</Button>
                        </DialogActions>

            </Dialog>

            <Dialog open={editdialogOpen} onClose={() => seteditDialogOpen(false)} >
                <DialogTitle>Edit Equipment</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                        <TextField label="Serial Number" value={formValues.serial_number} onChange={handleFieldChange('serial_number')} />
                        <TextField label="Model" value={formValues.model} onChange={handleFieldChange('model')} />
                        <TextField label="Charge Level" type="number" value={formValues.charge_level} onChange={handleFieldChange('charge_level')} />
                        <TextField label="Hospital ID" type="number" value={formValues.hospital_id} onChange={handleFieldChange('hospital_id')} />
                        <TextField label="Status" value={formValues.status} onChange={handleFieldChange('status')}>
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                        <DialogActions>
                        <Button onClick={() => {
                            setFormValues({
                                            serial_number: '',
                                            model: '',
                                            status: 'Offline',
                                            charge_level: "",
                                            hospital_id: '',
                                        })
                            seteditDialogOpen(false)}}>Cancel</Button>
                        <Button variant="contained" onClick={handleEdit}>Edit</Button>
                        </DialogActions>

            </Dialog> 
        </Box>
    )
}

export default EquipmentGrid;
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
    {field : 'name', headername: 'Name', width: 150, flex: 1},
    {field: 'location_region', headername: 'Location Region', width: 160, flex: 1},
    {field: 'capacity', headername: "Capacity", width:120, type: 'number', flex: 1},
    {field: 'supervisor_id', headername: "Supervisor Id", width:120, type: 'number', flex: 1}
]

function HospitalGrid({onSuccess, role}){
    const [hospitals, setHospitals] = useState([])
    const [id, setId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [adddialogOpen, setaddDialogOpen] = useState(false);
    const [editdialogOpen, seteditDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        location_region: '',
        capacity: '',
        supervisor_id: '',
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
                            name: params.row.name,
                            location_region: params.row.location_region,
                            capacity: params.row.capacity,
                            supervisor_id: params.row.supervisor_id,
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

    async function fetchHospital() {
        setLoading(true);
        try{
            const res = await apiClient.get('/hospitals');
            setHospitals(res.data);
            setError(null);
        }catch(e){
            console.log("Could not fetch your information")
        }finally{
            setLoading(false)

        }
    }

    useEffect(()=> {
        fetchHospital()
    }, []);

    const handleFieldChange = (field) => (event) => {
      setFormValues((prev)=> ({ ...prev, [field]: event.target.value}));
    }

    const handleCreate = async() => {
        try {
            await apiClient.post('/hospitals', {
                ...formValues,
            capacity: Number(formValues.capacity),
            supervisor_id: Number(formValues.supervisor_id),
            });
            setaddDialogOpen(false);
            onSuccess(`Hospital ${formValues.name} created.`);
            setFormValues({name: '', location_region: '', capacity: '', supervisor_id: ''});
            await fetchHospital(); //see the table data refreshed with the new robot
        } catch {
            //a real app would surface this inline in the dialog
        }
    }

    const handleEdit = async() => {
        try {
            await apiClient.put(`/hospitals/${id}`, {
                ...formValues,
            //id : id,
            capacity: Number(formValues.capacity),
            supervisor_id: Number(formValues.supervisor_id),
            });
            seteditDialogOpen(false);
            setId(0)
            onSuccess(`Hospital ${formValues.name} Edited.`);
            setFormValues({name: '', location_region: '', capacity: '', supervisor_id: ''});
            await fetchHospital(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    const handleDelete = async(hospitalid) => {
        try {
            await apiClient.delete(`/hospitals/${hospitalid}`);

            onSuccess(`Hospital Deleted.`);
            await fetchHospital(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    if (loading) return <CircularProgress/>

    if (error) return <Alert severity='error'>{error}</Alert>

    return(
        <Box>
            {role == 'Clinical Admin' && (<Button variant="outlined" sx={{ mb: 2}} onClick={() => setaddDialogOpen(true)}>Add Hospital</Button>)}
            <Box sx={{height:400, width: '100%', display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
                <DataGrid rows={hospitals} columns={columns} getRowId={(row) => row.id} />
            </Box>
            <Dialog open={adddialogOpen} onClose={() => setaddDialogOpen(false)}>
                <DialogTitle>Add New Hospital</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                    <TextField label="Name" value={formValues.name} onChange={handleFieldChange('name')} />
                    <TextField label="Location Region" value={formValues.location_region} onChange={handleFieldChange('location_region')} />
                    <TextField label="Capacity" type="number" value={formValues.capacity} onChange={handleFieldChange('capacity')} />
                    <TextField label="Supervisor ID" type="number" value={formValues.supervisor_id} onChange={handleFieldChange('supervisor_id')} />
                    </Stack>
                </DialogContent>
                        <DialogActions>
                        <Button onClick={() => setaddDialogOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreate}>Create</Button>
                        </DialogActions>

            </Dialog>

            <Dialog open={editdialogOpen} onClose={() => seteditDialogOpen(false)} >
                <DialogTitle>Edit Hospital</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                        <TextField label="Name" value={formValues.name} onChange={handleFieldChange('name')} />
                        <TextField label="Location Region" value={formValues.location_region} onChange={handleFieldChange('location_region')} />
                        <TextField label="Capacity" type="number" value={formValues.capacity} onChange={handleFieldChange('capacity')} />
                        <TextField label="Supervisor ID" type="number" value={formValues.supervisor_id} onChange={handleFieldChange('supervisor_id')} />
                    </Stack>
                </DialogContent>
                        <DialogActions>
                        <Button onClick={() => {
                            setFormValues({
                                            name: '',
                                            location_region: '',
                                            capacity: '',
                                            supervisor_id: '',
                                        })
                            seteditDialogOpen(false)}}>Cancel</Button>
                        <Button variant="contained" onClick={handleEdit}>Edit</Button>
                        </DialogActions>

            </Dialog> 
        </Box>
    )
}

export default HospitalGrid;
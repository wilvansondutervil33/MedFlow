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
    {field : 'title', headername: 'Serial Number', width: 150, flex: 1},
    {field: 'priorty', headername: 'Model', width: 160, flex: 1},
    {field: 'status', headername: 'Status', width: 160, flex: 1},
    {field: 'technician_id', headername: "Charge Level", width:120, type: 'number', flex: 1},
    {field: 'equipment_id', headername: "Hospital Id", width:120, type: 'number', flex: 1}
]



const STATUS_OPTIONS = ['Pending', 'In-Progress', 'Completed', 'Failed']
const PRIORITY_OPTIONS = ['Low', 'Medium', 'Critical']

function OrderGrid({onSuccess, role}){
    const [orders, setOrders] = useState([])
    const [id, setId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [adddialogOpen, setaddDialogOpen] = useState(false);
    const [editdialogOpen, seteditDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        title: '',
        priorty: 'Low',
        status: 'Pending',
        technician_id: "",
        equipment_id: '',
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
                            title: params.row.title,
                            priorty: params.row.priorty,
                            status: params.row.status,
                            technician_id: params.row.technician_id,
                            equipment_id: params.row.equipment_id,
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

    async function fetchOrder() {
        setLoading(true);
        try{
            const res = await apiClient.get('/orders');
            setOrders(res.data);
            setError(null);
        }catch(e){
            console.log("Could not fetch your information")
        }finally{
            setLoading(false)

        }
    }

    useEffect(()=> {
        fetchOrder()
    }, []);

    const handleFieldChange = (field) => (event) => {
      setFormValues((prev)=> ({ ...prev, [field]: event.target.value}));
    }

    const handleCreate = async() => {
        try {
            await apiClient.post('/orders', {
                ...formValues,
            technician_id: Number(formValues.technician_id),
            equipment_id: Number(formValues.equipment_id),
            });
            setaddDialogOpen(false);
            onSuccess(`Order ${formValues.title} created.`);
            setFormValues({title: '', priorty: 'Low', status: 'Pending', technician_id: '', equipment_id: ''});
            await fetchOrder(); //see the table data refreshed with the new robot
        } catch {
            //a real app would surface this inline in the dialog
        }
    }

    const handleEdit = async() => {
        try {
            await apiClient.put(`/orders/${id}`, {
                ...formValues,
            //id : id,
            technician_id: Number(formValues.technician_id),
            equipment_id: Number(formValues.equipment_id),
            });
            seteditDialogOpen(false);
            setId(0)
            onSuccess(`Order ${formValues.title} Edited.`);
            setFormValues({title: '', priorty: 'Low', status: 'Pending', technician_id: '', equipment_id: ''});
            await fetchOrder(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    const handleDelete = async(orderid) => {
        try {
            await apiClient.delete(`/orders/${orderid}`);

            onSuccess(`Order Deleted.`);
            await fetchOrder(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    if (loading) return <CircularProgress/>

    if (error) return <Alert severity='error'>{error}</Alert>

    return(
        <Box>
            {role == 'Clinical Admin' && (<Button variant="outlined" sx={{ mb: 2}} onClick={() => setaddDialogOpen(true)}>Add Work Order</Button>)}
            <Box sx={{height:400, width: '100%', display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
                <DataGrid rows={orders} columns={columns} getRowId={(row) => row.id} />
            </Box>
            <Dialog open={adddialogOpen} onClose={() => setaddDialogOpen(false)}>
                <DialogTitle>Add New Work Order</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                        <TextField label="Title" value={formValues.title} onChange={handleFieldChange('title')} />
                        <TextField label="Technician ID" type="number" value={formValues.technician_id} onChange={handleFieldChange('technician_id')} />
                        <TextField label="Equipment ID" type="number" value={formValues.equipment_id} onChange={handleFieldChange('equipment_id')} />
                        <TextField select label="Priorty" value={formValues.priorty} onChange={handleFieldChange('priorty')}>
                            {PRIORITY_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
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
                <DialogTitle>Edit Work Order</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                        <TextField label="Title" value={formValues.title} onChange={handleFieldChange('title')} />
                        <TextField label="Technician ID" type="number" value={formValues.technician_id} onChange={handleFieldChange('technician_id')} />
                        <TextField label="Equipment ID" type="number" value={formValues.equipment_id} onChange={handleFieldChange('equipment_id')} />
                        <TextField select label="Priorty" value={formValues.priorty} onChange={handleFieldChange('priorty')}>
                            {PRIORITY_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                        <TextField select label="Status" value={formValues.status} onChange={handleFieldChange('status')}>
                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                        <DialogActions>
                        <Button onClick={() => {
                            setFormValues({
                                            title: '',
                                            priorty: 'Low',
                                            status: 'Pending',
                                            technician_id: "",
                                            equipment_id: '',
                                        })
                            seteditDialogOpen(false)}}>Cancel</Button>
                        <Button variant="contained" onClick={handleEdit}>Edit</Button>
                        </DialogActions>

            </Dialog> 
        </Box>
    )
}

export default OrderGrid;
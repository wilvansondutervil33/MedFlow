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
    {field : 'filr_url', headername: 'File URL', width: 150, flex: 1},
    {field: 'note', headername: 'Note', width: 160, flex: 1},
    {field: 'order_id', headername: "Order Id", width:120, type: 'number', flex: 1}
]

function ReportGrid({onSuccess, role}){
    const [reports, setReports] = useState([])
    const [id, setId] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [adddialogOpen, setaddDialogOpen] = useState(false);
    const [editdialogOpen, seteditDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        filr_url: '',
        note: '',
        order_id: '',
    });

    const actionColumns = [
        {field: 'actions', type: 'actions', headerfilr_url: 'Actions', width:100, 
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={()=>{
                        setId(params.row.id)
                        setFormValues({
                            filr_url: params.row.filr_url,
                            note: params.row.note,
                            order_id: params.row.order_id,
                        })
                    seteditDialogOpen(true)}}/>,
                    // <GridActionsCellItem
                    //     icon={<DeleteIcon/>}
                    //     label="Delete"
                    //     onClick={() => handleDelete(params.row.id)}/>
                ]
        }
    ]

    const columns = role == 'Clinical Admin' ? [...baseColumns, ...actionColumns] : baseColumns;

    async function fetchReport() {
        setLoading(true);
        try{
            const res = await apiClient.get('/reports');
            setReports(res.data);
            setError(null);
        }catch(e){
            console.log("Could not fetch your information")
        }finally{
            setLoading(false)

        }
    }

    useEffect(()=> {
        fetchReport()
    }, []);

    const handleFieldChange = (field) => (event) => {
      setFormValues((prev)=> ({ ...prev, [field]: event.target.value}));
    }

    const handleCreate = async() => {
        try {
            await apiClient.post('/reports', {
                ...formValues,
            order_id: Number(formValues.order_id),
            });
            onSuccess(`Report created.`);
            setFormValues({filr_url: '', note: '', order_id: ''});
            await fetchReport(); 
        } catch (e){
            setError(e.response?.data)
        } finally {
            setaddDialogOpen(false);
        }
    }

    const handleEdit = async() => {
        try {
            await apiClient.put(`/reports/${id}`, {
                ...formValues,
            //id : id,
            order_id: Number(formValues.order_id),
            });
            seteditDialogOpen(false);
            setId(0)
            onSuccess(`Report Edited.`);
            setFormValues({filr_url: '', note: '', order_id: ''});
            await fetchReport(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    const handleDelete = async(reportid) => {
        try {
            await apiClient.delete(`/reports/${reportid}`);

            onSuccess(`Report Deleted.`);
            await fetchReport(); //see the table data refreshed with the new robot
        } catch (e){
            console.log(e.response?.data);//a real app would surface this inline in the dialog
        }
    }

    if (loading) return <CircularProgress/>

    if (error) return <Alert severity='error'>{error}</Alert>

    return(
        <Box>
            {role != 'Auditor' && (<Button variant="outlined" sx={{ mb: 2}} onClick={() => setaddDialogOpen(true)}>Add Report</Button>)}
            <Box sx={{height:400, width: '100%', display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
                <DataGrid rows={reports} columns={columns} getRowId={(row) => row.id} />
            </Box>
            <Dialog open={adddialogOpen} onClose={() => setaddDialogOpen(false)}>
                <DialogTitle>Add New Report</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                        <TextField label="File URL" value={formValues.filr_url} onChange={handleFieldChange('filr_url')} />
                        <TextField label="Note" value={formValues.note} onChange={handleFieldChange('note')} />
                        <TextField label="Order ID" type="number" value={formValues.order_id} onChange={handleFieldChange('order_id')} />
                    </Stack>
                </DialogContent>
                        <DialogActions>
                        <Button onClick={() => setaddDialogOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreate}>Create</Button>
                        </DialogActions>

            </Dialog>

            <Dialog open={editdialogOpen} onClose={() => seteditDialogOpen(false)} >
                <DialogTitle>Edit Report</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300}}>
                        <TextField label="File URL" value={formValues.filr_url} onChange={handleFieldChange('filr_url')} />
                        <TextField label="Note" value={formValues.note} onChange={handleFieldChange('note')} />
                        <TextField label="Order ID" type="number" value={formValues.order_id} onChange={handleFieldChange('order_id')} />
                    </Stack>
                </DialogContent>
                        <DialogActions>
                        <Button onClick={() => {
                            setFormValues({
                                            filr_url: '',
                                            note: '',
                                            order_id: '',
                                        })
                            seteditDialogOpen(false)}}>Cancel</Button>
                        <Button variant="contained" onClick={handleEdit}>Edit</Button>
                        </DialogActions>

            </Dialog> 
        </Box>
    )
}

export default ReportGrid;
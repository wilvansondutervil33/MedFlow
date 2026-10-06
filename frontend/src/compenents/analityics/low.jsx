import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, CircularProgress, Typography} from '@mui/material';
import apiClient from '../../api/client.js';


function LowCharge () {
    const [low, setLows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const lowchargeColumns = [
  { field: 'id', headerName: 'ID', width: 70 , flex: 1 },
  { field: 'serial_number', headerName: 'Serial Number', width: 150 , flex: 1 },
  { field: 'model', headerName: 'Model', width: 160 , flex: 1 },
  { field: 'charge_level', headerName: 'Charge', width: 120, type: 'number' , flex: 1 },
  { field: 'status', headerName: 'Status', width: 130 , flex: 1 },
  { field: 'hospital_id', headerName: 'Hospital ID', width: 110, type: 'number' , flex: 1 }]
    
    async function fetchLow() {
      setLoading(true);
      try {
        const response = await apiClient.get('/analytics/lowcost');
        setLows(response.data);
        setError(null);
      } catch {
          setError('Could not load fleet data.');
      } finally {
          setLoading(false);
      }
    }

    useEffect(() => {
      fetchLow();
    }, []);

    if (loading) return <CircularProgress />;
    //shows error alert if API call fails
    if (error) return <Alert severity="error">{error}</Alert>;

    return(
        <Box>
            {low && (
                <>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Low Charge Equipments
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid rows={low} columns={lowchargeColumns} getRowId={(row) => row.id} />
                    </Box>
                </>
            )}
            {!low && (
                <Typography variant="h5" component="h2" gutterBottom>
                        NO Co-Location found
                    </Typography>
            )}
        </Box>
    )
}


export default LowCharge;
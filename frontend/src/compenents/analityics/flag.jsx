import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, CircularProgress, Typography} from '@mui/material';
import apiClient from '../../api/client.js';


function Flag () {
    const [flag, setFlags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const flagColumns = [
  { field: 'id', headerName: 'ID', width: 70 , flex: 1 },
  { field: 'name', headerName: 'Name', width: 150 , flex: 1 },
  { field: 'location_region', headerName: 'Location Region', width: 160 , flex: 1 },
  { field: 'capacity', headerName: 'Capacity', width: 120, type: 'number' , flex: 1 },
  { field: 'supervisor_id', headerName: 'Supervisor ID', width: 110, type: 'number' , flex: 1 }]

    
    async function fetchflag() {
      setLoading(true);
      try {
        const response = await apiClient.get('/analytics/flags');
        setFlags(response.data);
        setError(null);
      } catch {
          setError('Could not load fleet data.');
      } finally {
          setLoading(false);
      }
    }

    useEffect(() => {
      fetchflag();
    }, []);

    if (loading) return <CircularProgress />;
    //shows error alert if API call fails
    if (error) return <Alert severity="error">{error}</Alert>;

    return(
        <Box>
            {flag && (
                <>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Co-Location
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid rows={flag} columns={flagColumns} getRowId={(row) => row.id} />
                    </Box>
                </>
            )}
            {!flag && (
                <Typography variant="h5" component="h2" gutterBottom>
                        NONE found
                    </Typography>
            )}
        </Box>
    )
}


export default Flag;
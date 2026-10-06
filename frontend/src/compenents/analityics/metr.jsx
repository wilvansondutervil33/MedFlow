import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, CircularProgress, Typography} from '@mui/material';
import apiClient from '../../api/client.js';


function Metr () {
    const [metr, setMetrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const metricsColumns = [
  { field: 'model', headerName: 'Equipment Models', width: 70 , flex: 1 },
  { field: 'completed', headerName: 'Completed', width: 150 , type: 'number', flex: 1 },
  { field: 'failed', headerName: 'Failed', width: 160 , type: 'number', flex: 1 }]
    
    async function fetchMetr() {
      setLoading(true);
      try {
        const response = await apiClient.get('/analytics/metrics');
        setMetrs(response.data);
        setError(null);
      } catch {
          setError('Could not load fleet data.');
      } finally {
          setLoading(false);
      }
    }

    useEffect(() => {
      fetchMetr();
    }, []);

    if (loading) return <CircularProgress />;
    //shows error alert if API call fails
    if (error) return <Alert severity="error">{error}</Alert>;

    return(
        <Box>
            {metr && (
                <>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Completed / Failed Ratio
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid rows={metr} columns={metricsColumns} getRowId={(row) => row.model} />
                    </Box>
                </>
            )}
            {!metr && (
                <Typography variant="h5" component="h2" gutterBottom>
                        NONE found
                    </Typography>
            )}
        </Box>
    )
}


export default Metr;
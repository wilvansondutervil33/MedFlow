import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, CircularProgress, Typography} from '@mui/material';
import apiClient from '../../api/client.js';


function Reports () {
    const [repo, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const reportColumns = [
        { field: 'id', headerName: 'ID', width: 70 , flex: 1 },
        { field: 'name', headerName: 'Name', width: 150 , flex: 1 },
        { field: 'hospital_id', headerName: 'Hospital ID', width: 110, type: 'number' , flex: 1 }]
    
    async function fetchReport() {
      setLoading(true);
      try {
        const listB = await apiClient.get('/hospitals')
        const byId = new Map();

        for (let i = 0; i < listB.data.length; i++){
            const supId = listB.data[i].supervisor_id
            console.log(supId)
          const response = await apiClient.get(`/analytics/report/${supId}`);
          response.data.forEach((t) => byId.set(t.id, t));
        }
        setRepos([...byId.values()]);
        setError(null);
        console.log(repo)
      } catch (e){
          setError('Could not load fleet data.');
      } finally {
          setLoading(false);
      }
    }

    useEffect(() => {
      fetchReport();
    }, []);

    if (loading) return <CircularProgress />;
    //shows error alert if API call fails
    if (error) return <Alert severity="error">{error}</Alert>;

    return(
        <Box>
            {repo.length > 0 && (
                    <>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Report
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid rows={repo} columns={reportColumns} getRowId={(row) => row.id} />
                    </Box>
                    </>
                  )}
            {!repo.length && (
                <Typography variant="h5" component="h2" gutterBottom>
                        NO Open Service Calls found
                    </Typography>
            )}
        </Box>
    )
}


export default Reports;
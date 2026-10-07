import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client.js';
import EquipmentGrid from '../equipment/equipmentGrid.jsx';
import { CircularProgress, Container, Typography, Box, Alert} from '@mui/material';


function SigleHospital({ onSuccess , role}){
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospital, setHospital] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null)
    


    async function fetchHospital() {
      setLoading(true);
      try {
        const response = await apiClient.get(`/hospitals/${id}`);
        setHospital(response.data);
        setError(null);
      } catch {
          setError('Could not load fleet data.');
          navigate('/404', { replace: true });
      } finally {
          setLoading(false);
      }
    }

     useEffect(() => {
      fetchHospital();
    }, []);

    //shows a spinning progress indicator if loading data
    if (loading) return <CircularProgress />;
    //shows error alert if API call fails
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4}}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {hospital.name}
                </Typography>
                <Box sx={{ mb: 4}}>
                    <EquipmentGrid onSuccess={onSuccess} role={role} hospital= {hospital}/>
                </Box>
            </Container>
        </>

    );

}

export default SigleHospital
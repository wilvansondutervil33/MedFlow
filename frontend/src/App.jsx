import { Container, Typography, Box, Snackbar, Alert} from '@mui/material'
import {useState} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginForm from './compenents/auth/LoginForm.jsx';
import HospitalGrid from './compenents/hospital/hospitalGrid.jsx';
import EquipmentGrid from './compenents/equipment/equipmentGrid.jsx';
import OrderGrid from './compenents/order/orderGrid.jsx';
import ReportGrid from './compenents/report/reportGrid.jsx';
import UserDataGrid from './compenents/user/userGrid.jsx';
import BusinessDataGrid from './compenents/analityics/analyticsGrid.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppHeader from './compenents/layout/AppHeader.jsx';


function Dashboard(){
  const {user, logout} = useAuth()
  const [notification, setNotification] = useState(null)

  return (
    <>
      <BrowserRouter>
        <AppHeader username={user?.sub} role={user?.role} onLogout={logout}>
        <Routes>
          <Route path='/' element = {
            <Container maxWidth="lg" sx={{mt:4}}>
              <Typography variant='h5' component="h2" gutterBottom>
                Fleet Overview
              </Typography>
              <Box sx={{md:4}}>
                <HospitalGrid onSuccess={setNotification} role={user?.role}/>
              </Box>
              <Typography variant='h5' component="h2" gutterBottom>
                Equipments
              </Typography>
              <Box sx={{md:4}}>
                <EquipmentGrid onSuccess={setNotification} role={user?.role}/>
              </Box>
              <Typography variant='h5' component="h2" gutterBottom>
                Work Orders
              </Typography>
              <Box sx={{md:4}}>
                <OrderGrid onSuccess={setNotification} role={user?.role}/>
              </Box>
              <Typography variant='h5' component="h2" gutterBottom>
                Reports
              </Typography>
              <Box sx={{md:4}}>
                <ReportGrid onSuccess={setNotification} role={user?.role}/>
              </Box>
              {user?.role == 'Clinical Admin' && (<Typography variant='h5' component="h2" gutterBottom>
                Users
              </Typography>)}
              {user?.role == 'Clinical Admin' && (<Box sx={{md:4}}>
                <UserDataGrid onSuccess={setNotification} role={user?.role}/>
              </Box>)}
              <Typography variant='h5' component="h2" gutterBottom>
                Analytics
              </Typography>
              <Box sx={{md:4}}>
                <BusinessDataGrid onSuccess={setNotification} role={user?.role}/>
              </Box>
            </Container>
          } exact= {true}/>
        </Routes>

        <Snackbar open={Boolean(notification)} autoHideDuration = {4000} onClose={() => setNotification(null)}>
          <Alert severity='success' onClose={() => setNotification(null)}>
            {notification}
          </Alert>
        </Snackbar>
      </AppHeader>
      </BrowserRouter>
    
    
    </>
  );
}


function AppContent() {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginForm />;
}

function App(){
  
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  )
}

export default App;
import { Container, Typography, Box, Snackbar, Alert} from '@mui/material'
import {useState} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginForm from './compenents/auth/LoginForm.jsx';
import HospitalGrid from './compenents/hospital/hospitalGrid.jsx';
import OrderGrid from './compenents/order/orderGrid.jsx';
import ReportGrid from './compenents/report/reportGrid.jsx';
import UserDataGrid from './compenents/user/userGrid.jsx';
import SigleHospital from './compenents/hospital/singlehosital.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppHeader from './compenents/layout/AppHeader.jsx';
import AnalyticsPage from './compenents/analityics/analityicsGrid.jsx';



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
              
            </Container>
          } exact= {true}/>
          <Route path='/hospital/:id' element= {<SigleHospital onSuccess={setNotification} role={user?.role}/>} exact={true}/>
          <Route path='/analytics' element= {<AnalyticsPage onSuccess={setNotification} role={user?.role}/>} exact={true}/>
          <Route path='/workorders' element= {<OrderGrid onSuccess={setNotification} role={user?.role}/>} exact={true}/>
          <Route path='/reports' element= {<ReportGrid onSuccess={setNotification} role={user?.role}/>} exact={true}/>
          {user?.role == 'Clinical Admin' && <Route path='/users' element= {<UserDataGrid onSuccess={setNotification} role={user?.role}/>} exact={true}/>}
          <Route path='*' element= {<Typography variant="h5" component="h2" gutterBottom>
                404
              </Typography>}/>
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
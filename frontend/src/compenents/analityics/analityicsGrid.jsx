// pages/Analytics.jsx
import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import Reports from './reports';
import CoLocation from './colocation';
import LowCharge from './low';
import Flag from './flag';
import Metr from './metr';

function AnalyticsPage({ onSuccess}) {
  const [tab, setTab] = useState(0);

  return (
    <Box >
      <Tabs value={tab} onChange={(e, v) => setTab(v)}sx={{backgroundColor: 'lightgray'}}>
        <Tab label="Reports" />
        <Tab label="Low Equipments" />
        <Tab label="Co-Locations" />
        <Tab label= "FLag"/>
        <Tab label= "Ratio" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && <Reports />}
        {tab === 1 && <LowCharge />}
        {tab === 2 && <CoLocation />}
        {tab === 3 && <Flag />}
        {tab === 4 && <Metr />}
      </Box>
    </Box>
  );
}

export default AnalyticsPage;
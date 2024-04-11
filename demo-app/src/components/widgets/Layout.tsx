import MenuIcon from '@mui/icons-material/Menu';
import NorthIcon from '@mui/icons-material/North';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SouthIcon from '@mui/icons-material/South';
import WifiIcon from '@mui/icons-material/Wifi';
import { AppBar, Box, Divider, Drawer, IconButton, List, Toolbar, Typography, styled } from '@mui/material';
import React from 'react';

import { usePowerSync } from '@journeyapps/powersync-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const powerSync = usePowerSync();

  const [syncStatus, setSyncStatus] = React.useState(powerSync.currentStatus);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  React.useEffect(() => {
    const l = powerSync.registerListener({
      statusChanged: (status) => {
        setSyncStatus(status);
      }
    });
    return () => l?.();
  }, [powerSync]);

  return (
    <S.MainBox>
      <S.TopBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(!openDrawer)}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography>Self Hosted Demo</Typography>
          </Box>
          <NorthIcon
            sx={{ marginRight: '-10px' }}
            color={syncStatus?.dataFlowStatus.uploading ? 'primary' : 'inherit'}
          />
          <SouthIcon color={syncStatus?.dataFlowStatus.downloading ? 'primary' : 'inherit'} />
          {syncStatus?.connected ? <WifiIcon /> : <SignalWifiOffIcon />}
        </Toolbar>
      </S.TopBar>
      <Drawer anchor={'left'} open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <S.PowerSyncLogo alt="PowerSync Logo" width={250} height={100} src="/powersync-logo.svg" />
        <Divider />
        <List></List>
      </Drawer>
      <S.MainBox>{children}</S.MainBox>
    </S.MainBox>
  );
}

namespace S {
  export const MainBox = styled(Box)`
    flex-grow: 1;
  `;

  export const TopBar = styled(AppBar)`
    margin-bottom: 20px;
  `;

  export const PowerSyncLogo = styled('img')`
    max-width: 250px;
    max-height: 250px;
    object-fit: contain;
    padding: 20px;
  `;
}

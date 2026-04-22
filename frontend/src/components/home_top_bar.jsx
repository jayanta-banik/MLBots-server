import { useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Chip, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material';

function HomeTopBar({ onLogout, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const firstName = user?.firstName?.trim() || 'there';

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ width: '100%', borderRadius: 4, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1, minHeight: '72px !important' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
            <Chip label="MLBots" color="primary" variant="outlined" />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Home
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Signed in as {firstName}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit">Overview</Button>
            <Button color="inherit">Profile</Button>
            <Button variant="contained" onClick={onLogout}>
              Log out
            </Button>
          </Stack>

          <IconButton color="inherit" onClick={() => setIsMenuOpen(true)} sx={{ display: { xs: 'inline-flex', md: 'none' } }} aria-label="Open account menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <Stack spacing={2} sx={{ width: 280, p: 3 }}>
          <Typography variant="h6">Account</Typography>
          <Typography variant="body2" color="text.secondary">
            Signed in as {firstName}
          </Typography>
          <Button variant="text" color="inherit" onClick={() => setIsMenuOpen(false)}>
            Overview
          </Button>
          <Button variant="text" color="inherit" onClick={() => setIsMenuOpen(false)}>
            Profile
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsMenuOpen(false);
              onLogout();
            }}
          >
            Log out
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}

export default HomeTopBar;

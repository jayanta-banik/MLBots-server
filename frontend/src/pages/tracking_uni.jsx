import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import { Alert, Box, Button, Chip, CircularProgress, Container, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import SurfaceCard from '../components/surface_card.jsx';
import apiClient from '../utils/apiClient.js';

function flattenUniversityRows(universities) {
  return universities.flatMap((university) => {
    if (!university.faculties.length) {
      return [
        {
          id: `university-${university.id}`,
          facultyName: 'No faculty imported',
          googleScholarId: null,
          ...university,
        },
      ];
    }

    return university.faculties.map((faculty) => ({
      id: `faculty-${faculty.id}`,
      facultyName: faculty.name,
      googleScholarId: faculty.googleScholarId,
      ...university,
    }));
  });
}

const STATUS_SEQUENCE = ['none', 'circle', 'flag', 'cross'];
const STATUS_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'circle', label: 'Circle' },
  { value: 'flag', label: 'Flag' },
  { value: 'cross', label: 'Cross' },
];

function getStatusSortValue(status) {
  return STATUS_SEQUENCE.indexOf(status);
}

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? 'None';
}

function getStatusIcon(status) {
  if (status === 'circle') {
    return <CircleOutlinedIcon sx={{ fontSize: 22 }} />;
  }

  if (status === 'flag') {
    return <OutlinedFlagIcon sx={{ fontSize: 22 }} />;
  }

  if (status === 'cross') {
    return <CloseIcon sx={{ fontSize: 22 }} />;
  }

  return <Box sx={{ width: 22, height: 22 }} />;
}

function openUniversitySearch(universityName) {
  const query = encodeURIComponent(`${universityName} phdprograms`);

  window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
}

function TrackingUniPage() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [rowStatuses, setRowStatuses] = useState({});
  const [statusMenu, setStatusMenu] = useState({ anchorEl: null, rowId: null });

  useEffect(() => {
    let isMounted = true;

    async function loadUniversityDirectory() {
      setStatus('loading');
      setError('');

      try {
        const response = await apiClient().get('/universities');

        if (!isMounted) {
          return;
        }

        setUniversities(response.data.universities ?? []);
        setStatus('success');
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.response?.data?.message ?? requestError.message ?? 'Unable to load the university directory.');
        setStatus('error');
      }
    }

    loadUniversityDirectory();

    return () => {
      isMounted = false;
    };
  }, []);

  const rows = flattenUniversityRows(universities).map((row) => {
    const rowStatus = rowStatuses[row.id] ?? 'none';

    return {
      ...row,
      statusValue: rowStatus,
      statusSortValue: getStatusSortValue(rowStatus),
      searchLabel: 'Search PhD Programs',
    };
  });
  const facultyCount = universities.reduce((count, university) => count + university.facultyCount, 0);

  function openStatusMenu(event, rowId) {
    event.preventDefault();

    setStatusMenu({
      anchorEl: event.currentTarget,
      rowId,
    });
  }

  function closeStatusMenu() {
    setStatusMenu({ anchorEl: null, rowId: null });
  }

  function handleStatusSelect(nextStatus) {
    if (!statusMenu.rowId) {
      return;
    }

    setRowStatuses((currentStatuses) => ({
      ...currentStatuses,
      [statusMenu.rowId]: nextStatus,
    }));
    closeStatusMenu();
  }

  const columns = [
    {
      field: 'statusValue',
      headerName: 'Status',
      width: 58,
      minWidth: 58,
      maxWidth: 58,
      type: 'singleSelect',
      valueOptions: STATUS_OPTIONS.map((option) => option.value),
      sortComparator: (leftValue, rightValue) => getStatusSortValue(leftValue) - getStatusSortValue(rightValue),
      valueFormatter: (value) => getStatusLabel(typeof value === 'object' && value !== null ? value.value : value),
      renderCell: (params) => (
        <IconButton
          aria-label={`Set status for ${params.row.name}`}
          size="small"
          onContextMenu={(event) => openStatusMenu(event, params.row.id)}
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            width: 30,
            height: 30,
          }}
        >
          {getStatusIcon(params.row.statusValue)}
        </IconButton>
      ),
    },
    {
      field: 'name',
      headerName: 'University',
      flex: 1.3,
      minWidth: 240,
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 0.8,
      minWidth: 140,
    },
    {
      field: 'state',
      headerName: 'State',
      width: 90,
      minWidth: 90,
    },
    {
      field: 'facultyName',
      headerName: 'Faculty',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'searchLabel',
      headerName: 'Search',
      minWidth: 190,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button size="small" variant="outlined" onClick={() => openUniversitySearch(params.row.name)}>
          Search PhD Programs
        </Button>
      ),
    },
  ];

  return (
    <Container component={motion.div} layout maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack component={motion.div} layout spacing={3}>
        <SurfaceCard tone="primary" delay={0.02}>
          <Stack spacing={2}>
            <Chip label="Outreach tools" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '4rem' }, overflowWrap: 'anywhere' }}>
              Facility dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '60ch', lineHeight: 1.8 }}>
              Review the imported university directory, including each campus location and the faculties currently linked to it in the backend database.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
              <Chip label={`${universities.length} universities`} color="primary" />
              <Chip label={`${facultyCount} faculties`} color="secondary" variant="outlined" />
              <Button variant="contained" color="secondary" onClick={() => navigate('/tracking-uni/phd-dashboard')}>
                Open PhD dashboard
              </Button>
              <Button variant="contained" onClick={() => navigate('/home')}>
                Back to home
              </Button>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </Stack>
          </Stack>
        </SurfaceCard>

        <SurfaceCard tone="secondary" delay={0.08}>
          <Stack spacing={2}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
              University and faculty directory
            </Typography>

            {status === 'loading' ? (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 3 }}>
                <CircularProgress size={22} />
                <Typography variant="body1" color="text.secondary">
                  Loading universities from the backend...
                </Typography>
              </Stack>
            ) : null}

            {status === 'error' ? (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            ) : null}

            {status === 'success' && rows.length === 0 ? <Alert severity="info">No universities have been imported yet.</Alert> : null}

            {status === 'success' && rows.length > 0 ? (
              <Box sx={{ width: '100%' }}>
                <DataGrid
                  autoHeight
                  rows={rows}
                  columns={columns}
                  disableRowSelectionOnClick
                  pageSizeOptions={[25, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        page: 0,
                        pageSize: 25,
                      },
                    },
                  }}
                  showToolbar
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: {
                        debounceMs: 200,
                      },
                    },
                  }}
                  sx={{
                    borderRadius: 0.3,
                    borderColor: 'divider',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.03),
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
                      outline: 'none',
                    },
                  }}
                />
              </Box>
            ) : null}

            <Menu
              open={statusMenu.rowId !== null}
              onClose={closeStatusMenu}
              anchorEl={statusMenu.anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              slotProps={{
                paper: {
                  sx: {
                    minWidth: 120,
                  },
                },
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} dense onClick={() => handleStatusSelect(option.value)}>
                  <Typography variant="body2">{option.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default TrackingUniPage;

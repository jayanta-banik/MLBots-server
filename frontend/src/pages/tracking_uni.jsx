import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, Chip, CircularProgress, Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

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

function compareRows(leftRow, rightRow, sortBy, sortDirection) {
  const leftValue = leftRow[sortBy] ?? '';
  const rightValue = rightRow[sortBy] ?? '';

  const comparison = typeof leftValue === 'number' && typeof rightValue === 'number' ? leftValue - rightValue : String(leftValue).localeCompare(String(rightValue));

  return sortDirection === 'asc' ? comparison : comparison * -1;
}

function TrackingUniPage() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const rows = flattenUniversityRows(universities).sort((leftRow, rightRow) => compareRows(leftRow, rightRow, sortBy, sortDirection));
  const facultyCount = universities.reduce((count, university) => count + university.facultyCount, 0);

  function handleSort(column) {
    if (sortBy === column) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(column);
    setSortDirection('asc');
  }

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
              <TableContainer sx={{ borderRadius: 1, border: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Table size="small" sx={{ minWidth: 760 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.03) }}>
                      <TableCell>
                        <TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? sortDirection : 'asc'} onClick={() => handleSort('name')}>
                          University
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel active={sortBy === 'location'} direction={sortBy === 'location' ? sortDirection : 'asc'} onClick={() => handleSort('location')}>
                          Location
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel active={sortBy === 'state'} direction={sortBy === 'state' ? sortDirection : 'asc'} onClick={() => handleSort('state')}>
                          State
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel active={sortBy === 'facultyName'} direction={sortBy === 'facultyName' ? sortDirection : 'asc'} onClick={() => handleSort('facultyName')}>
                          Faculty
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel active={sortBy === 'googleScholarId'} direction={sortBy === 'googleScholarId' ? sortDirection : 'asc'} onClick={() => handleSort('googleScholarId')}>
                          Google Scholar
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="right">
                        <TableSortLabel active={sortBy === 'facultyCount'} direction={sortBy === 'facultyCount' ? sortDirection : 'asc'} onClick={() => handleSort('facultyCount')}>
                          Faculty Count
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{row.state}</TableCell>
                        <TableCell>{row.facultyName}</TableCell>
                        <TableCell>{row.googleScholarId ?? 'Not linked'}</TableCell>
                        <TableCell align="right">{row.facultyCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default TrackingUniPage;

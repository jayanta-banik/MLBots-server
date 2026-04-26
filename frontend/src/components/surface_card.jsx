import { motion } from 'framer-motion';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { alpha } from '@mui/material/styles';

function SurfaceCard({ children, tone = 'primary', delay = 0, contentSx, sx, enableLayout = false }) {
  return (
    <Card
      component={motion.div}
      layout={enableLayout}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette[tone === 'secondary' ? 'secondary' : 'primary'].main, 0.1)}, transparent 42%)`,
          pointerEvents: 'none',
        },
        ...sx,
      }}
    >
      <CardContent
        sx={{
          position: 'relative',
          p: { xs: 2.5, md: 3 },
          '&:last-child': {
            pb: { xs: 2.5, md: 3 },
          },
          ...contentSx,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

export default SurfaceCard;

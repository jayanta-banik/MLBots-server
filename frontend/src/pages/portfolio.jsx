import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import { Box, Chip, Container, Link, Stack, Typography } from '@mui/material';

import SurfaceCard from '../components/surface_card.jsx';

const PROFILE_LINKS = [
  {
    href: 'mailto:jayantabanik.ml@gmail.com',
    label: 'jayantabanik.ml@gmail.com',
    icon: MailOutlineRoundedIcon,
  },
  {
    href: 'tel:+17606722203',
    label: '(760) 672-2203',
    icon: PhoneRoundedIcon,
  },
  {
    href: 'https://www.linkedin.com/in/jayantabanik',
    label: 'LinkedIn',
    icon: LaunchRoundedIcon,
  },
  {
    href: 'https://github.com/jayanta-banik',
    label: 'GitHub',
    icon: LaunchRoundedIcon,
  },
  {
    href: 'https://scholar.google.com/citations?user=t_7gaZQAAAAJ',
    label: 'Google Scholar',
    icon: LaunchRoundedIcon,
  },
];

const _IMPACT_ITEMS = [
  { value: '4+', label: 'Years in AI and ML' },
  { value: '1,500+', label: 'Clinical notes processed daily' },
  { value: '15x', label: 'Signal engine performance gain' },
  { value: '$30K', label: 'Hardware cost reduction' },
];

const SKILL_GROUPS = [
  {
    title: 'Programming Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'CUDA', 'Go', 'Rust', 'SQL', 'PostgreSQL', 'Pinecone', 'Bash'],
  },
  {
    title: 'AI and Machine Learning',
    items: ['Generative AI', 'LLMs', 'RAG', 'Vectorless RAG', 'NLP', 'Knowledge Graphs', 'PyTorch', 'TensorFlow', 'Transformers'],
  },
  {
    title: 'Data and Analytics',
    items: ['Pandas', 'NumPy', 'Spark', 'Databricks', 'Signal Processing', 'Data Visualization', 'Statistical Analysis', 'Experimental Design'],
  },
  {
    title: 'Deployment and Systems',
    items: ['AWS', 'Docker', 'Kubernetes', 'MLOps', 'k8s', 'Microservices', 'LLMOps', 'Terraform'],
  },
];

const EXPERIENCE_ITEMS = [
  {
    company: 'Aidar Health Inc.',
    role: 'Data Scientist',
    period: 'Jan 2025 - Present',
    highlights: [
      'Built NLP and Generative AI pipelines for clinical note analysis, topic modeling, and summarization across roughly 1,500 notes per day.',
      'Developed analytics dashboards that improved workflow efficiency by 15% and reduced wait time by 12 hours.',
      'Built machine learning models for medication non-adherence, missed doses, falls, and high-risk vital signs to support earlier intervention.',
      'Built a low-latency RAG and knowledge graph system that reduced care response latency by 30% and turnaround time by 15 hours.',
      'Led a redesign of the real-time signal processing engine, improving performance by approximately 15x.',
    ],
  },
  {
    company: 'University of California, Riverside',
    role: 'Graduate Student Researcher',
    period: 'Sep 2023 - Dec 2024',
    highlights: [
      'Created a Sensor Directed Sampling algorithm for high-performance sub-sampling using experimental design and response surface methods.',
      'Designed an active learning algorithm for multi-sensor data fusion in remote sensing platforms.',
      'Worked on spatial data analysis, sensor-driven sampling, and field-scale optimization problems for agricultural sensing applications.',
    ],
  },
  {
    company: 'USDA ARS US Salinity Laboratory / UCR',
    role: 'Machine Learning Developer',
    period: 'Oct 2022 - Dec 2023',
    highlights: [
      'Modernized a legacy monolithic ML application into Flask-based microservices for improved maintainability and scalability.',
      'Integrated machine learning models into production-oriented workflows and contributed to MLOps deployment practices.',
      'Designed and conducted 10+ field experiments around sub-sampling, sensor correlation, and field data integration.',
      'Built a predictive model to infer multi-sensor readings from a single sensor, reducing hardware costs by $30K.',
    ],
  },
];

const PROJECT_ITEMS = [
  {
    title: 'DNA BERT',
    period: 'Mar 2025 - Present',
    summary: 'Pretrained a BERT model on DNA and protein data, then fine-tuned downstream models for antimicrobial resistance classification and phenotype-driven editing tasks.',
  },
  {
    title: 'LSTM GPS Correction and ArcGIS Integration',
    period: 'Jan 2024 - May 2024',
    summary: 'Built a CNN-LSTM model to predict and correct spatial signal drift and integrated the outputs with ArcGIS Pro for accurate geospatial raster visualization.',
  },
  {
    title: 'Isolated Sign Language Recognition',
    period: 'May 2023 - Jul 2023',
    summary: 'Developed a hybrid CNN-LSTM-BERT system for sign language recognition from gesture sequences into NLP-ready outputs.',
  },
  {
    title: 'FAMNet',
    period: 'Jan 2023 - Mar 2023',
    summary: 'Created an LLM architecture targeting GPT-3-level GLUE performance while compressing the model toward a T5-small scale footprint.',
  },
  {
    title: 'Higgs Boson Signal Process Classification',
    period: 'Sep 2022 - Dec 2022',
    summary: 'Used neural networks on Large Hadron Collider simulations to distinguish signal-producing parameter combinations from background processes.',
  },
  {
    title: 'Emotional AI',
    period: 'Sep 2022 - Dec 2022',
    summary: 'Built a hybrid BERT and BART system for overlapping emotion detection and emotionally aware text generation.',
  },
];

const PUBLICATION_ITEMS = [
  'Near-ground microwave radiometry for on-the-go surface soil moisture sensing in micro-irrigated orchards in California. Agrosystems, Geosciences & Environment, 2025.',
  'Field deployment of an agricultural robot for informed sampling of soil apparent electrical conductivity using aisle graphs. Precision Agriculture ’25, 2025.',
  'Sensor Directed Sampling. Master’s Thesis, University of California, Riverside, 2024.',
  'Innovative Data Integration for On-the-Go Plant and Soil Sensing: The Short Vectorization Approach. ASA, CSSA, SSSA International Annual Meeting, 2023.',
  'Study of Dependency on Number of LSTM Units for Character-Based Text Generation Models. IEEE ICCSEA, 2020.',
];

const GOOGLE_SCHOLAR_LINK = {
  href: 'https://scholar.google.com/citations?user=t_7gaZQAAAAJ&hl=en',
  label: 'Google Scholar profile',
};

const EDUCATION_ITEMS = [
  {
    school: 'University of California, Riverside',
    degree: 'Master of Science, Computer Engineering',
    period: '2022 - 2024',
  },
  {
    school: 'West Bengal University of Technology',
    degree: 'Bachelor of Technology, Computer Science Engineering',
    period: '2017 - 2021',
  },
];

const CERTIFICATION_ITEMS = [
  {
    label: 'Google TensorFlow Developer License, Google, issued March 2024.',
    href: 'https://www.tensorflow.org/certificate',
  },
  {
    label: 'Machine Learning Specialization, DeepLearning.AI and Stanford Online.',
    href: 'https://www.coursera.org/specializations/machine-learning-introduction',
  },
  {
    label: 'Deep Learning Specialization, DeepLearning.AI.',
    href: 'https://www.coursera.org/specializations/deep-learning',
  },
  {
    label: 'Genomic Data Science Specialization, Johns Hopkins University.',
    href: 'https://www.coursera.org/specializations/genomic-data-science',
  },
  {
    label: 'Deep Learning and Computer Vision: OpenCV, SSD, and GANs.',
  },
];

const COMMUNITY_ITEMS = [
  'Founder, Joy-Bot Initiative: Designed and donated an interactive nursing-assistance robot for children and elderly care homes during COVID-19.',
  'Vice President, Rotary Club of Varanasi Chapter: Led STEM-focused educational initiatives for economically disadvantaged students.',
  'International Peer Mentor, University of California, Riverside.',
  'Advocate for Ethical and Inclusive AI and guest instructor for machine learning and deep learning sessions.',
];

function SectionHeader({ eyebrow, title }) {
  return (
    <Box>
      <Typography variant="overline" color="primary.main">
        {eyebrow}
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.35rem' }, mt: 0.8 }}>
        {title}
      </Typography>
    </Box>
  );
}

function PortfolioPage() {
  return (
    <Container maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack spacing={3}>
        <SurfaceCard tone="secondary" delay={0.06}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" color="secondary.main">
                <Link href="https://app.mlbots.in/" target="_blank" rel="noreferrer">
                  mlbots.in/portfolio
                </Link>
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.3rem', md: '4.1rem' }, mt: 0.8, maxWidth: '12ch', overflowWrap: 'anywhere' }}>
                Jayanta Banik
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.2, maxWidth: '68ch', lineHeight: 1.8 }}>
                Machine Learning Engineer and Data Scientist with 4+ years of experience across natural language processing, signal processing, remote sensing, and research-driven machine learning
                systems.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.1} flexWrap="wrap" useFlexGap>
              {PROFILE_LINKS.map((profile) => {
                const Icon = profile.icon;

                return (
                  <Link
                    key={profile.label}
                    href={profile.href}
                    target={profile.href.startsWith('mailto:') || profile.href.startsWith('tel:') ? undefined : '_blank'}
                    rel={profile.href.startsWith('mailto:') || profile.href.startsWith('tel:') ? undefined : 'noreferrer'}
                    underline="none"
                    color="inherit"
                    sx={{ width: { xs: '100%', md: 'auto' } }}
                  >
                    <Chip icon={<Icon />} label={profile.label} clickable color="secondary" variant="outlined" sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: 'flex-start', px: 0.5 }} />
                  </Link>
                );
              })}
            </Stack>

            {/* <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(4, minmax(0, 1fr))',
                },
              }}
            >
              {IMPACT_ITEMS.map((item, index) => (
                <SurfaceCard key={item.label} tone={index % 2 === 0 ? 'primary' : 'secondary'} delay={0.1 + index * 0.04} contentSx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
                  <Stack spacing={0.8}>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.55rem', md: '1.9rem' } }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                </SurfaceCard>
              ))}
            </Box> */}
          </Stack>
        </SurfaceCard>

        <SurfaceCard delay={0.1}>
          <Stack spacing={2.5}>
            <SectionHeader eyebrow="Summary" title="What I work on" />

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '72ch', lineHeight: 1.85 }}>
              I build AI systems that move from research to usable products, especially in NLP and applied ML. My domian knowledge entails remote sensing and healthcare. My work blends model design,
              experimentation, deployment, analytics, and product-facing integration.
            </Typography>
          </Stack>
        </SurfaceCard>

        <SurfaceCard delay={0.12} tone="secondary">
          <Stack spacing={2.5}>
            <SectionHeader eyebrow="Core Skills" title="Technical range" />

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              {SKILL_GROUPS.map((group, index) => (
                <SurfaceCard
                  key={group.title}
                  tone={index === 1 ? 'secondary' : 'primary'}
                  delay={0.14 + index * 0.04}
                  sx={{ minHeight: '100%', minWidth: 0 }}
                  contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
                >
                  <Stack spacing={1.4} sx={{ minWidth: 0 }}>
                    <Typography variant="h3" sx={{ fontSize: '1.05rem', overflowWrap: 'anywhere' }}>
                      {group.title}
                    </Typography>

                    <Stack direction="row" useFlexGap sx={{ minWidth: 0, width: '100%', flexWrap: 'wrap', gap: 1 }}>
                      {group.items.map((skill) => (
                        <Chip key={skill} label={skill} size="small" color={index === 1 ? 'secondary' : 'primary'} variant="outlined" sx={{ flexShrink: 0 }} />
                      ))}
                    </Stack>
                  </Stack>
                </SurfaceCard>
              ))}
            </Box>
          </Stack>
        </SurfaceCard>

        <SurfaceCard delay={0.14}>
          <Stack spacing={2.5}>
            <SectionHeader eyebrow="Experience" title="Recent work" />

            <Stack spacing={2}>
              {EXPERIENCE_ITEMS.map((item, index) => (
                <SurfaceCard key={`${item.company}-${item.role}`} tone={index % 2 === 0 ? 'primary' : 'secondary'} delay={0.16 + index * 0.04} contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                      <Box>
                        <Typography variant="h3" sx={{ fontSize: '1.1rem' }}>
                          {item.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                          {item.company}
                        </Typography>
                      </Box>

                      <Chip icon={<WorkOutlineRoundedIcon />} label={item.period} color={index % 2 === 0 ? 'primary' : 'secondary'} size="small" />
                    </Stack>

                    <Stack component="ul" spacing={0.9} sx={{ m: 0, pl: 2.25 }}>
                      {item.highlights.map((highlight) => (
                        <Typography component="li" key={highlight} variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                          {highlight}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </SurfaceCard>
              ))}
            </Stack>
          </Stack>
        </SurfaceCard>

        <SurfaceCard delay={0.16} tone="secondary">
          <Stack spacing={2.5}>
            <SectionHeader eyebrow="Selected Projects" title="Research and applied builds" />

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                },
              }}
            >
              {PROJECT_ITEMS.map((project, index) => (
                <SurfaceCard
                  key={project.title}
                  tone={index % 2 === 0 ? 'secondary' : 'primary'}
                  delay={0.18 + index * 0.03}
                  sx={{ minHeight: '100%' }}
                  contentSx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}
                >
                  <Stack spacing={1.2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Typography variant="h3" sx={{ fontSize: '1.05rem' }}>
                        {project.title}
                      </Typography>
                      <Chip label={project.period} size="small" color={index % 2 === 0 ? 'secondary' : 'primary'} />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {project.summary}
                    </Typography>
                  </Stack>
                </SurfaceCard>
              ))}
            </Box>
          </Stack>
        </SurfaceCard>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              lg: '1.35fr 1fr',
            },
          }}
        >
          <SurfaceCard delay={0.2}>
            <Stack spacing={2.5}>
              <SectionHeader eyebrow="Publications" title="Published work" />

              <Stack spacing={1.4}>
                <Link href={GOOGLE_SCHOLAR_LINK.href} target="_blank" rel="noreferrer" underline="hover" sx={{ alignSelf: 'flex-start', overflowWrap: 'anywhere' }}>
                  {GOOGLE_SCHOLAR_LINK.label}
                </Link>

                <Stack component="ol" spacing={1.1} sx={{ m: 0, pl: 2.4 }}>
                  {PUBLICATION_ITEMS.map((publication) => (
                    <Typography component="li" key={publication} variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {publication}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </SurfaceCard>

          <Stack spacing={2}>
            <SurfaceCard delay={0.22} tone="secondary">
              <Stack spacing={2}>
                <SectionHeader eyebrow="Education" title="Academic background" />

                <Stack spacing={1.5}>
                  {EDUCATION_ITEMS.map((item) => (
                    <Box key={item.school}>
                      <Typography variant="h3" sx={{ fontSize: '1rem' }}>
                        {item.school}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.45, lineHeight: 1.7 }}>
                        {item.degree}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.period}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </SurfaceCard>

            <SurfaceCard delay={0.24}>
              <Stack spacing={2}>
                <SectionHeader eyebrow="Certifications" title="Formal training" />

                <Stack component="ul" spacing={0.9} sx={{ m: 0, pl: 2.2 }}>
                  {CERTIFICATION_ITEMS.map((item) => (
                    <Typography component="li" key={item.label} variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {item.href ? (
                        <Link href={item.href} target="_blank" rel="noreferrer" underline="hover" color="inherit" sx={{ overflowWrap: 'anywhere' }}>
                          {item.label}
                        </Link>
                      ) : (
                        item.label
                      )}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </SurfaceCard>

            <SurfaceCard delay={0.26} tone="secondary">
              <Stack spacing={2}>
                <SectionHeader eyebrow="Community" title="Leadership and mentoring" />

                <Stack component="ul" spacing={0.9} sx={{ m: 0, pl: 2.2 }}>
                  {COMMUNITY_ITEMS.map((item) => (
                    <Typography component="li" key={item} variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </SurfaceCard>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default PortfolioPage;

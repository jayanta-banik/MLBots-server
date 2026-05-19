export const PHD_DASHBOARD_UNIVERSITIES = ['UCLA'];

export const PHD_DASHBOARD_DEPARTMENTS = ['Computer Science', 'Statistics & Data Science'];

export const PHD_DASHBOARD_TARGET_PER_DAY = 5;

export const PHD_DASHBOARD_FACULTY = [
  {
    id: 1,
    name: 'Wei Wang',
    email: 'weiwang@cs.ucla.edu',
    department: 'Computer Science',
    university: 'UCLA',
    universityRank: 46,
    bioUrl: 'https://samueli.ucla.edu/people/wei-wang/',
    scholarUrl: 'https://scholar.google.com/citations?user=WeiwangUCLA',
    hIndex: 52,
    totalCitations: 18420,
    relevance: 'high',
    tags: ['Machine Learning', 'Database Systems', 'Graph Neural Networks', 'Big Data', 'Data Mining'],
    status: 'pending',
    notes: '',
    emailDraft: '',
    emailSubject: '',
    papers: {
      last5: [
        { title: 'ENIGMA: Efficient Graph Neural Networks for Graph-Level Matching', year: 2024, venue: 'VLDB 2024', citations: 87, doi: '#', firstAuthor: false },
        { title: 'Scalable Data Integration with Large Language Models', year: 2024, venue: 'SIGMOD 2024', citations: 43, doi: '#', firstAuthor: true },
        { title: 'Learned Query Optimization for Distributed Databases', year: 2023, venue: 'VLDB 2023', citations: 156, doi: '#', firstAuthor: false },
        { title: 'Graph Attention Networks for Knowledge Graph Completion', year: 2023, venue: 'NeurIPS 2023', citations: 201, doi: '#', firstAuthor: false },
        { title: 'Contrastive Learning for Cross-Modal Data Retrieval', year: 2023, venue: 'ICDE 2023', citations: 98, doi: '#', firstAuthor: true },
      ],
      topCited: [
        { title: 'Graph Attention Networks for Knowledge Graph Completion', year: 2023, venue: 'NeurIPS 2023', citations: 201, doi: '#', firstAuthor: false },
        { title: 'Learned Query Optimization for Distributed Databases', year: 2023, venue: 'VLDB 2023', citations: 156, doi: '#', firstAuthor: false },
        { title: 'ENIGMA: Efficient Graph Neural Networks for Graph-Level Matching', year: 2024, venue: 'VLDB 2024', citations: 87, doi: '#', firstAuthor: false },
      ],
      firstAuthor: [
        { title: 'Scalable Data Integration with Large Language Models', year: 2024, venue: 'SIGMOD 2024', citations: 43, score: 0.82, doi: '#', firstAuthor: true },
        { title: 'Contrastive Learning for Cross-Modal Data Retrieval', year: 2023, venue: 'ICDE 2023', citations: 98, score: 0.71, doi: '#', firstAuthor: true },
      ],
    },
  },
  {
    id: 2,
    name: 'Miryung Kim',
    email: 'miryung@cs.ucla.edu',
    department: 'Computer Science',
    university: 'UCLA',
    universityRank: 46,
    bioUrl: 'https://samueli.ucla.edu/people/miryung-kim/',
    scholarUrl: 'https://scholar.google.com/citations?user=MiryungKimUCLA',
    hIndex: 31,
    totalCitations: 6840,
    relevance: 'high',
    tags: ['LLM for Code', 'Software Engineering', 'Automated Program Repair', 'AI-assisted Development'],
    status: 'drafting',
    notes: 'Lab website mentions open positions for Fall 2026. Check her recent ICSE papers.',
    emailDraft:
      "Dear Professor Kim,\n\nI am writing to express my strong interest in joining your research group as a PhD student...\n\n[Add personalized paragraph about her LLM-for-code work here]\n\nI believe my background in [your background] aligns well with your group's focus on AI-assisted software development.\n\nThank you for your time.\n\nBest regards,\n[Your Name]",
    emailSubject: 'PhD Inquiry — Prospective Student Interest in LLM-Assisted Software Engineering',
    papers: {
      last5: [
        { title: 'LLM-Assisted Bug Detection in Large Codebases', year: 2024, venue: 'ICSE 2024', citations: 67, doi: '#', firstAuthor: false },
        { title: 'Automated Program Repair with Transformer Models', year: 2024, venue: 'FSE 2024', citations: 89, doi: '#', firstAuthor: true },
        { title: 'Understanding Developer Behavior in ML Pipelines', year: 2023, venue: 'ICSE 2023', citations: 45, doi: '#', firstAuthor: false },
        { title: 'Code Change Intelligence: Mining Software Repositories', year: 2023, venue: 'MSR 2023', citations: 134, doi: '#', firstAuthor: false },
        { title: 'Neural Code Search for API Documentation', year: 2022, venue: 'TSE 2022', citations: 178, doi: '#', firstAuthor: true },
      ],
      topCited: [
        { title: 'Neural Code Search for API Documentation', year: 2022, venue: 'TSE 2022', citations: 178, doi: '#', firstAuthor: true },
        { title: 'Code Change Intelligence: Mining Software Repositories', year: 2023, venue: 'MSR 2023', citations: 134, doi: '#', firstAuthor: false },
        { title: 'Automated Program Repair with Transformer Models', year: 2024, venue: 'FSE 2024', citations: 89, doi: '#', firstAuthor: true },
      ],
      firstAuthor: [
        { title: 'Automated Program Repair with Transformer Models', year: 2024, venue: 'FSE 2024', citations: 89, score: 0.88, doi: '#', firstAuthor: true },
        { title: 'Neural Code Search for API Documentation', year: 2022, venue: 'TSE 2022', citations: 178, score: 0.65, doi: '#', firstAuthor: true },
      ],
    },
  },
  {
    id: 3,
    name: 'Glenn Reinman',
    email: 'reinman@cs.ucla.edu',
    department: 'Computer Science',
    university: 'UCLA',
    universityRank: 46,
    bioUrl: 'https://samueli.ucla.edu/people/glenn-reinman/',
    scholarUrl: 'https://scholar.google.com/citations?user=GlennReinmanUCLA',
    hIndex: 28,
    totalCitations: 4210,
    relevance: 'med',
    tags: ['Computer Architecture', 'ML Acceleration', 'Memory Systems', 'Neural Network Hardware'],
    status: 'pending',
    notes: '',
    emailDraft: '',
    emailSubject: '',
    papers: {
      last5: [
        { title: 'Approximate Computing for Neural Network Inference', year: 2024, venue: 'MICRO 2024', citations: 34, doi: '#', firstAuthor: false },
        { title: 'Cache-Aware Deep Learning Acceleration', year: 2023, venue: 'ISCA 2023', citations: 56, doi: '#', firstAuthor: true },
        { title: 'Memory Hierarchy Optimization for Transformer Models', year: 2023, venue: 'HPCA 2023', citations: 78, doi: '#', firstAuthor: false },
        { title: 'DRAM Scheduling for ML Workloads', year: 2022, venue: 'MICRO 2022', citations: 92, doi: '#', firstAuthor: true },
        { title: 'Prefetching Strategies for Graph Neural Networks', year: 2022, venue: 'ISCA 2022', citations: 45, doi: '#', firstAuthor: false },
      ],
      topCited: [
        { title: 'DRAM Scheduling for ML Workloads', year: 2022, venue: 'MICRO 2022', citations: 92, doi: '#', firstAuthor: true },
        { title: 'Memory Hierarchy Optimization for Transformer Models', year: 2023, venue: 'HPCA 2023', citations: 78, doi: '#', firstAuthor: false },
        { title: 'Cache-Aware Deep Learning Acceleration', year: 2023, venue: 'ISCA 2023', citations: 56, doi: '#', firstAuthor: true },
      ],
      firstAuthor: [
        { title: 'Cache-Aware Deep Learning Acceleration', year: 2023, venue: 'ISCA 2023', citations: 56, score: 0.74, doi: '#', firstAuthor: true },
        { title: 'DRAM Scheduling for ML Workloads', year: 2022, venue: 'MICRO 2022', citations: 92, score: 0.61, doi: '#', firstAuthor: true },
      ],
    },
  },
  {
    id: 4,
    name: 'Amit Sahai',
    email: 'sahai@cs.ucla.edu',
    department: 'Computer Science',
    university: 'UCLA',
    universityRank: 46,
    bioUrl: 'https://samueli.ucla.edu/people/amit-sahai/',
    scholarUrl: 'https://scholar.google.com/citations?user=AmitSahaiUCLA',
    hIndex: 65,
    totalCitations: 31800,
    relevance: 'med',
    tags: ['Cryptography', 'Zero-Knowledge Proofs', 'LLM Output Verification', 'Secure Computation'],
    status: 'sent',
    notes: 'Sent on 2025-08-15. Very famous in crypto. Mentioned LLM verification in recent talk.',
    emailDraft:
      'Dear Professor Sahai,\n\nI am reaching out regarding your recent work on zero-knowledge proofs for LLM output verification, which I found particularly exciting from a trustworthy AI perspective...',
    emailSubject: 'PhD Inquiry — Interest in ZK-Proofs for LLM Verification',
    papers: {
      last5: [
        { title: 'Zero-Knowledge Proofs for LLM Output Verification', year: 2024, venue: 'CRYPTO 2024', citations: 23, doi: '#', firstAuthor: false },
        { title: 'Obfuscation-Based Privacy for Federated AI Systems', year: 2024, venue: 'STOC 2024', citations: 11, doi: '#', firstAuthor: true },
        { title: 'Secure Multi-Party Computation for Federated Learning', year: 2023, venue: 'CCS 2023', citations: 89, doi: '#', firstAuthor: false },
        { title: 'Functional Encryption and its Applications to ML Privacy', year: 2023, venue: 'EUROCRYPT 2023', citations: 234, doi: '#', firstAuthor: true },
        { title: 'Indistinguishability Obfuscation: Theory and Practice', year: 2022, venue: 'JACM 2022', citations: 445, doi: '#', firstAuthor: false },
      ],
      topCited: [
        { title: 'Indistinguishability Obfuscation: Theory and Practice', year: 2022, venue: 'JACM 2022', citations: 445, doi: '#', firstAuthor: false },
        { title: 'Functional Encryption and its Applications to ML Privacy', year: 2023, venue: 'EUROCRYPT 2023', citations: 234, doi: '#', firstAuthor: true },
        { title: 'Secure Multi-Party Computation for Federated Learning', year: 2023, venue: 'CCS 2023', citations: 89, doi: '#', firstAuthor: false },
      ],
      firstAuthor: [
        { title: 'Functional Encryption and its Applications to ML Privacy', year: 2023, venue: 'EUROCRYPT 2023', citations: 234, score: 0.92, doi: '#', firstAuthor: true },
        { title: 'Obfuscation-Based Privacy for Federated AI Systems', year: 2024, venue: 'STOC 2024', citations: 11, score: 0.68, doi: '#', firstAuthor: true },
      ],
    },
  },
];

export function clonePhdDashboardFaculty() {
  return JSON.parse(JSON.stringify(PHD_DASHBOARD_FACULTY));
}

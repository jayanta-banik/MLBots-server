import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import apiClient from '../utils/apiClient.js';
import '../styles/phd_dashboard.css';

const PAPER_SET_LABELS = {
  last5: 'Most Recent',
  topCited: 'Top Cited (Last 3 Years)',
  firstAuthor: 'Top First-Author (Scored)',
};

const PHD_DASHBOARD_TARGET_PER_DAY = 5;
const DEFAULT_DEPARTMENT = 'Department unavailable';

const RELEVANCE_META = {
  high: {
    cardLabel: '↑ High',
    panelLabel: '↑ High relevance',
    className: 'phd-relevance-high',
  },
  med: {
    cardLabel: '~ Med',
    panelLabel: '~ Medium relevance',
    className: 'phd-relevance-med',
  },
  low: {
    cardLabel: '↓ Low',
    panelLabel: '↓ Low relevance',
    className: 'phd-relevance-low',
  },
};

const numberFormatter = new Intl.NumberFormat('en-US');

function getStatusClassName(status) {
  return `phd-tag phd-status-${status}`;
}

function getRelevanceMeta(relevance) {
  return RELEVANCE_META[relevance] ?? RELEVANCE_META.low;
}

function buildScholarUrl(googleScholarId) {
  if (!googleScholarId) {
    return '';
  }

  return `https://scholar.google.com/citations?user=${encodeURIComponent(googleScholarId)}`;
}

function normalizeUniversityDirectory(universities) {
  return universities.flatMap((university) =>
    (university.faculties ?? []).map((faculty) => ({
      id: faculty.id,
      name: faculty.name,
      email: '',
      department: DEFAULT_DEPARTMENT,
      university: university.name,
      location: university.location,
      state: university.state,
      universityRank: null,
      bioUrl: '',
      scholarUrl: buildScholarUrl(faculty.googleScholarId),
      googleScholarId: faculty.googleScholarId ?? '',
      hIndex: null,
      totalCitations: null,
      relevance: 'low',
      tags: [`${university.location}, ${university.state}`, faculty.googleScholarId ? 'Google Scholar linked' : 'Scholar profile unavailable'],
      status: 'pending',
      notes: '',
      emailDraft: '',
      emailSubject: '',
      papers: {
        last5: [],
        topCited: [],
        firstAuthor: [],
      },
      createdAt: faculty.createdAt,
    })),
  );
}

function filterFacultyList(faculty, filters) {
  const searchValue = filters.search.trim().toLowerCase();

  return faculty.filter((entry) => {
    if (filters.status !== 'all' && entry.status !== filters.status) {
      return false;
    }

    if (filters.uni !== 'all' && entry.university !== filters.uni) {
      return false;
    }

    if (filters.dept !== 'all' && entry.department !== filters.dept) {
      return false;
    }

    if (filters.rel !== 'all' && entry.relevance !== filters.rel) {
      return false;
    }

    if (
      searchValue &&
      ![
        entry.name,
        entry.department,
        entry.university,
        entry.location,
        entry.state,
        entry.tags.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    ) {
      return false;
    }

    return true;
  });
}

function buildDraft(entry) {
  const topPaper = entry.papers.firstAuthor[0] ?? entry.papers.last5[0];
  const lastName = entry.name.split(' ').slice(-1)[0];
  const researchArea = entry.department !== DEFAULT_DEPARTMENT ? entry.department : `${entry.university} research`;
  const paperReference = topPaper
    ? `I recently read your paper "${topPaper.title}" (${topPaper.year}), and I found your approach to ${researchArea.toLowerCase()} particularly compelling.`
    : `I have been reviewing your work at ${entry.university}, and I found the direction of your research particularly compelling.`;

  return {
    subject: `PhD Inquiry — ${entry.university} ${entry.department !== DEFAULT_DEPARTMENT ? entry.department : 'Research'}`,
    body: `Dear Professor ${lastName},

I am writing to express my strong interest in joining your research group as a PhD student. ${paperReference}

[Add 2-3 sentences connecting your background to their specific research.]

I am particularly interested in the research happening in your group at ${entry.university}, and I believe there is strong alignment with my background and interests.

I would be grateful for the opportunity to discuss potential PhD positions in your group. I have attached my CV and research statement for your consideration.

Thank you for your time.

Best regards,
[Your Name]
[Your Institution]
[Your Email]`,
  };
}

function FacultyCard({ entry, isSelected, onSelect }) {
  const relevanceMeta = getRelevanceMeta(entry.relevance);

  return (
    <button type="button" className={`phd-faculty-card${isSelected ? ' phd-faculty-card--selected' : ''}`} onClick={() => onSelect(entry.id)}>
      <div className="phd-faculty-card__row">
        <div className="phd-faculty-card__title">{entry.name}</div>
        <div className="phd-inline-row">
          <span className={getStatusClassName(entry.status)}>{entry.status}</span>
        </div>
      </div>
      <div className="phd-faculty-card__meta">
        {entry.department} • {entry.university}
      </div>
      <div className="phd-tag-row">
        <span className={`phd-tag ${relevanceMeta.className}`}>{relevanceMeta.cardLabel}</span>
        {entry.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="phd-tag phd-tag--plain">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function PaperCard({ paper }) {
  return (
    <div className="phd-paper-card">
      <div className="phd-paper-card__row">
        <div>
          <a
            href={paper.doi}
            className="phd-paper-card__title"
            onClick={(event) => {
              if (paper.doi === '#') {
                event.preventDefault();
              }
            }}
          >
            {paper.title}
          </a>
          <div className="phd-paper-card__meta">
            <span>{paper.venue}</span>
            <span>•</span>
            <span>{paper.year}</span>
            {paper.firstAuthor ? <span className="phd-tag phd-tag--plain">First Author</span> : null}
          </div>

          {paper.score !== undefined ? (
            <div className="phd-score">
              <div className="phd-score__meta">
                <span>Score (4×recency + 6×citations)</span>
                <strong>{paper.score.toFixed(2)}</strong>
              </div>
              <div className="phd-score__track">
                <div className="phd-score__fill" style={{ width: `${Math.round(paper.score * 100)}%` }} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="phd-paper-card__citations">
          <strong>{paper.citations}</strong>
          <span>citations</span>
        </div>
      </div>
    </div>
  );
}

function PhdDashboardPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const copyTimerRef = useRef(null);
  const descriptionTimerRef = useRef(null);

  const [faculty, setFaculty] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('papers');
  const [currentPaperSet, setCurrentPaperSet] = useState('last5');
  const [dailyQueueMode, setDailyQueueMode] = useState(false);
  const [dailyQueueIds, setDailyQueueIds] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    uni: 'all',
    dept: 'all',
    rel: 'all',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [myDescription, setMyDescription] = useState('');
  const [descriptionSaved, setDescriptionSaved] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copy to Clipboard');

  useEffect(
    () => () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }

      if (descriptionTimerRef.current) {
        window.clearTimeout(descriptionTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadFacultyDirectory() {
      setLoadStatus('loading');
      setLoadError('');

      try {
        const response = await apiClient().get('/universities');

        if (!isMounted) {
          return;
        }

        setFaculty(normalizeUniversityDirectory(response.data.universities ?? []));
        setLoadStatus('success');
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setFaculty([]);
        setLoadStatus('error');
        setLoadError(requestError.response?.data?.message ?? requestError.message ?? 'Unable to load faculty from the API.');
      }
    }

    loadFacultyDirectory();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedFaculty = faculty.find((entry) => entry.id === selectedId) ?? null;
  const listFaculty = dailyQueueMode ? dailyQueueIds.map((id) => faculty.find((entry) => entry.id === id)).filter(Boolean) : filterFacultyList(faculty, filters);
  const availableUniversities = Array.from(new Set(faculty.map((entry) => entry.university))).sort((leftValue, rightValue) => leftValue.localeCompare(rightValue));
  const availableDepartments = Array.from(new Set(faculty.map((entry) => entry.department))).sort((leftValue, rightValue) => leftValue.localeCompare(rightValue));
  const totalCount = faculty.length;
  const pendingCount = faculty.filter((entry) => entry.status === 'pending').length;
  const sentCount = faculty.filter((entry) => entry.status === 'sent').length;
  const repliedCount = faculty.filter((entry) => entry.status === 'replied').length;
  const skippedCount = faculty.filter((entry) => entry.status === 'skipped').length;
  const todayCount = Math.min(sentCount, PHD_DASHBOARD_TARGET_PER_DAY);
  const todayProgress = `${(todayCount / PHD_DASHBOARD_TARGET_PER_DAY) * 100}%`;
  const paperSet = selectedFaculty ? selectedFaculty.papers[currentPaperSet] : [];

  function handleFacultySelect(id) {
    setCopyLabel('Copy to Clipboard');
    setSelectedId(id);
    setActiveTab('papers');
    setCurrentPaperSet('last5');
  }

  function handleFilterChange(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleDailyQueue() {
    setDailyQueueMode((currentMode) => {
      const nextMode = !currentMode;

      setDailyQueueIds(nextMode ? faculty.filter((entry) => entry.status === 'pending').slice(0, PHD_DASHBOARD_TARGET_PER_DAY).map((entry) => entry.id) : []);

      return nextMode;
    });
  }

  function updateSelectedFaculty(updater) {
    if (!selectedId) {
      return;
    }

    setFaculty((currentFaculty) => currentFaculty.map((entry) => (entry.id === selectedId ? updater(entry) : entry)));
  }

  function handleSubjectChange(event) {
    const nextValue = event.target.value;

    updateSelectedFaculty((entry) => ({
      ...entry,
      emailSubject: nextValue,
    }));
  }

  function handleDraftChange(event) {
    const nextValue = event.target.value;

    updateSelectedFaculty((entry) => ({
      ...entry,
      emailDraft: nextValue,
      status: entry.status === 'pending' ? 'drafting' : entry.status,
    }));
  }

  function handleNotesChange(event) {
    const nextValue = event.target.value;

    updateSelectedFaculty((entry) => ({
      ...entry,
      notes: nextValue,
    }));
  }

  async function handleCopyEmail() {
    if (!selectedFaculty) {
      return;
    }

    const text = selectedFaculty.emailSubject ? `Subject: ${selectedFaculty.emailSubject}\n\n${selectedFaculty.emailDraft}` : selectedFaculty.emailDraft;

    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel('Copied!');
    } catch {
      setCopyLabel('Copy failed');
    }

    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = window.setTimeout(() => {
      setCopyLabel('Copy to Clipboard');
    }, 2000);
  }

  function markStatus(nextStatus) {
    if (!selectedId) {
      return;
    }

    let nextFacultyId = null;

    setFaculty((currentFaculty) => {
      const updatedFaculty = currentFaculty.map((entry) => (entry.id === selectedId ? { ...entry, status: nextStatus } : entry));

      if (nextStatus === 'sent' || nextStatus === 'replied' || nextStatus === 'skipped') {
        const source = dailyQueueMode ? dailyQueueIds.map((id) => updatedFaculty.find((entry) => entry.id === id)).filter(Boolean) : filterFacultyList(updatedFaculty, filters);
        const currentIndex = source.findIndex((entry) => entry.id === selectedId);
        nextFacultyId = source[currentIndex + 1]?.id ?? null;
      }

      return updatedFaculty;
    });

    if (nextFacultyId) {
      window.setTimeout(() => {
        setCopyLabel('Copy to Clipboard');
        setSelectedId(nextFacultyId);
      }, 300);
    }
  }

  function handleGenerateDraft() {
    if (!selectedFaculty) {
      return;
    }

    const generatedDraft = buildDraft(selectedFaculty);

    updateSelectedFaculty((entry) => ({
      ...entry,
      emailSubject: generatedDraft.subject,
      emailDraft: generatedDraft.body,
      status: entry.status === 'pending' ? 'drafting' : entry.status,
    }));
  }

  function handleResumeUpload(event) {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      return;
    }

    setResumeFile(nextFile);
  }

  function clearResume() {
    setResumeFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleDescriptionChange(event) {
    setMyDescription(event.target.value);
    setDescriptionSaved(true);

    if (descriptionTimerRef.current) {
      window.clearTimeout(descriptionTimerRef.current);
    }

    descriptionTimerRef.current = window.setTimeout(() => {
      setDescriptionSaved(false);
    }, 1500);
  }

  return (
    <motion.div className="phd-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="phd-header">
        <div className="phd-header__brand">
          <span className="phd-header__icon">🤖</span>
          <div>
            <div className="phd-header__title">MLBots PhD Outreach Dashboard</div>
            <div className="phd-header__subtitle">MLBots campaign workspace</div>
          </div>
        </div>

        <div className="phd-header__actions">
          <div className="phd-stats">
            <span>
              Total <strong>{totalCount}</strong>
            </span>
            <span className="phd-stats__warning">
              Pending <strong>{pendingCount}</strong>
            </span>
            <span className="phd-stats__success">
              Sent <strong>{sentCount}</strong>
            </span>
            <span className="phd-stats__teal">
              Replied <strong>{repliedCount}</strong>
            </span>
            <span className="phd-stats__danger">
              Skipped <strong>{skippedCount}</strong>
            </span>
          </div>

          <div className="phd-progress">
            <span>
              Today: <strong>{todayCount}</strong>/{PHD_DASHBOARD_TARGET_PER_DAY}
            </span>
            <div className="phd-progress__track">
              <div className="phd-progress__fill" style={{ width: todayProgress }} />
            </div>
          </div>

          <button type="button" className="phd-button phd-button--ghost" onClick={() => navigate('/tracking-uni')}>
            Back to facility dashboard
          </button>

          <button type="button" className={`phd-button ${dailyQueueMode ? 'phd-button--queue-active' : 'phd-button--queue'}`} onClick={toggleDailyQueue}>
            Daily Queue
          </button>
        </div>
      </header>

      <div className="phd-layout">
        <aside className="phd-sidebar">
          <div className="phd-sidebar__content">
            <div>
              <input className="phd-input" type="text" placeholder="Search faculty..." value={filters.search} onChange={(event) => handleFilterChange('search', event.target.value)} />
            </div>

            <section>
              <div className="phd-section__label">Status</div>
              <div className="phd-radio-group">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'drafting', label: 'Drafting' },
                  { value: 'sent', label: 'Sent' },
                  { value: 'replied', label: 'Replied' },
                  { value: 'skipped', label: 'Skipped' },
                ].map((option) => (
                  <label key={option.value} className="phd-radio">
                    <input type="radio" name="phd-filter-status" checked={filters.status === option.value} onChange={() => handleFilterChange('status', option.value)} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="phd-section__label">University</div>
              <select className="phd-select" value={filters.uni} onChange={(event) => handleFilterChange('uni', event.target.value)}>
                <option value="all">All Universities</option>
                {availableUniversities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <div className="phd-section__label">Department</div>
              <select className="phd-select" value={filters.dept} onChange={(event) => handleFilterChange('dept', event.target.value)}>
                <option value="all">All Departments</option>
                {availableDepartments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <div className="phd-section__label">Relevance</div>
              <select className="phd-select" value={filters.rel} onChange={(event) => handleFilterChange('rel', event.target.value)}>
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="med">Medium</option>
                <option value="low">Low</option>
              </select>
            </section>

            <section className="phd-sidebar__profile">
              <div className="phd-section__label">My Profile</div>

              <div className="phd-field">
                <label className="phd-field__label">Resume / CV</label>

                {!resumeFile ? (
                  <label className="phd-upload-label">
                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="phd-hidden" onChange={handleResumeUpload} />
                    <span>⇪</span>
                    <span>Upload PDF / DOC</span>
                  </label>
                ) : (
                  <div className="phd-uploaded">
                    <div className="phd-uploaded__name">✓ {resumeFile.name}</div>
                    <button type="button" className="phd-button phd-button--plain" onClick={clearResume}>
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="phd-field">
                <label className="phd-field__label">Research Background</label>
                <textarea
                  className="phd-textarea"
                  rows="5"
                  value={myDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Describe your research background, interests, and what you're looking for in a PhD advisor. Used to personalize AI-generated email drafts."
                />
                <div className={`phd-save-indicator${descriptionSaved ? ' phd-save-indicator--visible' : ''}`}>Saved</div>
              </div>
            </section>
          </div>
        </aside>

        <section className="phd-list-panel">
          <div className="phd-list-panel__header">
            <span>{listFaculty.length} faculty</span>
            {dailyQueueMode ? <span className="phd-list-panel__badge">Daily Queue Mode</span> : null}
          </div>

          <div className="phd-list-panel__body">
            {loadStatus === 'loading' ? (
              <div className="phd-list-empty">Loading faculty from the API...</div>
            ) : null}

            {loadStatus === 'error' ? (
              <div className="phd-list-empty">
                <div>{loadError}</div>
                <button type="button" className="phd-button phd-button--ghost" onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            ) : null}

            {loadStatus === 'success' && listFaculty.length === 0 ? (
              <div className="phd-list-empty">No faculty match your filters.</div>
            ) : null}

            {loadStatus === 'success' && listFaculty.length > 0 ? (
              listFaculty.map((entry) => <FacultyCard key={entry.id} entry={entry} isSelected={entry.id === selectedId} onSelect={handleFacultySelect} />)
            ) : null}
          </div>
        </section>

        <section className="phd-profile">
          {!selectedFaculty ? (
            <div className="phd-empty-state">
              <div className="phd-empty-state__icon">{loadStatus === 'loading' ? '…' : '👤'}</div>
              <div>
                {loadStatus === 'loading'
                  ? 'Loading faculty from the API...'
                  : loadStatus === 'error'
                    ? loadError
                    : faculty.length === 0
                      ? 'No faculty data has been returned by the API yet.'
                      : 'Select a faculty member to view their profile'}
              </div>
            </div>
          ) : (
            <div className="phd-profile-panel">
              <div className="phd-profile-header">
                <div className="phd-profile-header__row">
                  <div>
                    <div className="phd-inline-row">
                      <h2 className="phd-profile-header__title">{selectedFaculty.name}</h2>
                      <span className={getStatusClassName(selectedFaculty.status)}>{selectedFaculty.status}</span>
                      <span className={`phd-tag ${getRelevanceMeta(selectedFaculty.relevance).className}`}>{getRelevanceMeta(selectedFaculty.relevance).panelLabel}</span>
                    </div>

                    <div className="phd-profile-meta">
                      <span>{selectedFaculty.department}</span>
                      <span>•</span>
                      <span>{selectedFaculty.university}</span>
                      <span>•</span>
                      <span>
                        {selectedFaculty.location}, {selectedFaculty.state}
                      </span>
                      {selectedFaculty.universityRank ? (
                        <>
                          <span>•</span>
                          <span>Rank #{selectedFaculty.universityRank}</span>
                        </>
                      ) : null}
                    </div>

                    <div className="phd-profile-links">
                      {selectedFaculty.email ? <a href={`mailto:${selectedFaculty.email}`}>{selectedFaculty.email}</a> : <span className="phd-link-muted">Email not available from API</span>}
                      {selectedFaculty.scholarUrl ? (
                        <a href={selectedFaculty.scholarUrl} target="_blank" rel="noreferrer">
                          Google Scholar
                        </a>
                      ) : (
                        <span className="phd-link-muted">Google Scholar not available</span>
                      )}
                    </div>
                  </div>

                  <div className="phd-profile-stats">
                    <div>
                      <div className="phd-profile-stats__value">{selectedFaculty.hIndex ?? '—'}</div>
                      <div className="phd-profile-stats__label">h-index</div>
                    </div>
                    <div>
                      <div className="phd-profile-stats__value">{selectedFaculty.totalCitations === null ? '—' : numberFormatter.format(selectedFaculty.totalCitations)}</div>
                      <div className="phd-profile-stats__label">citations</div>
                    </div>
                  </div>
                </div>

                <div className="phd-tag-row">
                  {selectedFaculty.tags.map((tag) => (
                    <span key={tag} className="phd-tag phd-tag--plain">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="phd-tabs">
                {[
                  { value: 'papers', label: 'Papers' },
                  { value: 'email', label: 'Email Composer' },
                  { value: 'notes', label: 'Notes' },
                ].map((tab) => (
                  <button key={tab.value} type="button" className={`phd-tab${activeTab === tab.value ? ' phd-tab--active' : ''}`} onClick={() => setActiveTab(tab.value)}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'papers' ? (
                <div className="phd-tab-panel">
                  <div className="phd-paper-switcher">
                    {[
                      { value: 'last5', label: 'Last 5 Papers' },
                      { value: 'topCited', label: 'Top 3 Cited (3yr)' },
                      { value: 'firstAuthor', label: 'Top 2 First-Author' },
                    ].map((paperSetOption) => (
                      <button
                        key={paperSetOption.value}
                        type="button"
                        className={`phd-button ${currentPaperSet === paperSetOption.value ? 'phd-button--ghost' : 'phd-button--plain'}`}
                        onClick={() => setCurrentPaperSet(paperSetOption.value)}
                      >
                        {paperSetOption.label}
                      </button>
                    ))}
                  </div>

                  <div className="phd-section-muted">{PAPER_SET_LABELS[currentPaperSet]}</div>

                  {paperSet.length === 0 ? <div className="phd-list-empty">Publication data is not exposed by the API yet.</div> : null}

                  {paperSet.map((paper) => (
                    <PaperCard key={`${currentPaperSet}-${paper.title}`} paper={paper} />
                  ))}
                </div>
              ) : null}

              {activeTab === 'email' ? (
                <div className="phd-tab-panel">
                  <div className="phd-section-muted">
                    Compose your email to <strong>{selectedFaculty.name}</strong>
                  </div>

                  {!selectedFaculty.email ? <div className="phd-section-muted">Email address is not available from the API yet. You can still draft and copy outreach text here.</div> : null}

                  <div className="phd-field">
                    <button type="button" className="phd-button phd-button--secondary" onClick={handleGenerateDraft}>
                      AI Draft
                    </button>
                  </div>

                  <div className="phd-field">
                    <label className="phd-field__label">Subject</label>
                    <input className="phd-input" type="text" value={selectedFaculty.emailSubject} onChange={handleSubjectChange} placeholder="PhD Inquiry — [Your Name], [Your University]" />
                  </div>

                  <div className="phd-field">
                    <label className="phd-field__label">Body</label>
                    <textarea className="phd-textarea" rows="14" value={selectedFaculty.emailDraft} onChange={handleDraftChange} placeholder="Write your personalized email here..." />
                  </div>

                  <div className="phd-email-actions">
                    <button type="button" className="phd-button phd-button--primary" onClick={handleCopyEmail}>
                      {copyLabel}
                    </button>
                    <button type="button" className="phd-button phd-button--success" onClick={() => markStatus('sent')}>
                      Mark as Sent
                    </button>
                    <button type="button" className="phd-button phd-button--teal" onClick={() => markStatus('replied')}>
                      Got a Reply
                    </button>
                    <button type="button" className="phd-button phd-button--ghost" onClick={() => markStatus('skipped')}>
                      Skip
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === 'notes' ? (
                <div className="phd-tab-panel">
                  <div className="phd-field">
                    <label className="phd-field__label">Private notes about this professor</label>
                    <textarea className="phd-textarea" rows="12" value={selectedFaculty.notes} onChange={handleNotesChange} placeholder="e.g. Met at NeurIPS 2024. Interested in multimodal reasoning. Prefers brief cold emails..." />
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
}

export default PhdDashboardPage;

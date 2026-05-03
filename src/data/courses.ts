export type MaterialStatus = 'New' | 'Updated' | 'Available' | 'Coming soon' | null
export type MaterialType = 'slides' | 'seminar' | 'recording' | 'reading'
export type AssignmentStatus = 'Not submitted' | 'In progress' | 'Submitted'
export type UpdateIconType = 'file' | 'clipboard' | 'megaphone' | 'book' | 'message'

export interface CourseMaterial { type: MaterialType; label: string; status: MaterialStatus }
export interface CourseWeek { week: string; title: string; dates: string; materials: CourseMaterial[] }

export interface CourseAssignment {
  slug: string
  title: string
  type: string
  due: string
  weighting: string
  status: AssignmentStatus
  description: string
  fileFormats: string
  maxFileSize: string
  namingConvention: string
  namingExample: string
  mockFileName: string
  mockFileSize: string
  submissionId: string
  checklist: string[]
}

export interface CourseAnnouncement {
  title: string; author: string; initials: string
  date: string; preview: string; isNew: boolean
}

export interface CourseRecentUpdate {
  icon: UpdateIconType; title: string; sub: string; time: string; unread: boolean
}

export interface CourseOverview {
  credits: string; level: string; school: string
  programme: string; courseStart: string; courseEnd: string
}

export interface CourseNextClass {
  title: string; date: string; time: string; location: string; lecturer: string
}

export interface Course {
  id: number
  slug: string
  title: string
  code: string
  lecturer: string
  lecturerInitials: string
  school: string
  semester: string
  description: string
  progress: number
  accent: string
  favourited: boolean
  overview: CourseOverview
  nextClass: CourseNextClass
  weeklyMaterials: CourseWeek[]
  assignments: CourseAssignment[]
  announcements: CourseAnnouncement[]
  recentUpdates: CourseRecentUpdate[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wk(
  week: string, title: string, dates: string,
  s1: MaterialStatus, s2: MaterialStatus, s3: MaterialStatus, s4: MaterialStatus,
): CourseWeek {
  return {
    week, title, dates,
    materials: [
      { type: 'slides',    label: 'Lecture Slides',    status: s1 },
      { type: 'seminar',   label: 'Seminar Materials', status: s2 },
      { type: 'recording', label: 'Recording',         status: s3 },
      { type: 'reading',   label: 'Reading',           status: s4 },
    ],
  }
}

const STD_CHECKLIST = [
  'Include your student number on the first page',
  'Combine your submission into one file only',
  'Check that all content is clearly visible',
  'Make sure the file opens correctly before upload',
]

// ─── Course data ──────────────────────────────────────────────────────────────

export const COURSES: Course[] = [
  // ── 1. Molecular Biology ──────────────────────────────────────────────────
  {
    id: 1,
    slug: 'molecular-biology',
    title: 'Molecular Biology',
    code: 'BIOL08019',
    lecturer: 'Dr. Sarah Collins',
    lecturerInitials: 'SC',
    school: 'School of Biological Sciences',
    semester: 'Semester 2, 2024/25',
    description: 'Molecular mechanisms of cell function, genetics, protein synthesis, and biological regulation.',
    progress: 72,
    accent: '#2563EB',
    favourited: true,
    overview: {
      credits: '20 credits', level: 'Level 8',
      school: 'School of Biological Sciences', programme: 'BSc (Hons) Biology',
      courseStart: '20 January 2025', courseEnd: '16 May 2025',
    },
    nextClass: {
      title: 'Molecular Biology Lecture',
      date: 'Tomorrow, 15 May 2025', time: '10:00 – 11:00',
      location: 'David Hume Tower 2.12', lecturer: 'Dr. Sarah Collins',
    },
    weeklyMaterials: [
      wk('Week 8',  'Cell Signalling', '12 – 18 May',    'New',     'New',     'Available',   'New'),
      wk('Week 9',  'Gene Expression', '19 – 25 May',    'Updated', 'New',     'Available',   'New'),
      wk('Week 10', 'DNA Replication', '26 May – 1 Jun', 'New',     'New',     'Coming soon', null),
    ],
    assignments: [
      {
        slug: 'lab-report-2-enzyme-kinetics',
        title: 'Lab Report 2: Enzyme Kinetics',
        type: 'Individual assignment',
        due: 'Sun, 1 Jun, 17:00', weighting: '15%', status: 'In progress',
        description: 'Investigate enzyme kinetics using spectrophotometric assays and analyse the results.',
        fileFormats: 'PDF or DOCX', maxFileSize: '20 MB',
        namingConvention: 'LAB2_YourStudentID_YourName', namingExample: 'LAB2_S1234567_AvaBrown.pdf',
        mockFileName: 'LAB2_S1234567_AvaBrown.pdf', mockFileSize: '1.8 MB',
        submissionId: 'SUB-2025-BIOL08019-002',
        checklist: STD_CHECKLIST,
      },
      {
        slug: 'essay-signal-transduction-pathways',
        title: 'Essay: Signal Transduction Pathways',
        type: 'Individual essay',
        due: 'Fri, 23 May, 17:00', weighting: '25%', status: 'Not submitted',
        description: 'Critically analyse two signal transduction pathways and their role in cellular response.',
        fileFormats: 'PDF or DOCX', maxFileSize: '15 MB',
        namingConvention: 'ESSAY_YourStudentID_YourName', namingExample: 'ESSAY_S1234567_AvaBrown.pdf',
        mockFileName: 'ESSAY_S1234567_AvaBrown.pdf', mockFileSize: '1.2 MB',
        submissionId: 'SUB-2025-BIOL08019-001',
        checklist: [
          'Include your student number and essay title on the first page',
          'Ensure your essay does not exceed the word limit',
          'Reference all sources using the required citation style',
          'Make sure the file opens correctly before upload',
        ],
      },
    ],
    announcements: [
      {
        title: 'Updated lecture slides for Week 8',
        author: 'Dr. Sarah Collins', initials: 'SC', date: 'Posted 13 May 2025',
        preview: 'The revised slides for the GPCR signalling lecture are now available in the Weekly Materials section. Key diagrams have been updated to reflect the latest content covered in Tuesday\'s class.',
        isNew: true,
      },
      {
        title: 'Lab session change – Week 9',
        author: 'Dr. Sarah Collins', initials: 'SC', date: 'Posted 12 May 2025',
        preview: 'Please note that the Thursday lab session in Week 9 has been moved to Friday 23 May at the same time. Room allocation remains unchanged.',
        isNew: true,
      },
    ],
    recentUpdates: [
      { icon: 'file',      title: 'Lecture slides uploaded',    sub: 'Week 8: Cell Signalling',          time: '2h ago', unread: true  },
      { icon: 'clipboard', title: 'Seminar materials uploaded',  sub: 'Week 8: Cell Signalling',          time: '3h ago', unread: true  },
      { icon: 'megaphone', title: 'New announcement',           sub: 'Updated lecture slides for Week 8', time: '1d ago', unread: false },
    ],
  },

  // ── 2. Sociology ──────────────────────────────────────────────────────────
  {
    id: 2,
    slug: 'sociology',
    title: 'Sociology',
    code: 'SOCI08001',
    lecturer: 'Dr. James Stewart',
    lecturerInitials: 'JS',
    school: 'School of Social & Political Science',
    semester: 'Semester 2, 2024/25',
    description: 'Critical introduction to sociological thinking, social structures, inequality, and culture.',
    progress: 58,
    accent: '#7C3AED',
    favourited: false,
    overview: {
      credits: '20 credits', level: 'Level 8',
      school: 'School of Social & Political Science', programme: 'MA (Hons) Sociology',
      courseStart: '20 January 2025', courseEnd: '16 May 2025',
    },
    nextClass: {
      title: 'Sociology Seminar',
      date: 'Today, 14 May 2025', time: '11:00 – 12:00',
      location: 'Chrystal MacMillan G.06', lecturer: 'Dr. James Stewart',
    },
    weeklyMaterials: [
      wk('Week 8',  'Urban Space & Power', '12 – 18 May',    'New',     'New',         'Available',   'New'),
      wk('Week 9',  'Social Mobility',     '19 – 25 May',    'Updated', 'Coming soon', 'Available',   'New'),
      wk('Week 10', 'Culture & Identity',  '26 May – 1 Jun', 'New',     'New',         'Coming soon', null),
    ],
    assignments: [
      {
        slug: 'critical-analysis-globalisation-culture',
        title: 'Critical Analysis: Globalisation and Culture',
        type: 'Individual essay',
        due: 'Fri, 16 May, 17:00', weighting: '30%', status: 'In progress',
        description: 'Critically analyse the relationship between globalisation and cultural identity using sociological perspectives.',
        fileFormats: 'PDF or DOCX', maxFileSize: '15 MB',
        namingConvention: 'SOCI_CA_YourStudentID', namingExample: 'SOCI_CA_S1234567_AvaBrown.pdf',
        mockFileName: 'SOCI_CA_S1234567_AvaBrown.pdf', mockFileSize: '1.4 MB',
        submissionId: 'SUB-2025-SOCI08001-001',
        checklist: [
          'Include your student number and module code on the first page',
          'Ensure your essay meets the required word count',
          'Use Harvard referencing for all citations',
          'Make sure the file opens correctly before upload',
        ],
      },
      {
        slug: 'seminar-reflection-portfolio',
        title: 'Seminar Reflection Portfolio',
        type: 'Portfolio',
        due: 'Thu, 29 May, 12:00', weighting: '20%', status: 'Not submitted',
        description: 'Compile a portfolio of reflective notes from at least six seminar sessions throughout the semester.',
        fileFormats: 'PDF', maxFileSize: '25 MB',
        namingConvention: 'SOCI_PORTFOLIO_YourStudentID', namingExample: 'SOCI_PORTFOLIO_S1234567_AvaBrown.pdf',
        mockFileName: 'SOCI_PORTFOLIO_S1234567_AvaBrown.pdf', mockFileSize: '2.1 MB',
        submissionId: 'SUB-2025-SOCI08001-002',
        checklist: STD_CHECKLIST,
      },
    ],
    announcements: [
      {
        title: 'Room Change: Seminar on 15 May',
        author: 'Dr. James Stewart', initials: 'JS', date: 'Posted 13 May 2025',
        preview: 'The seminar scheduled for 15 May has been moved to room G.10 in Chrystal MacMillan Building. Please arrive on time as a quiz will begin promptly.',
        isNew: true,
      },
      {
        title: 'New seminar discussion prompt posted',
        author: 'Dr. James Stewart', initials: 'JS', date: 'Posted 11 May 2025',
        preview: 'A new discussion prompt for the seminar on social mobility has been posted to the course page. Please read the assigned chapter before attending.',
        isNew: false,
      },
    ],
    recentUpdates: [
      { icon: 'megaphone', title: 'Room change announcement',   sub: 'Seminar on 15 May',              time: '4h ago', unread: true  },
      { icon: 'file',      title: 'Lecture slides uploaded',    sub: 'Week 8: Urban Space & Power',    time: '1d ago', unread: false },
      { icon: 'message',   title: 'New discussion prompt',      sub: 'Week 9: Social Mobility',        time: '3d ago', unread: false },
    ],
  },

  // ── 3. Marketing ─────────────────────────────────────────────────────────
  {
    id: 3,
    slug: 'marketing',
    title: 'Marketing',
    code: 'MGTS08018',
    lecturer: 'Dr. Ana Martinez',
    lecturerInitials: 'AM',
    school: 'Business School',
    semester: 'Semester 2, 2024/25',
    description: 'Core marketing principles: market research, consumer behaviour, branding, and digital strategy.',
    progress: 45,
    accent: '#F97316',
    favourited: false,
    overview: {
      credits: '20 credits', level: 'Level 8',
      school: 'Business School', programme: 'BBA (Hons) Business Management',
      courseStart: '20 January 2025', courseEnd: '16 May 2025',
    },
    nextClass: {
      title: 'Marketing Lecture',
      date: 'Today, 14 May 2025', time: '14:00 – 15:00',
      location: 'Appleton Tower LT2', lecturer: 'Dr. Ana Martinez',
    },
    weeklyMaterials: [
      wk('Week 8',  'Consumer Behaviour', '12 – 18 May',    'New',     'New', 'Available',   'New'),
      wk('Week 9',  'Digital Marketing',  '19 – 25 May',    'Updated', 'New', 'Available',   'Updated'),
      wk('Week 10', 'Brand Management',   '26 May – 1 Jun', 'New',     'New', 'Coming soon', null),
    ],
    assignments: [
      {
        slug: 'presentation-marketing-strategy',
        title: 'Presentation: Marketing Strategy',
        type: 'Group presentation',
        due: 'Sun, 18 May, 15:00', weighting: '20%', status: 'Not submitted',
        description: 'Develop and present a comprehensive marketing strategy for a real-world brand of your choice.',
        fileFormats: 'PDF or PPTX', maxFileSize: '50 MB',
        namingConvention: 'MKTG_STRATEGY_GroupName', namingExample: 'MKTG_STRATEGY_GroupA.pdf',
        mockFileName: 'MKTG_STRATEGY_GroupA.pdf', mockFileSize: '4.2 MB',
        submissionId: 'SUB-2025-MGTS08018-001',
        checklist: [
          'Include your group name and all member student numbers',
          'Ensure slides are in the correct format (PDF or PPTX)',
          'Check that all images and charts are embedded',
          'Make sure the file opens correctly before upload',
        ],
      },
      {
        slug: 'consumer-insight-report',
        title: 'Consumer Insight Report',
        type: 'Individual report',
        due: 'Fri, 30 May, 17:00', weighting: '35%', status: 'Not submitted',
        description: 'Conduct primary research and write a report analysing consumer insights for a product or service.',
        fileFormats: 'PDF or DOCX', maxFileSize: '20 MB',
        namingConvention: 'MKTG_REPORT_YourStudentID', namingExample: 'MKTG_REPORT_S1234567_AvaBrown.pdf',
        mockFileName: 'MKTG_REPORT_S1234567_AvaBrown.pdf', mockFileSize: '2.0 MB',
        submissionId: 'SUB-2025-MGTS08018-002',
        checklist: STD_CHECKLIST,
      },
    ],
    announcements: [
      {
        title: 'Group presentation schedule released',
        author: 'Dr. Ana Martinez', initials: 'AM', date: 'Posted 12 May 2025',
        preview: 'The presentation schedule for Week 10 is now available. Please check your assigned slot and confirm your group is prepared. All groups must submit slides 24 hours before their presentation.',
        isNew: true,
      },
      {
        title: 'Week 9 reading list updated',
        author: 'Dr. Ana Martinez', initials: 'AM', date: 'Posted 10 May 2025',
        preview: 'Two additional articles on digital consumer behaviour have been added to the Week 9 reading list. These will be discussed in the seminar on 20 May.',
        isNew: false,
      },
    ],
    recentUpdates: [
      { icon: 'megaphone', title: 'Presentation schedule released', sub: 'Week 10 slots available',       time: '2d ago', unread: true  },
      { icon: 'book',      title: 'Reading list updated',           sub: 'Week 9: Digital Marketing',     time: '4d ago', unread: false },
      { icon: 'file',      title: 'Lecture slides uploaded',        sub: 'Week 8: Consumer Behaviour',    time: '5d ago', unread: false },
    ],
  },

  // ── 4. Global History ────────────────────────────────────────────────────
  {
    id: 4,
    slug: 'global-history',
    title: 'Global History',
    code: 'HIST08007',
    lecturer: 'Prof. Christopher A. Whatley',
    lecturerInitials: 'CW',
    school: 'School of History, Classics and Archaeology',
    semester: 'Semester 2, 2024/25',
    description: 'World history from early modernity to present: global connections, empires, and modern crises.',
    progress: 61,
    accent: '#1F9D55',
    favourited: true,
    overview: {
      credits: '20 credits', level: 'Level 8',
      school: 'School of History, Classics and Archaeology', programme: 'MA (Hons) History',
      courseStart: '20 January 2025', courseEnd: '16 May 2025',
    },
    nextClass: {
      title: 'Global History Lecture',
      date: 'Fri, 16 May 2025', time: '09:00 – 10:00',
      location: 'Lecture Theatre 1, George Square', lecturer: 'Prof. Christopher A. Whatley',
    },
    weeklyMaterials: [
      wk('Week 8',  'Colonialism & Resistance', '12 – 18 May',    'New',     'New',         'Available',   'New'),
      wk('Week 9',  'The Cold War Era',         '19 – 25 May',    'Updated', 'New',         'Available',   'New'),
      wk('Week 10', 'Globalisation',            '26 May – 1 Jun', 'New',     'Coming soon', 'Coming soon', null),
    ],
    assignments: [
      {
        slug: 'archival-source-commentary',
        title: 'Archival Source Commentary',
        type: 'Individual commentary',
        due: 'Tue, 20 May, 09:00', weighting: '25%', status: 'Not submitted',
        description: 'Analyse a set of primary archival sources and write a critical commentary on their historical significance.',
        fileFormats: 'PDF or DOCX', maxFileSize: '15 MB',
        namingConvention: 'HIST_COMMENTARY_YourStudentID', namingExample: 'HIST_COMMENTARY_S1234567_AvaBrown.pdf',
        mockFileName: 'HIST_COMMENTARY_S1234567_AvaBrown.pdf', mockFileSize: '1.5 MB',
        submissionId: 'SUB-2025-HIST08007-001',
        checklist: [
          'Include your student number and source reference on the first page',
          'Ensure your commentary addresses all required analysis criteria',
          'Cite all secondary sources using Chicago citation style',
          'Make sure the file opens correctly before upload',
        ],
      },
      {
        slug: 'comparative-history-essay',
        title: 'Comparative History Essay',
        type: 'Essay',
        due: 'Mon, 2 Jun, 12:00', weighting: '40%', status: 'Not submitted',
        description: 'Write a comparative essay examining two historical events or processes across different regions or periods.',
        fileFormats: 'PDF or DOCX', maxFileSize: '20 MB',
        namingConvention: 'HIST_ESSAY_YourStudentID', namingExample: 'HIST_ESSAY_S1234567_AvaBrown.pdf',
        mockFileName: 'HIST_ESSAY_S1234567_AvaBrown.pdf', mockFileSize: '1.8 MB',
        submissionId: 'SUB-2025-HIST08007-002',
        checklist: [
          'Include your student number and essay title on the first page',
          'Do not exceed the 3,000 word limit',
          'Use Chicago citation style for all references',
          'Make sure the file opens correctly before upload',
        ],
      },
    ],
    announcements: [
      {
        title: 'Essay guidelines updated',
        author: 'Prof. Christopher A. Whatley', initials: 'CW', date: 'Posted 11 May 2025',
        preview: 'The comparative essay guidelines have been updated with clearer marking criteria. Please review the updated document before beginning. A Q&A session will be held in Week 9.',
        isNew: true,
      },
      {
        title: 'Primary source archive access',
        author: 'Prof. Christopher A. Whatley', initials: 'CW', date: 'Posted 9 May 2025',
        preview: 'Instructions for accessing the National Records of Scotland digital archive have been posted. You will need your student credentials to log in. Please do this before the Week 9 seminar.',
        isNew: false,
      },
    ],
    recentUpdates: [
      { icon: 'megaphone', title: 'Essay guidelines updated',   sub: 'Updated marking criteria',           time: '3d ago', unread: true  },
      { icon: 'file',      title: 'Lecture slides uploaded',    sub: 'Week 8: Colonialism & Resistance',   time: '4d ago', unread: false },
      { icon: 'book',      title: 'New primary sources added',  sub: 'Week 9: The Cold War Era',           time: '5d ago', unread: false },
    ],
  },

  // ── 5. Design Informatics ─────────────────────────────────────────────────
  {
    id: 5,
    slug: 'design-informatics',
    title: 'Design Informatics',
    code: 'INFR08020',
    lecturer: 'Dr. Lucy Johnston',
    lecturerInitials: 'LJ',
    school: 'School of Informatics',
    semester: 'Semester 2, 2024/25',
    description: 'Design thinking, human-computer interaction, and digital innovation for real-world applications.',
    progress: 38,
    accent: '#DB2777',
    favourited: false,
    overview: {
      credits: '20 credits', level: 'Level 8',
      school: 'School of Informatics', programme: 'BSc (Hons) Informatics',
      courseStart: '20 January 2025', courseEnd: '16 May 2025',
    },
    nextClass: {
      title: 'Design Informatics Studio',
      date: 'Thu, 15 May 2025', time: '13:00 – 15:00',
      location: 'Informatics Forum 1.16', lecturer: 'Dr. Lucy Johnston',
    },
    weeklyMaterials: [
      wk('Week 8',  'Human-Computer Interaction', '12 – 18 May',    'New',     'New', 'Available',   'New'),
      wk('Week 9',  'Prototyping Methods',         '19 – 25 May',    'Updated', 'New', 'Available',   'New'),
      wk('Week 10', 'Design Ethics',               '26 May – 1 Jun', 'New',     'New', 'Coming soon', null),
    ],
    assignments: [
      {
        slug: 'design-prototype-submission',
        title: 'Design Prototype Submission',
        type: 'Prototype submission',
        due: 'Wed, 21 May, 13:00', weighting: '30%', status: 'In progress',
        description: 'Submit your interactive prototype along with a design rationale document explaining your design decisions.',
        fileFormats: 'PDF or ZIP', maxFileSize: '100 MB',
        namingConvention: 'DI_PROTOTYPE_YourStudentID', namingExample: 'DI_PROTOTYPE_S1234567_AvaBrown.zip',
        mockFileName: 'DI_PROTOTYPE_S1234567_AvaBrown.zip', mockFileSize: '12.4 MB',
        submissionId: 'SUB-2025-INFR08020-001',
        checklist: [
          'Include a README with instructions to open or run your prototype',
          'Ensure your design rationale document is included in the submission',
          'Check that all interactive elements function correctly',
          'Make sure the ZIP file is complete and opens without errors',
        ],
      },
      {
        slug: 'reflective-design-report',
        title: 'Reflective Design Report',
        type: 'Reflective report',
        due: 'Fri, 6 Jun, 17:00', weighting: '30%', status: 'Not submitted',
        description: 'Write a reflective report on your design process, challenges encountered, and lessons learned.',
        fileFormats: 'PDF', maxFileSize: '20 MB',
        namingConvention: 'DI_REFLECTION_YourStudentID', namingExample: 'DI_REFLECTION_S1234567_AvaBrown.pdf',
        mockFileName: 'DI_REFLECTION_S1234567_AvaBrown.pdf', mockFileSize: '1.6 MB',
        submissionId: 'SUB-2025-INFR08020-002',
        checklist: [
          'Include your student number and project title on the first page',
          'Ensure your report does not exceed the 2,000 word limit',
          'Include at least three design iterations with screenshots',
          'Make sure the file opens correctly before upload',
        ],
      },
    ],
    announcements: [
      {
        title: 'Studio session rescheduled – Week 9',
        author: 'Dr. Lucy Johnston', initials: 'LJ', date: 'Posted 12 May 2025',
        preview: 'The studio session in Week 9 has been moved from Tuesday to Thursday 22 May, 13:00–15:00. The venue remains Informatics Forum 1.16. Please update your calendars.',
        isNew: true,
      },
      {
        title: 'Prototype submission guidelines',
        author: 'Dr. Lucy Johnston', initials: 'LJ', date: 'Posted 10 May 2025',
        preview: 'Detailed submission guidelines for the prototype assignment are now available. Pay particular attention to the file naming convention and the required README format.',
        isNew: false,
      },
    ],
    recentUpdates: [
      { icon: 'megaphone', title: 'Studio session rescheduled',  sub: 'Week 9 moved to Thursday',              time: '2d ago', unread: true  },
      { icon: 'megaphone', title: 'Prototype submission guide',  sub: 'File format requirements',              time: '4d ago', unread: false },
      { icon: 'file',      title: 'Lecture slides uploaded',     sub: 'Week 8: Human-Computer Interaction',   time: '6d ago', unread: false },
    ],
  },

  // ── 6. Data Science ───────────────────────────────────────────────────────
  {
    id: 6,
    slug: 'data-science',
    title: 'Data Science',
    code: 'DSCI08012',
    lecturer: 'Dr. Kenji Watanabe',
    lecturerInitials: 'KW',
    school: 'School of Informatics',
    semester: 'Semester 2, 2024/25',
    description: 'Statistical learning, data wrangling, visualisation and machine learning using Python.',
    progress: 54,
    accent: '#0891B2',
    favourited: false,
    overview: {
      credits: '20 credits', level: 'Level 8',
      school: 'School of Informatics', programme: 'BSc (Hons) Data Science',
      courseStart: '20 January 2025', courseEnd: '16 May 2025',
    },
    nextClass: {
      title: 'Data Science Lecture',
      date: 'Thu, 15 May 2025', time: '13:00 – 14:00',
      location: 'Informatics Forum G.03', lecturer: 'Dr. Kenji Watanabe',
    },
    weeklyMaterials: [
      wk('Week 8',  'Statistical Learning', '12 – 18 May',    'New',     'New', 'Available',   'New'),
      wk('Week 9',  'Neural Networks',      '19 – 25 May',    'Updated', 'New', 'Available',   'New'),
      wk('Week 10', 'Model Evaluation',     '26 May – 1 Jun', 'New',     'New', 'Coming soon', null),
    ],
    assignments: [
      {
        slug: 'data-analysis-portfolio',
        title: 'Data Analysis Portfolio',
        type: 'Portfolio',
        due: 'Thu, 15 May, 13:00', weighting: '35%', status: 'In progress',
        description: 'Submit a portfolio of data analysis tasks completed throughout the semester, with commentary.',
        fileFormats: 'PDF or ZIP', maxFileSize: '100 MB',
        namingConvention: 'DS_PORTFOLIO_YourStudentID', namingExample: 'DS_PORTFOLIO_S1234567_AvaBrown.zip',
        mockFileName: 'DS_PORTFOLIO_S1234567_AvaBrown.zip', mockFileSize: '8.7 MB',
        submissionId: 'SUB-2025-DSCI08012-001',
        checklist: [
          'Include a README file listing all notebooks and their purpose',
          'Ensure all Jupyter notebooks run without errors',
          'Include all required datasets within the ZIP file',
          'Make sure the file opens correctly before upload',
        ],
      },
      {
        slug: 'machine-learning-report',
        title: 'Machine Learning Report',
        type: 'Technical report',
        due: 'Mon, 9 Jun, 12:00', weighting: '40%', status: 'Not submitted',
        description: 'Apply machine learning techniques to a real-world dataset and write a technical report of your findings.',
        fileFormats: 'PDF or DOCX', maxFileSize: '25 MB',
        namingConvention: 'DS_MLREPORT_YourStudentID', namingExample: 'DS_MLREPORT_S1234567_AvaBrown.pdf',
        mockFileName: 'DS_MLREPORT_S1234567_AvaBrown.pdf', mockFileSize: '2.3 MB',
        submissionId: 'SUB-2025-DSCI08012-002',
        checklist: [
          'Include your student number and dataset name on the first page',
          'Ensure all code snippets are correctly formatted',
          'Include results tables and evaluation metrics',
          'Make sure the file opens correctly before upload',
        ],
      },
    ],
    announcements: [
      {
        title: 'Jupyter notebook templates uploaded',
        author: 'Dr. Kenji Watanabe', initials: 'KW', date: 'Posted 13 May 2025',
        preview: 'Template notebooks for the portfolio tasks have been uploaded to the course page. These contain starter code and instructions. Please use these templates for your submissions.',
        isNew: true,
      },
      {
        title: 'Dataset access instructions',
        author: 'Dr. Kenji Watanabe', initials: 'KW', date: 'Posted 11 May 2025',
        preview: 'Instructions for accessing the Edinburgh DataShare repository for the ML report dataset are now available. Please read carefully before your next tutorial session.',
        isNew: false,
      },
    ],
    recentUpdates: [
      { icon: 'book',      title: 'Notebook templates uploaded', sub: 'Portfolio task starters',      time: '1d ago', unread: true  },
      { icon: 'megaphone', title: 'Dataset access instructions', sub: 'ML Report dataset',            time: '3d ago', unread: false },
      { icon: 'file',      title: 'Lecture slides uploaded',     sub: 'Week 8: Statistical Learning', time: '5d ago', unread: false },
    ],
  },
]

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find(c => c.slug === slug)
}

export function getAssignmentBySlug(courseSlug: string, assignmentSlug: string) {
  const course = getCourseBySlug(courseSlug)
  if (!course) return { course: undefined, assignment: undefined }
  const assignment = course.assignments.find(a => a.slug === assignmentSlug)
  return { course, assignment }
}

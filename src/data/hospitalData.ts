import { Department, Doctor, Testimonial, FAQ } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology & Heart Institute',
    tagline: 'Precision cardiovascular care and comprehensive heart interventions',
    description: 'Our Heart Institute is recognized internationally for pioneering catheter-based interventions, electrophysiology mapping, minimally invasive valve replacements, and round-the-clock primary PCI for acute myocardial infarctions.',
    iconName: 'HeartPulse',
    headDoctorId: 'doc-cardio-1',
    procedures: [
      'Coronary Angioplasty & Stenting (TAVR)',
      'Cardiac Electrophysiology & Ablation',
      'Minimally Invasive Valve Repair',
      'Heart Failure & Ventricular Assist Devices',
      'Advanced 3D Echocardiography & Cardiac MRI'
    ],
    facilities: [
      'Dual Hybrid Catheterization Labs',
      '18-bed Coronary Intensive Care Unit (CCU)',
      'Dedicated Rapid Chest Pain Assessment Unit'
    ],
    emergencyAvailable: true,
    floorLocation: 'Building A, 3rd Floor',
    phoneExtension: 'Ext. 3100'
  },
  {
    id: 'neurology',
    name: 'Neurology & Neurosurgery',
    tagline: 'Advanced brain, spine, and neurovascular center of clinical excellence',
    description: 'Delivering micro-neurosurgery, stereotactic radiosurgery, acute ischemic stroke thrombolysis, and comprehensive neurological rehab with intra-operative neuromonitoring and ultra-high field neuroimaging.',
    iconName: 'Brain',
    headDoctorId: 'doc-neuro-1',
    procedures: [
      'Complex Brain Tumor & Skull Base Resection',
      'Endovascular Coiling for Brain Aneurysms',
      'Deep Brain Stimulation (DBS) for Parkinson\'s',
      'Minimally Invasive Spine Decompression',
      'Comprehensive Epilepsy Monitoring & Surgery'
    ],
    facilities: [
      'Neuro-Intensive Care Unit (NICU)',
      'Intraoperative 3T MRI Suite',
      'Certified Comprehensive Stroke Center'
    ],
    emergencyAvailable: true,
    floorLocation: 'Building B, 4th Floor',
    phoneExtension: 'Ext. 4200'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Replacement',
    tagline: 'Robotic-assisted joint reconstruction, spine surgery, and sports medicine',
    description: 'Utilizing Mako robotic guidance, custom patient-matched implants, and accelerated recovery pathways to restore mobility with minimal tissue disruption and faster return to active life.',
    iconName: 'Bone',
    headDoctorId: 'doc-ortho-1',
    procedures: [
      'Robotic Total Knee & Hip Arthroplasty',
      'Arthroscopic Rotator Cuff & ACL Reconstruction',
      'Micro-endoscopic Lumbar Spine Surgery',
      'Complex Pelvic & Poly-trauma Reconstruction',
      'Pediatric Limb Alignment & Scoliosis Care'
    ],
    facilities: [
      'Robotic Surgical Suites',
      'Dedicated Inpatient Physical Rehabilitation Gym',
      'Hydrotherapy & Gait Analysis Laboratory'
    ],
    emergencyAvailable: true,
    floorLocation: 'Building A, 2nd Floor',
    phoneExtension: 'Ext. 2400'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatal Care',
    tagline: 'Family-centered child health, developmental pediatrics, and neonatal ICU',
    description: 'Providing comprehensive care from premature neonatal critical resuscitation to pediatric sub-specialties including pediatric cardiology, pulmonology, pediatric surgery, and developmental assessments.',
    iconName: 'Baby',
    headDoctorId: 'doc-ped-1',
    procedures: [
      'Level IV Neonatal Intensive Care',
      'Pediatric Minimally Invasive Surgery',
      'Childhood Asthma & Allergy Desensitization',
      'Growth & Endocrine Disorder Management',
      'Childhood Immunization & Preventive Wellness'
    ],
    facilities: [
      '24-Bed State-of-the-art NICU & PICU',
      'Child-Friendly Sensory Friendly Play Areas',
      'Pediatric Emergency Triage Wing'
    ],
    emergencyAvailable: true,
    floorLocation: 'Building C, 2nd Floor',
    phoneExtension: 'Ext. 5100'
  },
  {
    id: 'oncology',
    name: 'Medical & Surgical Oncology',
    tagline: 'Targeted precision cancer therapies, surgical oncology, and patient support',
    description: 'Multidisciplinary tumor boards combining genomic sequencing, immunotherapy, linear accelerator radiation, and organ-preserving oncologic surgeries to formulate tailored cancer fighting strategies.',
    iconName: 'Activity',
    headDoctorId: 'doc-onco-1',
    procedures: [
      'Robotic & Open Tumor Resections',
      'Targeted Molecular & Immunotherapy Infusions',
      'Image-Guided Stereotactic Body Radiotherapy',
      'Hematologic Malignancy & Autologous Stem Cell Care',
      'Cancer Genetic Risk Profiling & Screening'
    ],
    facilities: [
      'Comfort Day Chemotherapy Infusion Pavilion',
      'High-Precision TrueBeam Radiation Bunker',
      'Dedicated Cancer Genetic Counseling Center'
    ],
    emergencyAvailable: false,
    floorLocation: 'Building C, 5th Floor',
    phoneExtension: 'Ext. 6200'
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology & Hepatology',
    tagline: 'Comprehensive digestive tract health, endoscopic ultrasound, and liver care',
    description: 'Specializing in advanced diagnostic and therapeutic endoscopy, ERCP, liver disease management, inflammatory bowel disease (IBD) centers, and gastrointestinal motility diagnostics.',
    iconName: 'Stethoscope',
    headDoctorId: 'doc-gastro-1',
    procedures: [
      'Advanced Endoscopic Retrograde Cholangiopancreatography (ERCP)',
      'High-Definition Colonoscopy & Polypectomy',
      'Endoscopic Submucosal Dissection (ESD)',
      'Chronic Hepatitis & Fatty Liver Management',
      'High-Resolution Esophageal Manometry'
    ],
    facilities: [
      'Four Digital Video Endoscopy Suites',
      'Liver Elastography & FibroScan Clinic',
      'Dedicated GI Motility Laboratory'
    ],
    emergencyAvailable: true,
    floorLocation: 'Building B, 2nd Floor',
    phoneExtension: 'Ext. 3500'
  },
  {
    id: 'obgyn',
    name: 'Obstetrics & Gynecology',
    tagline: 'Holistic women\'s health, advanced maternal-fetal care, and fertility',
    description: 'Offering private labor-delivery-recovery suites, high-risk maternal fetal monitoring, laparoscopic gynecologic surgeries, urogynecology, and personalized menopause care.',
    iconName: 'HeartHandshake',
    headDoctorId: 'doc-obgyn-1',
    procedures: [
      'High-Risk Pregnancy & Maternal-Fetal Ultrasound',
      'Gentle Water Birth & Natural Delivery Suites',
      'Laparoscopic & Hysteroscopic Myomectomy',
      'Pelvic Organ Prolapse & Incontinence Care',
      'Adolescent Gynecology & Preventive Cervical Screening'
    ],
    facilities: [
      '12 Private LDR (Labor-Delivery-Recovery) Rooms',
      'Fetal Well-Being Diagnostic Center',
      'Women\'s Wellness Diagnostic Pavilion'
    ],
    emergencyAvailable: true,
    floorLocation: 'Building C, 3rd Floor',
    phoneExtension: 'Ext. 4800'
  },
  {
    id: 'emergency',
    name: 'Emergency & Trauma Care',
    tagline: '24/7 Level-1 trauma readiness, acute resuscitation, and rapid triage',
    description: 'Staffed 24/7 by board-certified emergency physicians, trauma surgeons, and acute care nurses prepared to treat cardiac arrests, polytrauma, severe strokes, and acute respiratory distress instantly.',
    iconName: 'Ambulance',
    headDoctorId: 'doc-emg-1',
    procedures: [
      'Immediate Resuscitation & Airway Management',
      'Acute Polytrauma Surgical Stabilization',
      'Point-of-Care Ultrasound (POCUS) & CT Scanning',
      'Burn & Complex Wound Triage',
      'Toxicology & Poisoning Management'
    ],
    facilities: [
      'Helipad Access for Critical Air Transfers',
      'Dedicated Trauma Resuscitation Bays',
      'Rapid Decontamination Unit & Isolation Rooms'
    ],
    emergencyAvailable: true,
    floorLocation: 'Ground Floor, Main Ambulance Entrance',
    phoneExtension: 'Ext. 9110'
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology Doctors
  {
    id: 'doc-cardio-1',
    name: 'Dr. Aris Thorne',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Institute',
    role: 'Chief Interventional Cardiologist & Director',
    degrees: 'MD, FACC, FSCAI',
    experienceYears: 22,
    languages: ['English', 'Spanish'],
    opdSchedule: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '12:30 PM'],
    rating: 4.96,
    reviewsCount: 420,
    bio: 'Dr. Aris Thorne has performed over 6,500 complex coronary angioplasties and structural heart valve procedures. He trained at Johns Hopkins and serves on the International Advisory Council for Transcatheter Therapies.',
    specializations: ['Transcatheter Aortic Valve Replacement (TAVR)', 'Complex CTO Angioplasty', 'Coronary Stenting'],
    education: ['MD - Johns Hopkins University', 'Cardiology Fellowship - Cleveland Clinic'],
    consultationFee: 160,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-cardio-2',
    name: 'Dr. Maya Lin',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Institute',
    role: 'Senior Cardiac Electrophysiologist',
    degrees: 'MD, FHRS, FESC',
    experienceYears: 15,
    languages: ['English', 'Mandarin'],
    opdSchedule: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '01:30 PM'],
    rating: 4.92,
    reviewsCount: 310,
    bio: 'Dr. Maya Lin is an expert in cardiac arrhythmias, 3D electro-anatomical mapping, radiofrequency catheter ablation for atrial fibrillation, and leadless pacemaker implants.',
    specializations: ['Atrial Fibrillation Ablation', 'Pacemaker & ICD Implants', 'Syncope Evaluation'],
    education: ['MD - Stanford School of Medicine', 'Electrophysiology Fellowship - Brigham and Women\'s'],
    consultationFee: 140
  },
  {
    id: 'doc-cardio-3',
    name: 'Dr. Robert Sterling',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Heart Institute',
    role: 'Consultant Non-Invasive & Preventive Cardiologist',
    degrees: 'MD, FASE, FACP',
    experienceYears: 18,
    languages: ['English', 'German'],
    opdSchedule: 'Mon, Tue, Thu (02:00 PM - 06:00 PM)',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['02:00 PM', '03:00 PM', '04:00 PM', '05:30 PM'],
    rating: 4.88,
    reviewsCount: 280,
    bio: 'Specializing in cardiac imaging, cardiovascular risk stratification, lipid disorders, and sports cardiology for athletes and patients with early-stage arterial disease.',
    specializations: ['3D Echocardiography', 'Cardiac MRI & CT', 'Hypertension & Lipid Optimization'],
    education: ['MD - University of Chicago Pritzker', 'Residency - Massachusetts General Hospital'],
    consultationFee: 130
  },

  // Neurology Doctors
  {
    id: 'doc-neuro-1',
    name: 'Dr. Elena Rostova',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    role: 'Chief of Neurosurgery & Skull Base Specialist',
    degrees: 'MD, PhD, FAANS',
    experienceYears: 24,
    languages: ['English', 'Russian', 'French'],
    opdSchedule: 'Mon, Wed, Fri (08:30 AM - 12:30 PM)',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['08:30 AM', '09:30 AM', '11:00 AM', '12:00 PM'],
    rating: 4.98,
    reviewsCount: 460,
    bio: 'Internationally recognized for pioneering minimally invasive keyhole cranial surgery and microvascular decompression for trigeminal neuralgia. Over 3,800 delicate neurosurgical procedures performed.',
    specializations: ['Endoscopic Skull Base Resection', 'Brain Aneurysm Surgery', 'Trigeminal Neuralgia'],
    education: ['MD, PhD - Karolinska Institute', 'Neurosurgical Fellowship - Mayo Clinic'],
    consultationFee: 180,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-neuro-2',
    name: 'Dr. Tariq Al-Mansoor',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    role: 'Director of Stroke & Vascular Neurology',
    degrees: 'MD, FAAN, FINR',
    experienceYears: 16,
    languages: ['English', 'Arabic'],
    opdSchedule: 'Tue, Thu, Sat (09:00 AM - 01:00 PM)',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['09:00 AM', '10:30 AM', '11:30 AM', '12:30 PM'],
    rating: 4.91,
    reviewsCount: 295,
    bio: 'Leads our 24/7 Rapid Neuro-Intervention Team. Specialized in acute intra-arterial thrombectomy for large vessel stroke, intracranial stenting, and carotid artery disease.',
    specializations: ['Endovascular Thrombectomy', 'Carotid Artery Stenting', 'Neuro-critical Care'],
    education: ['MD - Columbia University College of Physicians & Surgeons', 'Fellowship - NYU Langone'],
    consultationFee: 150
  },
  {
    id: 'doc-neuro-3',
    name: 'Dr. Samantha Reed',
    departmentId: 'neurology',
    departmentName: 'Neurology & Neurosurgery',
    role: 'Consultant Neurologist & Movement Disorder Lead',
    degrees: 'MD, DM Neurology',
    experienceYears: 12,
    languages: ['English'],
    opdSchedule: 'Mon, Wed, Thu (01:30 PM - 05:30 PM)',
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
    timeSlots: ['01:30 PM', '02:30 PM', '03:45 PM', '04:45 PM'],
    rating: 4.89,
    reviewsCount: 215,
    bio: 'Focuses on early detection and modern pharmacological as well as neuro-modulation therapy for Parkinson\'s disease, dystonia, tremor disorders, and refractory migraine management.',
    specializations: ['Parkinson\'s Disease & Tremors', 'Deep Brain Stimulation Programming', 'Botox for Chronic Migraines'],
    education: ['MD - Duke University School of Medicine', 'Residency - UCSF Medical Center'],
    consultationFee: 135
  },

  // Orthopedics Doctors
  {
    id: 'doc-ortho-1',
    name: 'Dr. David K. Vance',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    role: 'Chairman of Orthopedic Surgery & Robotic Lead',
    degrees: 'MD, FAAOS, FRCS (Tr & Orth)',
    experienceYears: 26,
    languages: ['English'],
    opdSchedule: 'Mon, Tue, Thu (09:00 AM - 01:00 PM)',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:15 AM', '12:15 PM'],
    rating: 4.95,
    reviewsCount: 510,
    bio: 'Pioneer of robotic total knee and hip replacement. Has carried out over 5,000 joint reconstructions, teaching orthopedic surgical teams across North America and Europe.',
    specializations: ['Robotic Mako Total Knee Arthroplasty', 'Direct Anterior Hip Replacement', 'Revision Joint Reconstruction'],
    education: ['MD - Harvard Medical School', 'Fellowship - Hospital for Special Surgery (HSS)'],
    consultationFee: 170,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-ortho-2',
    name: 'Dr. Priyah Sen',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    role: 'Director of Sports Medicine & Arthroscopy',
    degrees: 'MD, MS (Ortho), Dip. Sports Med',
    experienceYears: 14,
    languages: ['English', 'Hindi', 'Bengali'],
    opdSchedule: 'Wed, Fri, Sat (10:00 AM - 02:00 PM)',
    availableDays: ['Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:30 PM', '01:30 PM'],
    rating: 4.93,
    reviewsCount: 340,
    bio: 'Official orthopedic sports surgeon for national athletic leagues. Specializes in complex multi-ligament knee injuries, shoulder instability repairs, and cartilage preservation.',
    specializations: ['ACL & Meniscus Reconstruction', 'Rotator Cuff & Labral Repair', 'Stem Cell & PRP Cartilage Therapies'],
    education: ['MD - University of Michigan Medical School', 'Fellowship - Steadman Clinic'],
    consultationFee: 145
  },
  {
    id: 'doc-ortho-3',
    name: 'Dr. Marcus Miller',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics & Joint Replacement',
    role: 'Consultant Minimally Invasive Spine Surgeon',
    degrees: 'MD, Spine Fellowship Trained',
    experienceYears: 17,
    languages: ['English', 'Spanish'],
    opdSchedule: 'Mon, Wed, Fri (02:00 PM - 06:00 PM)',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['02:00 PM', '03:15 PM', '04:15 PM', '05:15 PM'],
    rating: 4.87,
    reviewsCount: 275,
    bio: 'Dedicated to treating spinal disc herniations, spinal stenosis, spondylolisthesis, and degenerative disc disorders through endoscopic outpatient procedures and motion-preserving disc replacements.',
    specializations: ['Endoscopic Lumbar Discectomy', 'Cervical Artificial Disc Replacement', 'Spinal Fusion & Decompression'],
    education: ['MD - Baylor College of Medicine', 'Spine Fellowship - Emory University'],
    consultationFee: 155
  },

  // Pediatrics Doctors
  {
    id: 'doc-ped-1',
    name: 'Dr. Clara Holloway',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    role: 'Head of Pediatrics & Senior Neonatologist',
    degrees: 'MD, FAAP, DCH',
    experienceYears: 20,
    languages: ['English', 'German'],
    opdSchedule: 'Mon, Tue, Wed, Thu (09:00 AM - 01:00 PM)',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
    rating: 4.97,
    reviewsCount: 480,
    bio: 'Dr. Clara Holloway has guided thousands of newborns through critical neonatal journeys. Dedicated to gentle, developmental care that partners closely with parents.',
    specializations: ['Extreme Prematurity Care', 'Neonatal Respiratory Support', 'Early Developmental Screening'],
    education: ['MD - Oxford University', 'Pediatrics Residency - Boston Children\'s Hospital'],
    consultationFee: 130,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-ped-2',
    name: 'Dr. Julian Ortiz',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    role: 'Consultant Pediatric Pulmonologist & Allergist',
    degrees: 'MD, FAAP',
    experienceYears: 13,
    languages: ['English', 'Spanish'],
    opdSchedule: 'Tue, Thu, Fri (01:00 PM - 05:00 PM)',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['01:00 PM', '02:00 PM', '03:15 PM', '04:15 PM'],
    rating: 4.90,
    reviewsCount: 230,
    bio: 'Expert in pediatric respiratory challenges, chronic cough, childhood asthma control, cystic fibrosis management, and food and environmental allergy immunotherapy.',
    specializations: ['Pediatric Asthma Management', 'Pediatric Allergy Testing', 'Sleep Disordered Breathing'],
    education: ['MD - Yale School of Medicine', 'Fellowship - Children\'s Hospital of Philadelphia'],
    consultationFee: 125
  },
  {
    id: 'doc-ped-3',
    name: 'Dr. Sunita Rao',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatal Care',
    role: 'Consultant Pediatric Endocrinologist',
    degrees: 'MD, DM (Ped Endocrinology)',
    experienceYears: 15,
    languages: ['English', 'Hindi', 'Telugu'],
    opdSchedule: 'Mon, Wed, Sat (10:00 AM - 02:00 PM)',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:15 AM', '12:30 PM', '01:30 PM'],
    rating: 4.89,
    reviewsCount: 190,
    bio: 'Specialized in childhood growth concerns, juvenile type 1 diabetes management with smart sensors, thyroid irregularities, and puberty timing evaluation.',
    specializations: ['Type 1 Diabetes & Insulin Pumps', 'Growth Hormone Therapies', 'Thyroid & Puberty Disorders'],
    education: ['MD - All India Institute of Medical Sciences (AIIMS)', 'Fellowship - Cincinnati Children\'s'],
    consultationFee: 125
  },

  // Oncology Doctors
  {
    id: 'doc-onco-1',
    name: 'Dr. Arthur Pendelton',
    departmentId: 'oncology',
    departmentName: 'Medical & Surgical Oncology',
    role: 'Director of Medical Oncology & Precision Genomics',
    degrees: 'MD, PhD, FASCO',
    experienceYears: 25,
    languages: ['English'],
    opdSchedule: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:15 AM', '11:30 AM', '12:30 PM'],
    rating: 4.96,
    reviewsCount: 390,
    bio: 'Renowned researcher and clinician in genomic-targeted chemotherapy and checkpoint inhibitor immunotherapy for solid tumors including lung, colon, and prostate cancers.',
    specializations: ['Targeted Molecular Cancer Therapy', 'Immunotherapy Protocols', 'Clinical Trial Therapeutics'],
    education: ['MD, PhD - University of Pennsylvania', 'Fellowship - Memorial Sloan Kettering Cancer Center'],
    consultationFee: 175,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-onco-2',
    name: 'Dr. Nadia Kassem',
    departmentId: 'oncology',
    departmentName: 'Medical & Surgical Oncology',
    role: 'Chief Surgical Oncologist & Breast Care Lead',
    degrees: 'MD, FACS, SSO Fellow',
    experienceYears: 18,
    languages: ['English', 'Arabic', 'French'],
    opdSchedule: 'Tue, Thu, Sat (09:30 AM - 01:30 PM)',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['09:30 AM', '10:45 AM', '12:00 PM', '01:00 PM'],
    rating: 4.94,
    reviewsCount: 360,
    bio: 'Specialist in oncoplastic breast-conserving resections, sentinel lymph node navigation, and robotic gastrointestinal oncologic surgery with minimal surgical scarring.',
    specializations: ['Oncoplastic Breast Surgery', 'Robotic Gastrointestinal Cancer Resection', 'Sentinel Lymph Node Biopsy'],
    education: ['MD - McGill University', 'Fellowship - MD Anderson Cancer Center'],
    consultationFee: 165
  },
  {
    id: 'doc-onco-3',
    name: 'Dr. Kenneth Wu',
    departmentId: 'oncology',
    departmentName: 'Medical & Surgical Oncology',
    role: 'Consultant Hematologist-Oncologist',
    degrees: 'MD, FACP',
    experienceYears: 14,
    languages: ['English', 'Cantonese'],
    opdSchedule: 'Mon, Tue, Thu (02:00 PM - 05:30 PM)',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['02:00 PM', '03:00 PM', '04:15 PM', '05:00 PM'],
    rating: 4.88,
    reviewsCount: 220,
    bio: 'Expert in non-Hodgkin lymphoma, multiple myeloma, chronic leukemias, and severe benign blood disorders including refractory immune thrombocytopenia and sickle cell disease.',
    specializations: ['Lymphoma & Myeloma Management', 'CAR-T Cell Therapy Assessment', 'Bone Marrow Biopsy & Staging'],
    education: ['MD - Washington University in St. Louis', 'Fellowship - Fred Hutchinson Cancer Center'],
    consultationFee: 150
  },

  // Gastroenterology Doctors
  {
    id: 'doc-gastro-1',
    name: 'Dr. Vikram Singhal',
    departmentId: 'gastroenterology',
    departmentName: 'Gastroenterology & Hepatology',
    role: 'Director of Advanced Endoscopy & Gastroenterology',
    degrees: 'MD, DM, FASGE, FACG',
    experienceYears: 23,
    languages: ['English', 'Hindi', 'Punjabi'],
    opdSchedule: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:15 AM', '12:30 PM'],
    rating: 4.93,
    reviewsCount: 380,
    bio: 'Expert in third-space endoscopy (POEM), ERCP for bile duct calculi, endosonography-guided tumor biopsy, and screening colonoscopies with high adenoma detection rates.',
    specializations: ['Therapeutic ERCP & EUS', 'Peroral Endoscopic Myotomy (POEM)', 'Pancreaticobiliary Disorders'],
    education: ['MD - King George\'s Medical University', 'Fellowship - Mount Sinai Hospital New York'],
    consultationFee: 155,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-gastro-2',
    name: 'Dr. Rachel Zimmerman',
    departmentId: 'gastroenterology',
    departmentName: 'Gastroenterology & Hepatology',
    role: 'Senior Hepatologist & Liver Disease Lead',
    degrees: 'MD, FAASLD',
    experienceYears: 16,
    languages: ['English', 'Hebrew'],
    opdSchedule: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:15 AM', '12:30 PM', '01:30 PM'],
    rating: 4.90,
    reviewsCount: 270,
    bio: 'Specialist in metabolic dysfunction-associated steatohepatitis (MASH), cirrhosis complications, viral hepatitis elimination, and pre/post liver transplant care.',
    specializations: ['Fatty Liver & FibroScan Staging', 'Cirrhosis Management', 'Autoimmune Liver Diseases'],
    education: ['MD - Northwestern University Feinberg', 'Fellowship - University of California San Francisco'],
    consultationFee: 140
  },
  {
    id: 'doc-gastro-3',
    name: 'Dr. Anthony Russo',
    departmentId: 'gastroenterology',
    departmentName: 'Gastroenterology & Hepatology',
    role: 'Consultant IBD & Digestive Health Specialist',
    degrees: 'MD, AGAF',
    experienceYears: 12,
    languages: ['English', 'Italian'],
    opdSchedule: 'Mon, Tue, Thu (02:00 PM - 06:00 PM)',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['02:00 PM', '03:15 PM', '04:15 PM', '05:15 PM'],
    rating: 4.89,
    reviewsCount: 210,
    bio: 'Dedicated to Crohn\'s disease, ulcerative colitis, severe IBS, and gastroesophageal reflux disease (GERD) using advanced biologic treatments and dietary intervention protocols.',
    specializations: ['Inflammatory Bowel Disease (IBD)', 'Refractory GERD & Acid Reflux', 'Capsule Endoscopy'],
    education: ['MD - Tufts University School of Medicine', 'Residency - Beth Israel Deaconess Medical Center'],
    consultationFee: 135
  },

  // Obstetrics & Gynecology Doctors
  {
    id: 'doc-obgyn-1',
    name: 'Dr. Farah Chawla',
    departmentId: 'obgyn',
    departmentName: 'Obstetrics & Gynecology',
    role: 'Head of OB/GYN & High-Risk Maternal Fetal Specialist',
    degrees: 'MD, FACOG, Dip. Fetal Med',
    experienceYears: 21,
    languages: ['English', 'Urdu', 'Hindi'],
    opdSchedule: 'Mon, Tue, Thu (08:30 AM - 12:30 PM)',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['08:30 AM', '09:45 AM', '11:00 AM', '12:00 PM'],
    rating: 4.97,
    reviewsCount: 540,
    bio: 'Renowned for gentle maternal care, handling multi-fetal pregnancies, gestational hypertension, pre-eclampsia, and providing compassionate support throughout labor.',
    specializations: ['High-Risk Pregnancy Management', 'Targeted Fetal Doppler Ultrasound', 'Natural & Assisted Birth Protocols'],
    education: ['MD - Georgetown University School of Medicine', 'Fellowship - New York Presbyterian / Weill Cornell'],
    consultationFee: 150,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-obgyn-2',
    name: 'Dr. Natalie Evans',
    departmentId: 'obgyn',
    departmentName: 'Obstetrics & Gynecology',
    role: 'Consultant Minimally Invasive Gynecologist',
    degrees: 'MD, FACOG, MIGS Fellow',
    experienceYears: 15,
    languages: ['English'],
    opdSchedule: 'Wed, Fri, Sat (09:30 AM - 01:30 PM)',
    availableDays: ['Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['09:30 AM', '10:30 AM', '11:45 AM', '01:00 PM'],
    rating: 4.92,
    reviewsCount: 320,
    bio: 'Specialist in single-incision laparoscopic surgery for uterine fibroids, deep infiltrating endometriosis, ovarian cysts, and chronic pelvic pain conditions.',
    specializations: ['Robotic & Laparoscopic Myomectomy', 'Endometriosis Excision Surgery', 'Uterine Preserving Interventions'],
    education: ['MD - University of Virginia', 'Fellowship - University of North Carolina'],
    consultationFee: 140
  },
  {
    id: 'doc-obgyn-3',
    name: 'Dr. Chloe Dupont',
    departmentId: 'obgyn',
    departmentName: 'Obstetrics & Gynecology',
    role: 'Consultant Reproductive Medicine & Fertility Lead',
    degrees: 'MD, REI Board Certified',
    experienceYears: 13,
    languages: ['English', 'French'],
    opdSchedule: 'Tue, Wed, Fri (02:00 PM - 06:00 PM)',
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    timeSlots: ['02:00 PM', '03:15 PM', '04:30 PM', '05:30 PM'],
    rating: 4.91,
    reviewsCount: 260,
    bio: 'Helps couples fulfill parenthood dreams through diagnostic fertility evaluations, ovulation induction, recurrent miscarriage treatment, and hormonal balance restoration.',
    specializations: ['Fertility Workups & Ovulation Induction', 'PCOS & Hormonal Imbalances', 'Pre-conception Genetic Screening'],
    education: ['MD - Sorbonne University', 'Fellowship - UCLA Medical Center'],
    consultationFee: 145
  },

  // Emergency Doctors
  {
    id: 'doc-emg-1',
    name: 'Dr. Jason Briggs',
    departmentId: 'emergency',
    departmentName: 'Emergency & Trauma Care',
    role: 'Director of Emergency Medicine & Trauma Lead',
    degrees: 'MD, FACEP, FAAEM',
    experienceYears: 19,
    languages: ['English', 'Spanish'],
    opdSchedule: 'Mon, Tue, Wed, Thu, Fri (Available On-Shift 24/7)',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    rating: 4.94,
    reviewsCount: 390,
    bio: 'Over seeing 45,000 emergency patient encounters annually. Led emergency response protocols and trauma resuscitation systems with rapid door-to-balloon times under 45 minutes.',
    specializations: ['Level-1 Polytrauma Resuscitation', 'Critical Airway Management', 'Disaster Medicine Preparedness'],
    education: ['MD - Vanderbilt University', 'Residency - Bellevue Hospital / NYU'],
    consultationFee: 110,
    isHeadOfDepartment: true
  },
  {
    id: 'doc-emg-2',
    name: 'Dr. Maria Santos',
    departmentId: 'emergency',
    departmentName: 'Emergency & Trauma Care',
    role: 'Senior Trauma & Critical Care Specialist',
    degrees: 'MD, FACS, FCCM',
    experienceYears: 14,
    languages: ['English', 'Portuguese', 'Spanish'],
    opdSchedule: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '01:00 PM'],
    rating: 4.90,
    reviewsCount: 280,
    bio: 'Specialist in rapid bedside sonography (FAST scan), acute septic shock protocols, traumatic brain injury triage, and emergency chest decompression.',
    specializations: ['Acute Resuscitative Sonography', 'Septic Shock Management', 'Advanced Cardiac Life Support (ACLS)'],
    education: ['MD - University of Miami Miller School', 'Fellowship - Jackson Memorial Hospital'],
    consultationFee: 110
  },
  {
    id: 'doc-emg-3',
    name: 'Dr. Lee Chen',
    departmentId: 'emergency',
    departmentName: 'Emergency & Trauma Care',
    role: 'Acute Medical Resuscitation Lead',
    degrees: 'MD, Dip. Acute Med',
    experienceYears: 11,
    languages: ['English', 'Mandarin'],
    opdSchedule: 'Wed, Fri, Sun (01:00 PM - 05:00 PM)',
    availableDays: ['Wednesday', 'Friday', 'Sunday'],
    timeSlots: ['01:00 PM', '02:30 PM', '04:00 PM'],
    rating: 4.88,
    reviewsCount: 210,
    bio: 'Dedicated to emergency pediatric emergencies, toxicology exposure emergencies, and acute cardiopulmonary stabilization.',
    specializations: ['Pediatric Emergency Medicine', 'Medical Toxicology', 'Acute Arrhythmia Reversal'],
    education: ['MD - University of Toronto', 'Residency - Sunnybrook Health Sciences'],
    consultationFee: 110
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    patientName: 'Eleanor Vance',
    patientRole: 'Architect & Marathon Runner',
    treatment: 'Robotic Bilateral Knee Arthroplasty',
    department: 'Orthopedics & Joint Replacement',
    doctorName: 'Dr. David K. Vance',
    rating: 5,
    comment: 'After 4 years of debilitating pain, Dr. Vance and his team restored my life with robotic knee replacement. Six months post-surgery, I walked 10 miles with zero discomfort. The nursing team at MGICare treated me like family.',
    outcome: 'Full painless joint mobility restored in 8 weeks',
    date: 'February 2026'
  },
  {
    id: 'test-2',
    patientName: 'Jonathan Hayes',
    patientRole: 'Software Executive',
    treatment: 'Acute Coronary Angioplasty & Stenting',
    department: 'Cardiology & Heart Institute',
    doctorName: 'Dr. Aris Thorne',
    rating: 5,
    comment: 'When I suffered acute chest discomfort during an office presentation, MGICare\'s emergency hotline dispatched an ambulance within 4 minutes. Dr. Thorne unclogged my artery within 38 minutes of arrival. He saved my life.',
    outcome: 'Door-to-balloon completed in 38 minutes, discharged in 48 hours',
    date: 'January 2026'
  },
  {
    id: 'test-3',
    patientName: 'Sarah & Michael Keller',
    patientRole: 'Parents of Twins',
    treatment: 'High-Risk Multi-Fetal Delivery & NICU Care',
    department: 'Obstetrics & Gynecology',
    doctorName: 'Dr. Farah Chawla & Dr. Clara Holloway',
    rating: 5,
    comment: 'Our twins arrived at 32 weeks. The collaboration between Dr. Chawla in obstetrics and Dr. Holloway\'s NICU team gave us peace of mind every single second. Today our baby girls are thriving at home healthy and strong.',
    outcome: 'Healthy twin delivery with 100% positive neonatal milestones',
    date: 'November 2025'
  },
  {
    id: 'test-4',
    patientName: 'Marcus Bradley',
    patientRole: 'Teacher',
    treatment: 'Microvascular Decompression',
    department: 'Neurology & Neurosurgery',
    doctorName: 'Dr. Elena Rostova',
    rating: 5,
    comment: 'Trigeminal neuralgia felt like electrical shocks in my face. Dr. Rostova performed keyhole microvascular decompression. I woke up from surgery with the pain 100% gone for the first time in seven years.',
    outcome: 'Instant neural pain relief with zero neurological deficits',
    date: 'March 2026'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    category: 'booking',
    question: 'How do I book an appointment online at MGICare Hospitals?',
    answer: 'You can select your preferred department and specialist using our online booking portal above. Choose an available date, select a convenient morning or afternoon time slot, fill in your patient details, and receive an instant confirmed Appointment ID along with calendar integration.'
  },
  {
    id: 'faq-2',
    category: 'booking',
    question: 'Can I reschedule or cancel my booked appointment?',
    answer: 'Yes! Use the "My Bookings" tab in the navigation. Enter your appointment reference number (e.g. MGI-2026-XXXX) or phone number to look up your booking, select a new available date/time, or cancel with immediate confirmation.'
  },
  {
    id: 'faq-3',
    category: 'emergency',
    question: 'What is the procedure for emergency medical admission?',
    answer: 'Our Level-1 Emergency & Trauma Department is open 24/7/365 with zero waiting time for triage. You can call our emergency hotline at 1800-419-CARE for immediate ambulance dispatch or walk directly into the emergency trauma bay on the Ground Floor.'
  },
  {
    id: 'faq-4',
    category: 'insurance',
    question: 'Which health insurance providers and payment plans do you accept?',
    answer: 'MGICare Hospitals is empanelled with all major domestic and international health insurers, third-party administrators (TPAs), Medicare, and private cashless health networks. Our Helpdesk Insurance Coordinators assist with cashless pre-authorization in under 45 minutes.'
  },
  {
    id: 'faq-5',
    category: 'visit',
    question: 'What documents should I bring to my initial consultation?',
    answer: 'Please bring a valid photo ID, your insurance card (if applicable), previous medical records, past surgical summaries, imaging discs (X-rays/MRIs/CT scans), and a list of all current prescription medications.'
  }
];

export const HOSPITAL_STATS = [
  { value: '500+', label: 'Inpatient Bed Capacity', detail: 'Including 90 critical care ICUs' },
  { value: '25+', label: 'Board-Certified Specialists', detail: 'Across 8 centers of clinical excellence' },
  { value: '99.2%', label: 'Clinical Recovery Rate', detail: 'Consistently validated quality indicators' },
  { value: '24/7', label: 'Emergency Trauma Hub', detail: 'Average ambulance response < 6 mins' }
];

export const ACCREDITATIONS = [
  {
    title: 'JCI Gold Seal of Approval',
    body: 'Accredited by Joint Commission International for highest global standards in patient safety and clinical governance.'
  },
  {
    title: 'NABH Accreditation',
    body: 'Certified by the National Accreditation Board for Hospitals & Healthcare Providers for quality healthcare delivery.'
  },
  {
    title: 'CAP Certified Pathology',
    body: 'Accredited by the College of American Pathologists for precision diagnostic testing and lab pathology.'
  },
  {
    title: 'Green Hospital Certified',
    body: 'LEED Platinum energy-efficient healthcare campus emphasizing healing environments and zero biomedical hazard.'
  }
];

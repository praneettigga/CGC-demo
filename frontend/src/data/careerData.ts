export const skillCategories = [
  'software',
  'data-ai',
  'cloud-devops',
  'security-networking',
  'electronics-electrical',
  'mechanical-manufacturing',
  'civil-construction',
  'chemical-process',
  'engineering-design',
] as const

export type SkillCategory = (typeof skillCategories)[number]

export const categoryLabels: Record<SkillCategory, string> = {
  software: 'Software',
  'data-ai': 'Data & AI',
  'cloud-devops': 'Cloud & DevOps',
  'security-networking': 'Security & Networks',
  'electronics-electrical': 'Electronics & Electrical',
  'mechanical-manufacturing': 'Mechanical & Manufacturing',
  'civil-construction': 'Civil & Construction',
  'chemical-process': 'Chemical & Process',
  'engineering-design': 'Engineering Design',
}

export const knowledgeVersion = '2026.08-engineering-1'
export const knowledgeReviewedOn = '2026-08-31'

export const datasetSources = [
  {
    name: 'ESCO',
    version: '1.2.1',
    url: 'https://esco.ec.europa.eu/en/use-esco/download',
    use: 'Occupation-to-skill relationships and skill vocabulary.',
  },
  {
    name: 'O*NET',
    version: '31.0',
    url: 'https://www.onetcenter.org/database.html',
    use: 'Technology names, tools, and occupation skill examples.',
  },
] as const

export interface SkillDefinition {
  id: string
  name: string
  category: SkillCategory
  aliases: string[]
  /** Short terms such as C, R, and CAD must occur in a resume-relevant context. */
  requiresContext?: boolean
}

export interface RoleDefinition {
  id: string
  name: string
  description: string
  essentialSkillIds: string[]
  supportingSkillIds: string[]
  projectTerms: string[]
  courseworkTerms: string[]
  degreeTerms: string[]
}

const skill = (
  id: string,
  name: string,
  category: SkillCategory,
  aliases: string[],
  requiresContext = false,
): SkillDefinition => ({ id, name, category, aliases, requiresContext })

const role = (
  id: string,
  name: string,
  description: string,
  essentialSkillIds: string[],
  supportingSkillIds: string[],
  projectTerms: string[],
  courseworkTerms: string[],
  degreeTerms: string[],
): RoleDefinition => ({
  id,
  name,
  description,
  essentialSkillIds,
  supportingSkillIds,
  projectTerms,
  courseworkTerms,
  degreeTerms,
})

export const skills: SkillDefinition[] = [
  skill('javascript', 'JavaScript', 'software', ['javascript', 'js']),
  skill('typescript', 'TypeScript', 'software', ['typescript', 'ts']),
  skill('react', 'React', 'software', ['react', 'react.js', 'reactjs']),
  skill('angular', 'Angular', 'software', ['angular', 'angularjs']),
  skill('vue', 'Vue.js', 'software', ['vue.js', 'vuejs']),
  skill('html', 'HTML', 'software', ['html', 'html5']),
  skill('css', 'CSS', 'software', ['css', 'css3']),
  skill('node', 'Node.js', 'software', ['node.js', 'nodejs']),
  skill('express', 'Express', 'software', ['express', 'express.js', 'expressjs']),
  skill('java', 'Java', 'software', ['java']),
  skill('spring', 'Spring Boot', 'software', ['spring boot', 'springboot']),
  skill('python', 'Python', 'software', ['python']),
  skill('django', 'Django', 'software', ['django']),
  skill('fastapi', 'FastAPI', 'software', ['fastapi', 'fast api']),
  skill('c', 'C', 'software', ['c', 'c programming'], true),
  skill('c-plus-plus', 'C++', 'software', ['c++', 'cpp', 'c plus plus']),
  skill('c-sharp', 'C#', 'software', ['c#', 'c sharp']),
  skill('dotnet', '.NET', 'software', ['.net', 'dotnet', 'asp.net']),
  skill('go', 'Go', 'software', ['golang'], true),
  skill('kotlin', 'Kotlin', 'software', ['kotlin']),
  skill('swift', 'Swift', 'software', ['swift']),
  skill('flutter', 'Flutter', 'software', ['flutter']),
  skill('rest-api', 'REST APIs', 'software', ['rest api', 'restful api', 'restful services']),
  skill('graphql', 'GraphQL', 'software', ['graphql']),
  skill('microservices', 'Microservices', 'software', ['microservices', 'microservice architecture']),
  skill('unit-testing', 'Unit Testing', 'software', ['unit testing', 'jest', 'junit', 'pytest']),
  skill('selenium', 'Selenium', 'software', ['selenium']),
  skill('jira', 'Jira', 'software', ['jira', 'atlassian jira']),
  skill('sql', 'SQL', 'data-ai', ['sql']),
  skill('postgresql', 'PostgreSQL', 'data-ai', ['postgresql', 'postgres']),
  skill('mysql', 'MySQL', 'data-ai', ['mysql']),
  skill('mongodb', 'MongoDB', 'data-ai', ['mongodb', 'mongo db']),
  skill('redis', 'Redis', 'data-ai', ['redis']),
  skill('excel', 'Excel', 'data-ai', ['excel', 'microsoft excel']),
  skill('power-bi', 'Power BI', 'data-ai', ['power bi', 'powerbi']),
  skill('tableau', 'Tableau', 'data-ai', ['tableau']),
  skill('pandas', 'Pandas', 'data-ai', ['pandas']),
  skill('numpy', 'NumPy', 'data-ai', ['numpy']),
  skill('statistics', 'Statistics', 'data-ai', ['statistics', 'statistical analysis']),
  skill('data-visualization', 'Data Visualization', 'data-ai', ['data visualization', 'data visualisation']),
  skill('machine-learning', 'Machine Learning', 'data-ai', ['machine learning']),
  skill('deep-learning', 'Deep Learning', 'data-ai', ['deep learning']),
  skill('scikit-learn', 'scikit-learn', 'data-ai', ['scikit-learn', 'sklearn']),
  skill('tensorflow', 'TensorFlow', 'data-ai', ['tensorflow']),
  skill('pytorch', 'PyTorch', 'data-ai', ['pytorch']),
  skill('computer-vision', 'Computer Vision', 'data-ai', ['computer vision']),
  skill('aws', 'AWS', 'cloud-devops', ['aws', 'amazon web services']),
  skill('azure', 'Azure', 'cloud-devops', ['azure', 'microsoft azure']),
  skill('gcp', 'Google Cloud', 'cloud-devops', ['gcp', 'google cloud']),
  skill('docker', 'Docker', 'cloud-devops', ['docker']),
  skill('kubernetes', 'Kubernetes', 'cloud-devops', ['kubernetes', 'k8s']),
  skill('terraform', 'Terraform', 'cloud-devops', ['terraform']),
  skill('ci-cd', 'CI / CD', 'cloud-devops', ['ci/cd', 'ci cd', 'continuous integration', 'continuous delivery']),
  skill('linux', 'Linux', 'cloud-devops', ['linux', 'ubuntu']),
  skill('git', 'Git', 'cloud-devops', ['git', 'github', 'gitlab']),
  skill('networking', 'Computer Networking', 'security-networking', ['computer networking', 'tcp/ip', 'tcp ip', 'network protocols']),
  skill('network-security', 'Network Security', 'security-networking', ['network security', 'firewall']),
  skill('cybersecurity', 'Cybersecurity', 'security-networking', ['cybersecurity', 'cyber security', 'information security']),
  skill('penetration-testing', 'Penetration Testing', 'security-networking', ['penetration testing', 'pen testing', 'pentesting']),
  skill('wireshark', 'Wireshark', 'security-networking', ['wireshark']),
  skill('splunk', 'Splunk', 'security-networking', ['splunk']),
  skill('circuit-design', 'Circuit Design', 'electronics-electrical', ['circuit design', 'analog circuits', 'digital circuits']),
  skill('pcb-design', 'PCB Design', 'electronics-electrical', ['pcb design', 'printed circuit board']),
  skill('embedded-c', 'Embedded C', 'electronics-electrical', ['embedded c', 'embedded-c']),
  skill('microcontroller', 'Microcontrollers', 'electronics-electrical', ['microcontroller', 'microcontrollers']),
  skill('arduino', 'Arduino', 'electronics-electrical', ['arduino']),
  skill('raspberry-pi', 'Raspberry Pi', 'electronics-electrical', ['raspberry pi']),
  skill('fpga', 'FPGA', 'electronics-electrical', ['fpga']),
  skill('verilog', 'Verilog', 'electronics-electrical', ['verilog', 'systemverilog']),
  skill('vhdl', 'VHDL', 'electronics-electrical', ['vhdl']),
  skill('matlab', 'MATLAB', 'electronics-electrical', ['matlab']),
  skill('simulink', 'Simulink', 'electronics-electrical', ['simulink']),
  skill('power-systems', 'Power Systems', 'electronics-electrical', ['power systems', 'power system']),
  skill('electrical-safety', 'Electrical Safety', 'electronics-electrical', ['electrical safety', 'electrical protection']),
  skill('renewable-energy', 'Renewable Energy', 'electronics-electrical', ['renewable energy', 'solar energy', 'wind energy']),
  skill('plc', 'PLC', 'electronics-electrical', ['plc', 'programmable logic controller'], true),
  skill('scada', 'SCADA', 'electronics-electrical', ['scada']),
  skill('solidworks', 'SolidWorks', 'mechanical-manufacturing', ['solidworks', 'solid works']),
  skill('creo', 'Creo', 'mechanical-manufacturing', ['creo', 'ptc creo']),
  skill('mechanical-design', 'Mechanical Design', 'mechanical-manufacturing', ['mechanical design', 'machine design']),
  skill('manufacturing', 'Manufacturing', 'mechanical-manufacturing', ['manufacturing', 'manufacturing processes']),
  skill('cnc', 'CNC Machining', 'mechanical-manufacturing', ['cnc', 'cnc machining'], true),
  skill('ansys', 'ANSYS', 'mechanical-manufacturing', ['ansys']),
  skill('fea', 'Finite Element Analysis', 'mechanical-manufacturing', ['finite element analysis', 'fea']),
  skill('cfd', 'Computational Fluid Dynamics', 'mechanical-manufacturing', ['computational fluid dynamics', 'cfd']),
  skill('hvac', 'HVAC', 'mechanical-manufacturing', ['hvac']),
  skill('automotive', 'Automotive Engineering', 'mechanical-manufacturing', ['automotive engineering', 'vehicle dynamics']),
  skill('autocad', 'AutoCAD', 'engineering-design', ['autocad', 'auto cad']),
  skill('cad', 'CAD', 'engineering-design', ['cad', 'computer aided design'], true),
  skill('gd-t', 'GD&T', 'engineering-design', ['gd&t', 'geometric dimensioning and tolerancing']),
  skill('revit', 'Revit', 'civil-construction', ['revit', 'autodesk revit']),
  skill('staad-pro', 'STAAD.Pro', 'civil-construction', ['staad.pro', 'staad pro']),
  skill('etabs', 'ETABS', 'civil-construction', ['etabs']),
  skill('structural-analysis', 'Structural Analysis', 'civil-construction', ['structural analysis']),
  skill('surveying', 'Surveying', 'civil-construction', ['surveying', 'land surveying']),
  skill('estimation', 'Cost Estimation', 'civil-construction', ['cost estimation', 'quantity estimation']),
  skill('primavera', 'Primavera P6', 'civil-construction', ['primavera p6', 'primavera']),
  skill('construction-management', 'Construction Management', 'civil-construction', ['construction management']),
  skill('bim', 'BIM', 'civil-construction', ['bim', 'building information modeling', 'building information modelling']),
  skill('geotechnical', 'Geotechnical Engineering', 'civil-construction', ['geotechnical engineering', 'soil mechanics']),
  skill('process-engineering', 'Process Engineering', 'chemical-process', ['process engineering']),
  skill('aspen-hysys', 'Aspen HYSYS', 'chemical-process', ['aspen hysys', 'hysys']),
  skill('aspen-plus', 'Aspen Plus', 'chemical-process', ['aspen plus']),
  skill('chemical-reaction-engineering', 'Reaction Engineering', 'chemical-process', ['chemical reaction engineering', 'reaction engineering']),
  skill('mass-transfer', 'Mass Transfer', 'chemical-process', ['mass transfer']),
  skill('heat-transfer', 'Heat Transfer', 'chemical-process', ['heat transfer']),
  skill('process-safety', 'Process Safety', 'chemical-process', ['process safety', 'process hazard analysis']),
  skill('hazop', 'HAZOP', 'chemical-process', ['hazop']),
  skill('p-id', 'P&ID', 'chemical-process', ['p&id', 'p and id', 'piping and instrumentation diagram']),
  skill('quality-control', 'Quality Control', 'engineering-design', ['quality control', 'quality assurance']),
]

const softwareDegree = ['computer science', 'computer engineering', 'information technology', 'b.tech cse', 'b.e. cse']
const electricalDegree = ['electrical engineering', 'electronics engineering', 'electronics and communication', 'ece', 'eee']
const mechanicalDegree = ['mechanical engineering', 'mechatronics engineering', 'production engineering']
const civilDegree = ['civil engineering', 'construction engineering']
const chemicalDegree = ['chemical engineering', 'process engineering']

export const roles: RoleDefinition[] = [
  role('frontend-developer', 'Frontend Developer', 'Builds accessible, responsive web interfaces.', ['javascript', 'react', 'html', 'css'], ['typescript', 'angular', 'vue', 'git'], ['portfolio', 'web application', 'responsive website'], ['web development', 'human computer interaction'], softwareDegree),
  role('backend-developer', 'Backend Developer', 'Builds APIs, services, and dependable data systems.', ['node', 'rest-api', 'sql', 'git'], ['express', 'java', 'spring', 'python', 'postgresql'], ['api', 'backend service', 'server application'], ['database management systems', 'operating systems'], softwareDegree),
  role('full-stack-developer', 'Full-Stack Developer', 'Works across web interfaces, APIs, and data.', ['javascript', 'react', 'node', 'sql'], ['typescript', 'express', 'postgresql', 'docker', 'git'], ['full stack', 'web application', 'e-commerce'], ['web development', 'database management systems'], softwareDegree),
  role('mobile-developer', 'Mobile Developer', 'Builds and tests mobile applications.', ['flutter', 'javascript', 'rest-api'], ['kotlin', 'swift', 'react', 'git'], ['mobile app', 'android app', 'ios app'], ['mobile application development'], softwareDegree),
  role('software-engineer', 'Software Engineer', 'Designs, builds, tests, and maintains software.', ['java', 'python', 'git', 'unit-testing'], ['c-plus-plus', 'c-sharp', 'rest-api', 'sql'], ['software project', 'application development'], ['data structures', 'algorithms', 'object oriented programming'], softwareDegree),
  role('qa-engineer', 'QA Engineer', 'Improves software quality through testing and automation.', ['unit-testing', 'selenium', 'git'], ['javascript', 'python', 'jira', 'rest-api'], ['test automation', 'test suite', 'quality assurance'], ['software testing', 'software engineering'], softwareDegree),
  role('data-analyst', 'Data Analyst', 'Turns data into clear findings and visual reports.', ['sql', 'excel', 'statistics', 'data-visualization'], ['power-bi', 'tableau', 'python', 'pandas'], ['data dashboard', 'data analysis', 'business report'], ['statistics', 'data analytics'], softwareDegree),
  role('business-intelligence-analyst', 'Business Intelligence Analyst', 'Builds dashboards and reporting for decisions.', ['sql', 'power-bi', 'data-visualization'], ['excel', 'tableau', 'statistics'], ['business dashboard', 'kpi dashboard', 'reporting'], ['business intelligence', 'data analytics'], softwareDegree),
  role('data-engineer', 'Data Engineer', 'Builds reliable systems for collecting and preparing data.', ['python', 'sql', 'postgresql'], ['docker', 'aws', 'gcp', 'pandas'], ['data pipeline', 'etl pipeline', 'data warehouse'], ['database management systems', 'big data'], softwareDegree),
  role('machine-learning-engineer', 'Machine Learning Engineer', 'Builds and evaluates machine-learning systems.', ['python', 'machine-learning', 'scikit-learn', 'statistics'], ['pandas', 'tensorflow', 'pytorch', 'docker'], ['machine learning model', 'prediction model', 'classification model'], ['machine learning', 'probability', 'linear algebra'], softwareDegree),
  role('ai-engineer', 'AI Engineer', 'Applies AI models in useful software products.', ['python', 'machine-learning', 'deep-learning'], ['tensorflow', 'pytorch', 'rest-api', 'docker'], ['ai application', 'deep learning model', 'nlp project'], ['artificial intelligence', 'machine learning'], softwareDegree),
  role('cloud-engineer', 'Cloud Engineer', 'Deploys and maintains cloud infrastructure.', ['aws', 'docker', 'linux', 'git'], ['azure', 'gcp', 'terraform', 'kubernetes', 'ci-cd'], ['cloud deployment', 'cloud infrastructure', 'deployed application'], ['cloud computing', 'operating systems'], softwareDegree),
  role('devops-engineer', 'DevOps Engineer', 'Automates delivery and operates reliable systems.', ['docker', 'ci-cd', 'linux', 'git'], ['kubernetes', 'terraform', 'aws', 'azure'], ['deployment pipeline', 'devops project', 'infrastructure as code'], ['devops', 'operating systems', 'cloud computing'], softwareDegree),
  role('cybersecurity-analyst', 'Cybersecurity Analyst', 'Protects systems and investigates security risks.', ['cybersecurity', 'network-security', 'networking'], ['linux', 'wireshark', 'splunk', 'penetration-testing'], ['security audit', 'vulnerability assessment', 'security project'], ['cyber security', 'computer networks'], softwareDegree),
  role('network-engineer', 'Network Engineer', 'Designs and supports computer networks.', ['networking', 'linux', 'network-security'], ['wireshark', 'aws', 'azure'], ['network design', 'network simulation', 'network configuration'], ['computer networks', 'network security'], softwareDegree),
  role('embedded-systems-engineer', 'Embedded Systems Engineer', 'Builds software for hardware devices.', ['embedded-c', 'c-plus-plus', 'microcontroller'], ['arduino', 'raspberry-pi', 'circuit-design', 'git'], ['embedded system', 'iot device', 'microcontroller project'], ['embedded systems', 'microprocessors', 'digital electronics'], electricalDegree),
  role('electronics-design-engineer', 'Electronics Design Engineer', 'Designs and validates electronic circuits and boards.', ['circuit-design', 'pcb-design', 'matlab'], ['autocad', 'microcontroller', 'embedded-c'], ['pcb project', 'circuit design', 'electronic prototype'], ['analog electronics', 'digital electronics', 'electronic circuits'], electricalDegree),
  role('vlsi-design-engineer', 'VLSI Design Engineer', 'Designs and verifies digital integrated circuits.', ['verilog', 'fpga', 'circuit-design'], ['vhdl', 'python', 'linux'], ['vlsi project', 'rtl design', 'fpga project'], ['vlsi design', 'digital electronics', 'computer architecture'], electricalDegree),
  role('electrical-power-engineer', 'Electrical Power Engineer', 'Designs and maintains electrical power systems.', ['power-systems', 'matlab', 'circuit-design'], ['simulink', 'autocad', 'electrical-safety'], ['power system', 'load flow', 'substation design'], ['power systems', 'electrical machines'], electricalDegree),
  role('renewable-energy-engineer', 'Renewable Energy Engineer', 'Designs and evaluates sustainable energy systems.', ['renewable-energy', 'power-systems', 'matlab'], ['simulink', 'autocad', 'electrical-safety'], ['solar project', 'renewable energy system', 'wind energy project'], ['renewable energy', 'power systems'], electricalDegree),
  role('control-automation-engineer', 'Control and Automation Engineer', 'Automates industrial equipment and processes.', ['plc', 'scada', 'simulink'], ['matlab', 'microcontroller', 'circuit-design'], ['automation project', 'plc project', 'control system'], ['control systems', 'industrial automation'], electricalDegree),
  role('telecom-engineer', 'Telecommunications Engineer', 'Works on communications systems and networks.', ['networking', 'matlab', 'circuit-design'], ['python', 'wireshark', 'linux'], ['wireless communication', 'communication system', 'telecom project'], ['digital communication', 'signal processing', 'communication systems'], electricalDegree),
  role('mechanical-design-engineer', 'Mechanical Design Engineer', 'Designs components and assemblies for manufacture.', ['solidworks', 'mechanical-design', 'gd-t'], ['autocad', 'creo', 'fea', 'manufacturing'], ['cad model', 'mechanical design', 'assembly design'], ['machine design', 'engineering drawing', 'strength of materials'], mechanicalDegree),
  role('manufacturing-engineer', 'Manufacturing Engineer', 'Improves production methods and manufacturing processes.', ['manufacturing', 'cnc', 'quality-control'], ['solidworks', 'autocad', 'gd-t'], ['manufacturing project', 'process improvement', 'production line'], ['manufacturing processes', 'industrial engineering'], mechanicalDegree),
  role('automotive-engineer', 'Automotive Engineer', 'Designs and tests vehicle components and systems.', ['automotive', 'mechanical-design', 'solidworks'], ['fea', 'cfd', 'matlab'], ['vehicle project', 'automotive design', 'formula student'], ['automotive engineering', 'vehicle dynamics'], mechanicalDegree),
  role('hvac-engineer', 'HVAC Engineer', 'Designs heating, ventilation, and cooling systems.', ['hvac', 'autocad', 'heat-transfer'], ['cfd', 'revit', 'mechanical-design'], ['hvac design', 'cooling load', 'ventilation system'], ['thermodynamics', 'heat transfer', 'refrigeration'], mechanicalDegree),
  role('robotics-engineer', 'Robotics Engineer', 'Builds automated machines combining hardware and software.', ['python', 'c-plus-plus', 'microcontroller'], ['embedded-c', 'matlab', 'mechanical-design', 'computer-vision'], ['robot project', 'autonomous robot', 'robotics competition'], ['robotics', 'control systems', 'mechatronics'], mechanicalDegree),
  role('structural-engineer', 'Structural Engineer', 'Designs safe structural systems for buildings and infrastructure.', ['structural-analysis', 'staad-pro', 'autocad'], ['etabs', 'revit', 'estimation'], ['structural design', 'building design', 'structural analysis'], ['structural analysis', 'reinforced concrete design', 'steel structures'], civilDegree),
  role('construction-engineer', 'Construction Engineer', 'Plans and manages construction work and resources.', ['construction-management', 'estimation', 'primavera'], ['autocad', 'revit', 'surveying'], ['construction project', 'site management', 'project schedule'], ['construction management', 'project management'], civilDegree),
  role('bim-engineer', 'BIM Engineer', 'Creates coordinated digital building models.', ['bim', 'revit', 'autocad'], ['construction-management', 'estimation'], ['bim model', 'building model', 'revit project'], ['building information modeling', 'construction technology'], civilDegree),
  role('geotechnical-engineer', 'Geotechnical Engineer', 'Analyses soil and foundation conditions for projects.', ['geotechnical', 'surveying', 'structural-analysis'], ['autocad', 'estimation'], ['soil investigation', 'foundation design', 'geotechnical project'], ['soil mechanics', 'foundation engineering'], civilDegree),
  role('process-engineer', 'Process Engineer', 'Designs and improves industrial chemical processes.', ['process-engineering', 'aspen-hysys', 'mass-transfer'], ['heat-transfer', 'p-id', 'matlab'], ['process design', 'process simulation', 'chemical plant'], ['mass transfer', 'heat transfer', 'chemical engineering'], chemicalDegree),
  role('chemical-design-engineer', 'Chemical Design Engineer', 'Designs equipment and process systems.', ['aspen-plus', 'process-engineering', 'p-id'], ['aspen-hysys', 'chemical-reaction-engineering', 'autocad'], ['chemical process design', 'plant design', 'equipment design'], ['chemical process design', 'reaction engineering'], chemicalDegree),
  role('process-safety-engineer', 'Process Safety Engineer', 'Identifies and reduces hazards in industrial processes.', ['process-safety', 'hazop', 'p-id'], ['process-engineering', 'aspen-hysys', 'quality-control'], ['hazop study', 'safety assessment', 'risk assessment'], ['process safety', 'chemical process safety'], chemicalDegree),
  role('quality-engineer', 'Quality Engineer', 'Improves quality systems across engineering operations.', ['quality-control', 'statistics', 'manufacturing'], ['excel', 'python', 'process-safety'], ['quality improvement', 'root cause analysis', 'quality project'], ['quality management', 'statistical quality control'], ['engineering', ...mechanicalDegree, ...chemicalDegree]),
]

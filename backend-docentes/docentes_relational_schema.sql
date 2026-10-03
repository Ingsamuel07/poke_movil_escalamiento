-- ========================================================
-- SCHEMA Y SEED RELACIONAL PARA DOCENTES UNINPAHU (MySQL)
-- Facultad de Ingeniería y Tecnologías de la Información (FITI)
-- ========================================================

CREATE DATABASE IF NOT EXISTS uninpahu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uninpahu_db;

CREATE TABLE docentes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  programa VARCHAR(255) NOT NULL,
  facultad VARCHAR(255) NOT NULL,
  correo VARCHAR(255),
  telefono VARCHAR(100),
  sede VARCHAR(255),
  imagen TEXT,
  linkedin VARCHAR(255),
  resumen TEXT,
  perfil_completo TEXT,
  formacion TEXT,
  areas_investigacion TEXT,
  asignaturas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Inserción de Docentes Oficiales de UNINPAHU
-- --------------------------------------------------------

INSERT INTO docentes (id, nombre, cargo, programa, facultad, correo, telefono, sede, imagen, linkedin, resumen, perfil_completo, formacion, areas_investigacion, asignaturas)
VALUES
(
  1,
  'ELFAR DIDIER MORANTES SANCHEZ',
  'Profesor Universitario e Instructor SENA | Arquitecto de Software',
  'Ingeniería de Software',
  'Facultad de Ingeniería y Tecnologías de la Información (FITI)',
  'emorantessa@uninpahu.edu.co',
  '+57 (601) 3323500 Ext. 192',
  'Sede Principal Bogotá (Calle 44 # 16-20)',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  'https://www.linkedin.com/in/elfar-didier-morantes-s%C3%A1nchez/',
  'Ingeniero Electrónico | Magíster en Educación y Elearning | Profesor Universitario e Instructor SENA | Desarrollador de Software | Arquitecto de Software | Fullstack Web Developer.',
  'ELFAR DIDIER MORANTES SÁNCHEZ es Ingeniero Electrónico y Magíster en Educación y Elearning. Cuenta con una destacada trayectoria académica y profesional como Profesor Universitario en UNINPAHU e Instructor SENA. En la industria del software se desempeña como Desarrollador Fullstack y Arquitecto de Software, especializado en diseño de sistemas distribuidos, microservicios agnósticos, computación en la nube, bases de datos relacionales (MySQL, MariaDB, Oracle) y plataformas e-learning de alto impacto pedagógico.',
  'Ingeniero Electrónico | Magíster en Educación y Elearning | Especialista en Ingeniería de Software y Arquitecturas Distribuidas',
  'Arquitectura de Software, Microservicios Agnósticos, Cloud Computing, Metodologías Ágiles, Plataformas E-Learning, Modelado y Optimización de Bases de Datos Relacionales (MySQL/MariaDB).',
  'Arquitectura de Software, Microservicios y APIs, Desarrollo Web Fullstack, Bases de Datos Relacionales (MySQL), Computación en la Nube, Programación Móvil.'
),
(
  2,
  'Jorge Jurado',
  'Docente Titular e Investigador FITI',
  'Ingeniería de Software',
  'Facultad de Ingeniería y Tecnologías de la Información (FITI)',
  'jjurado@uninpahu.edu.co',
  '+57 (601) 3323500 Ext. 192',
  'Sede Principal Bogotá',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://www.linkedin.com/school/uninpahu/',
  'Docente destacado por excelencia pedagógica en la Facultad de Ingeniería y Tecnologías de la Información. Especialista en arquitectura de software y bases de datos relacionales.',
  'Jorge Jurado es un destacado docente universitario e investigador con más de 12 años de trayectoria académica y profesional en la industria del software. Ha orientado asignaturas troncales en UNINPAHU, destacándose por su enfoque pragmático en patrones de diseño arquitectural y gobierno de datos relacionales.',
  'Magíster en Ingeniería de Sistemas y Computación - UNAL | Ingeniero de Sistemas - UNINPAHU',
  'Sistemas Distribuidos, Cloud Computing, Microservicios, Optimización de Bases de Datos Relacionales (MySQL / PostgreSQL).',
  'Arquitectura de Software, Microservicios y APIs, Computación en la Nube, Escalabilidad de Sistemas.'
),
(
  3,
  'Edgar Humberto Angel Millan',
  'Docente Líder del Área Multimedia y Ciberseguridad',
  'Ingeniería de Software y Multimedia',
  'Facultad de Ingeniería y Tecnologías de la Información (FITI)',
  'eangelm@uninpahu.edu.co',
  '+57 (601) 3323500 Ext. 192',
  'Sede Principal Bogotá',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://www.linkedin.com/school/uninpahu/',
  'Docente líder del área multimedia y tecnologías emergentes. Experto en seguridad informática, desarrollo de videojuegos, interfaces inmersivas e inteligencia artificial.',
  'Edgar Humberto Ángel Millán es pionero en la integración de entornos multimedia, ciberseguridad y modelos predictivos dentro del currículo de UNINPAHU. Cuenta con más de una década de experiencia docente liderando laboratorios de desarrollo y proyectos de innovación pedagógica.',
  'Especialista en Seguridad de la Información | Ingeniero de Sistemas y Multimedia | Diplomado en Deep Learning y Computer Vision',
  'Ciberseguridad en APIs y Microservicios, Procesamiento Digital de Imágenes, Redes Neuronales Artificiales, Computación Gráfica Interactiva.',
  'Seguridad Informática, Desarrollo de Videojuegos, Inteligencia Artificial Básica, Computación Gráfica, Práctica Profesional.'
),
(
  4,
  'Lotus King Salcedo Vallejo',
  'Docente Investigador y Líder de Semilleros',
  'Ingeniería de Software',
  'Facultad de Ingeniería y Tecnologías de la Información (FITI)',
  'lsalcedov@uninpahu.edu.co',
  '+57 (601) 3323500 Ext. 192',
  'Sede Principal Bogotá',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
  'https://www.linkedin.com/school/uninpahu/',
  'Líder del grupo de investigación y semilleros en lógica computacional, epistemología aplicada y fundamentación ética de sistemas inteligentes.',
  'Lotus King Salcedo Vallejo se distingue por su enfoque riguroso en los fundamentos teóricos y matemáticos de la computación. En UNINPAHU orienta a los estudiantes en la formulación de hipótesis científicas, diseño de algoritmos de alta eficiencia y análisis de impacto ético en sistemas autónomos.',
  'Doctorado en Filosofía de la Ciencia (Candidato) | Magíster en Ciencias de la Computación | Filósofo e Ingeniero de Sistemas',
  'Epistemología de la Inteligencia Artificial, Lógicas No Clásicas, Complejidad Computacional, Minería de Datos Académica.',
  'Lógica de Programación, Estructuras de Datos y Algoritmos, Metodología de la Investigación, Seminario de Investigación Tecnológica.'
),
(
  5,
  'Claudia Patricia Cárdenas',
  'Directora Académica y Docente de Calidad de Software',
  'Ingeniería de Software',
  'Facultad de Ingeniería y Tecnologías de la Información (FITI)',
  'ccardenas@uninpahu.edu.co',
  '+57 (601) 3323500 Ext. 190',
  'Sede Principal Bogotá',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://www.linkedin.com/school/uninpahu/',
  'Especialista en aseguramiento de calidad de software (QA), acreditación curricular y gestión estratégica del talento tecnológico.',
  'Claudia Patricia Cárdenas ha liderado procesos clave de acreditación curricular y renovación de registros calificados ante el Ministerio de Educación Nacional para UNINPAHU. Como docente, imparte estándares de calidad de software (ISO/IEC 25010), pruebas automatizadas y gobierno de Tecnologías de la Información.',
  'Magíster en Gestión de Calidad | Especialista en Auditoría de Sistemas | Ingeniera de Sistemas | Auditora Líder ISO 9001 / ISO 27001',
  'Métricas de Calidad de Software, Pruebas Automatizadas de APIs, Gestión del Talento TI, Acreditación Universitaria.',
  'Aseguramiento de Calidad de Software (QA), Pruebas y Validación de Sistemas, Auditoría de TI, Ética Profesional.'
),
(
  6,
  'Diego Fernando Cadena',
  'Docente de Desarrollo Web y Móvil',
  'Ingeniería de Software',
  'Facultad de Ingeniería y Tecnologías de la Información (FITI)',
  'dcadena@uninpahu.edu.co',
  '+57 (601) 3323500 Ext. 192',
  'Sede Principal Bogotá',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  'https://www.linkedin.com/school/uninpahu/',
  'Docente de desarrollo frontend y móvil. Especialista en React Native, Expo, diseño de interfaces de usuario y consumo de microservicios REST.',
  'Diego Fernando Cadena es apasionado por la enseñanza de tecnologías web y móviles de vanguardia en UNINPAHU. Cuenta con más de 8 años de experiencia en la creación de aplicaciones móviles escalables para el sector financiero y educativo.',
  'Especialista en Tecnologías Móviles | Ingeniero de Software | Certificado Google Associate Android Developer',
  'Experiencia de Usuario Móvil (Mobile UX), Patrones de Arquitectura Frontend, Integración de Microservicios Agnósticos, Optimización de Rendimiento en Dispositivos Móviles.',
  'Desarrollo Móvil Multiplataforma, Programación Web I, Taller de Lenguajes de Programación, Interacción Humano-Computador.'
);

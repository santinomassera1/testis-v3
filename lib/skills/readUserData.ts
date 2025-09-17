interface UserDataOptions {
  dataType: 'grades' | 'exams' | 'attendance' | 'schedule';
}

interface Grade {
  subject: string;
  grade: number;
  status: 'Aprobado' | 'Desaprobado' | 'Pendiente';
  date: string;
}

interface Exam {
  subject: string;
  date: string;
  time: string;
  classroom: string;
  type: 'Parcial' | 'Final' | 'Recuperatorio';
}

interface Attendance {
  subject: string;
  present: number;
  total: number;
  percentage: number;
  status: 'Regular' | 'Libre';
}

interface Schedule {
  subject: string;
  day: string;
  time: string;
  classroom: string;
  professor: string;
}

export async function readUserData(options: UserDataOptions): Promise<any> {
  const { dataType } = options;
  
  try {
    // Intentar leer desde localStorage primero
    const storedData = localStorage.getItem(`testis_${dataType}`);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // Si no hay datos en localStorage, usar datos de ejemplo
    return getDemoData(dataType);
  } catch (error) {
    console.error('Error leyendo datos del usuario:', error);
    return getDemoData(dataType);
  }
}

export function saveUserData(dataType: string, data: any): void {
  try {
    localStorage.setItem(`testis_${dataType}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando datos del usuario:', error);
  }
}

function getDemoData(dataType: string): any {
  switch (dataType) {
    case 'grades':
      return {
        period: '2024-1',
        grades: [
          { subject: 'Matemática I', grade: 8, status: 'Aprobado', date: '2024-03-15' },
          { subject: 'Programación I', grade: 7, status: 'Aprobado', date: '2024-03-20' },
          { subject: 'Inglés Técnico', grade: 9, status: 'Aprobado', date: '2024-03-18' },
          { subject: 'Sistemas Operativos', grade: 6, status: 'Aprobado', date: '2024-03-22' },
          { subject: 'Base de Datos', grade: 0, status: 'Pendiente', date: '2024-04-10' }
        ] as Grade[]
      };
      
    case 'exams':
      return {
        period: '2024-1',
        exams: [
          { subject: 'Base de Datos', date: '2024-04-10', time: '14:00', classroom: 'Aula 201', type: 'Parcial' },
          { subject: 'Matemática II', date: '2024-04-15', time: '09:00', classroom: 'Aula 105', type: 'Parcial' },
          { subject: 'Programación II', date: '2024-04-20', time: '16:00', classroom: 'Lab 3', type: 'Parcial' },
          { subject: 'Inglés Técnico', date: '2024-04-25', time: '11:00', classroom: 'Aula 203', type: 'Final' }
        ] as Exam[]
      };
      
    case 'attendance':
      return {
        period: '2024-1',
        attendance: [
          { subject: 'Matemática I', present: 18, total: 20, percentage: 90, status: 'Regular' },
          { subject: 'Programación I', present: 16, total: 20, percentage: 80, status: 'Regular' },
          { subject: 'Inglés Técnico', present: 19, total: 20, percentage: 95, status: 'Regular' },
          { subject: 'Sistemas Operativos', present: 12, total: 20, percentage: 60, status: 'Libre' },
          { subject: 'Base de Datos', present: 8, total: 10, percentage: 80, status: 'Regular' }
        ] as Attendance[]
      };
      
    case 'schedule':
      return {
        period: '2024-1',
        schedule: [
          { subject: 'Matemática I', day: 'Lunes', time: '08:00-10:00', classroom: 'Aula 201', professor: 'Dr. García' },
          { subject: 'Programación I', day: 'Lunes', time: '10:00-12:00', classroom: 'Lab 1', professor: 'Ing. López' },
          { subject: 'Inglés Técnico', day: 'Martes', time: '14:00-16:00', classroom: 'Aula 105', professor: 'Prof. Smith' },
          { subject: 'Sistemas Operativos', day: 'Miércoles', time: '16:00-18:00', classroom: 'Lab 2', professor: 'Dr. Martínez' },
          { subject: 'Base de Datos', day: 'Jueves', time: '08:00-10:00', classroom: 'Aula 203', professor: 'Ing. Fernández' }
        ] as Schedule[]
      };
      
    default:
      return { error: 'Tipo de datos no válido' };
  }
}

// Función para cargar datos de ejemplo en localStorage
export function loadDemoData(): void {
  const dataTypes = ['grades', 'exams', 'attendance', 'schedule'];
  
  dataTypes.forEach(dataType => {
    const data = getDemoData(dataType);
    saveUserData(dataType, data);
  });
  
  // Solo mostrar en modo desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.debug('✅ Datos de ejemplo cargados en localStorage');
  }
}

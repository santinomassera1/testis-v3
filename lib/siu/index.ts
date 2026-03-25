import { ISiuClient } from './types';
import { SiuMockClient } from './mock';
import { SiuDisabledClient } from './disabled';

export * from './types';

export function getSiuClient(): ISiuClient {
  const mode = process.env.SIU_MODE ?? 'mock';
  
  switch (mode) {
    case 'disabled':
      return new SiuDisabledClient();
    case 'mock':
      return new SiuMockClient();
    // Futuro: case 'real': return new SiuRealClient();
    // Futuro: case 'sheet': return new SiuSheetClient();
    default:
      console.warn(`SIU_MODE="${mode}" no reconocido, usando mock`);
      return new SiuMockClient();
  }
}


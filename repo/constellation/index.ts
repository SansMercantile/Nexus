import { SYSTEMS, SystemData } from '../../lib/constants';
import {
  getSystemBySlug,
  getSystemById,
  getAllSystems,
  systemsData,
  getSystemValueDescription,
  getSystemSdgs,
  getSystemValueDetails,
} from '../../lib/system-data';
import { SobekKernel } from './sobek';

export type { SystemData };
export {
  SYSTEMS,
  systemsData,
  getSystemBySlug,
  getSystemById,
  getAllSystems,
  getSystemValueDescription,
  getSystemSdgs,
  getSystemValueDetails,
  SobekKernel,
};

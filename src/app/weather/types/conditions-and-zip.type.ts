import { CurrentConditions } from '../../shared/types/current-conditions.type';

export interface ConditionsAndZip {
  zip: string;
  data: CurrentConditions;
}

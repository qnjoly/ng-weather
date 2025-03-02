import { CurrentConditions } from '@shared/types/weather/current-conditions.type';

export interface ConditionsAndZip {
  zip: string;
  data: CurrentConditions;
}

import { HttpResponse } from '@angular/common/http';

export type RequestCacheEntry = {
  url: string;
  response?: HttpResponse<unknown>;
  initiated: number;
  inProgress?: boolean;
};

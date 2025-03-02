import { Component, effect, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RequestCacheService } from '@shared/services/request-cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  private readonly cacheRequestService = inject(RequestCacheService);
  private readonly fb = inject(FormBuilder);

  protected readonly maxAge = this.cacheRequestService.getMaxAge;

  constructor() {
    effect(() => {
      this.form.patchValue({ maxAge: this.maxAge() });
    });
  }

  /**
   * The form to set the max age of the cache
   */
  protected form = this.fb.group({
    maxAge: [this.cacheRequestService.getMaxAge(), [Validators.required, Validators.min(0)]],
  });

  /**
   * Submit the form to set the max age of the cache
   */
  protected onSubmit(): void {
    if (this.form.valid) {
      this.cacheRequestService.setMaxAge(this.form.controls.maxAge.value);
    }
  }
}

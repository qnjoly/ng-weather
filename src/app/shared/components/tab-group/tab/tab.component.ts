import { booleanAttribute, Component, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
})
export class TabComponent {
  /**
   * The title of the tab
   */
  public title = input<string>();

  /**
   * Whether the tab is closeable
   */
  public closeable = input(false, { transform: booleanAttribute });

  /**
   * Current content of the tab
   */
  public content = viewChild('contentTemplate');
}

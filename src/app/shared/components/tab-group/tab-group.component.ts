import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, model, output, OutputEmitterRef, Signal, WritableSignal } from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  imports: [NgTemplateOutlet],
})
export class TabGroupComponent {
  /**
   * The tabs in the tab group
   */
  public tabs: Signal<readonly TabComponent[]> = contentChildren(TabComponent);

  /**
   * The index of the selected tab
   */
  public selectedIndex: WritableSignal<number> = model(0);

  /**
   * Emitted when a tab is closed
   */
  public onTabClosed: OutputEmitterRef<number> = output();

  /**
   * Select a tab
   * @param index The index of the tab to select
   * @param tab The tab to select
   */
  protected selectTab(index: number) {
    this.selectedIndex.set(index);
  }

  /**
   * Close the tab
   * @param tab The tab to close
   */
  protected closeTab(index: number) {
    // If the selected tab is closed, select the first tab
    if (this.selectedIndex() === index) {
      this.selectedIndex.set(0);
    }
    // Notify that the tab is closed
    this.onTabClosed.emit(index);
  }
}

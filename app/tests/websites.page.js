import { Selector } from 'testcafe';
import { navBar } from './navbar.component';

class WebsitesPage {
  constructor() {
    this.pageId = '#websites-page';
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasCards(testController) {
    const cardCount = Selector('.ui.centered.card').count;
    await testController.expect(cardCount).gte(12);
  }

  async create(testController) {
    await testController.click('#website-create');
  }
}

export const websitesPage = new WebsitesPage();

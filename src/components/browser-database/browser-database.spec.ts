import { newSpecPage } from '@stencil/core/testing';
import { BrowserDatabase } from './browser-database';

describe('file-depot', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [BrowserDatabase],
      html: '<file-depot></file-depot>',
    });
    expect(root).toEqualHtml(`
      <file-depot>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </file-depot>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [BrowserDatabase],
      html: `<file-depot first="Stencil" last="'Don't call me a framework' JS"></file-depot>`,
    });
    expect(root).toEqualHtml(`
      <file-depot first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </file-depot>
    `);
  });
});

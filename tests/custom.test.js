/** @jest-environment node */
const { JSDOM } = require('jsdom');
const { bind_footnote_links } = require('../assets/gitbook/custom.js');

function setupDom(width) {
  const dom = new JSDOM(`<!DOCTYPE html><div class="footnotes"><ol><li><p><a href="#fn1" class="reversefootnote">1</a></p></li></ol></div><div id="fn1"></div><div class="body-inner"></div>`);
  const docWidth = width;
  global.window = dom.window;
  global.document = dom.window.document;
  global.$ = (arg) => {
    if (arg === document) {
      return { width: () => docWidth };
    }
    if (typeof arg === 'string') {
      if (arg === 'div.body-inner') {
        return { animate: () => {} };
      }
      if (arg.startsWith('#')) {
        const el = document.querySelector(arg);
        return {
          length: el ? 1 : 0,
          get: () => el
        };
      }
      return {
        find: (sub) => document.querySelectorAll(`${arg} ${sub}`)
      };
    }
    if (arg instanceof dom.window.Element) {
      return {
        attr: (name) => arg.getAttribute(name)
      };
    }
    return {};
  };
  return dom;
}

afterEach(() => {
  delete global.window;
  delete global.document;
  delete global.$;
});

test('does not attach click handlers when document width exceeds 1240', () => {
  const dom = setupDom(1300);
  bind_footnote_links();
  const anchor = document.querySelector('a.reversefootnote');
  const event = new dom.window.Event('click', { bubbles: true, cancelable: true });
  anchor.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
  dom.window.close();
});

test('attaches handler and prevents default when document width is 1240 or less', () => {
  const dom = setupDom(1240);
  bind_footnote_links();
  const anchor = document.querySelector('a.reversefootnote');
  const event = new dom.window.Event('click', { bubbles: true, cancelable: true });
  anchor.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  dom.window.close();
});


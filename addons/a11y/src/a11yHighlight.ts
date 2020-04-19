import { document } from 'global';
import addons from '@storybook/addons';
import { EVENTS, HIGHLIGHT_STYLE_ID } from './constants';

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

interface HighlightInfo {
  /** html selector of the element */
  elements: string[];
  color: string;
}

const channel = addons.getChannel();

const highlight = (infos: HighlightInfo) => {
  const id = HIGHLIGHT_STYLE_ID;
  const sheetToBeRemoved = document.getElementById(id);
  if (sheetToBeRemoved) {
    sheetToBeRemoved.parentNode.removeChild(sheetToBeRemoved);
  }

  const sheet = document.createElement('style');
  sheet.setAttribute('id', id);
  sheet.innerHTML = infos.elements
    .map(
      (target) =>
        `${target}{ outline: 1px dotted ${infos.color}!important; box-shadow: 0 1px 5px 0 ${infos.color}!important; }`
    )
    .join(' ');
  document.head.appendChild(sheet);
};

channel.on(EVENTS.HIGHLIGHT, highlight);
// @flow
// $FlowFixMe
import 'picturefill';

/**
 * ページによってcode-splitされたJSを振り分ける仕組み
 *
 * @return {any} - module
 */
const getComponent = async (): any => {
  let pathname = window.location.pathname;
  pathname = pathname.substring(0, pathname.lastIndexOf('/')) + '/';
  /**
   * case '使いたい頁パス':
   *   await import('（JSまでのパス）').then((module) => {
   *     new module.default();
   *   });
   *   break;
   */
  switch (pathname) {
    case '/':
      await import(/* webpackChunkName:"index" */ './pages/index/index').then((module) => {
        new module.default();
      });
      break;
    default:
  }
};

export default class Main {
  constructor() {
    getComponent();
  }
}

window.addEventListener(
  'DOMContentLoaded',
  (): void => {
    new Main();
  }
);

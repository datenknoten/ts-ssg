/*!
 * @license MIT
 */

import { renderToString } from 'react-dom/server';

import { render } from './components/template';
import { ssgLogger } from './logging/logger';

// tslint:disable-next-line: no-floating-promises
(async function() {
    const template = renderToString(render());
    ssgLogger.debug('oh hai');
    ssgLogger.debug(template);
})();

/*!
 * @license MIT
 */

import {
    Category,
    CategoryConfiguration,
    CategoryLogger,
    CategoryServiceFactory,
    LogLevel,
} from 'typescript-logging';

// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Debug));

// Create categories, they will autoregister themselves, one category without parent (root) and a child category.
export const ssgLogger = new Category('ssg');

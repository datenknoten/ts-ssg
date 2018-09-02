/*!
 * @license MIT
 */

import {
    Command,
    flags,
} from '@oclif/command';
import * as fse from 'fs-extra';
import * as _mkdirp from 'mkdirp';
import * as path from 'path';
import * as react from 'react-dom/server';
import * as util from 'util';
const read = util.promisify(require('read-directory'));
const mkdirp = util.promisify(_mkdirp);

import { AssetEntity } from './entities/asset.entity';
import { PostEntity } from './entities/post.entity';
import { logger } from './logging/logger';

/**
 * Wrapper arround console dir to dump stuff
 */
// tslint:disable-next-line: no-any
function dump(obj: any) {
    // tslint:disable-next-line: no-console
    console.dir(obj, {
        colors: true,
        depth: 10,
        showHidden: true,
        showProxy: true,
    });
}

/**
 * The sitegenerator
 */
class SiteGenerator extends Command {
    public static description = 'describe the command here';

    public static flags = {
        // add --version flag to show CLI version
        version: flags.version({ char: 'v' }),
        help: flags.help({ char: 'h' }),
        config: flags.string({
            char: 'c',
            required: true,
            description: 'path to your config file',
        }),
    };

    public async run() {
        try {
            const parsed = this.parse(SiteGenerator);
            // tslint:disable-next-line: no-any
            const _flags = (parsed as any).flags;
            const fullConfigPath = path.resolve(process.cwd(), _flags.config);

            logger.info(`starting up with config file ${fullConfigPath}`);
            const config = require(fullConfigPath);

            const projectPath = path.dirname(fullConfigPath);
            const contentPath = path.resolve(projectPath, config.content);
            const outputPath = path.resolve(projectPath, config.output);
            const rendererPath = path.resolve(projectPath, config.renderer);

            if (!(await fse.pathExists(rendererPath))) {
                throw new Error('Could not load renderer from file');
            }

            const rendererModule = await import(rendererPath);

            if (typeof rendererModule.render === 'undefined') {
                throw new Error('Render function is missing from render module');
            }

            const render = rendererModule.render;


            if (!(await fse.pathExists(contentPath))) {
                throw new Error('Content directory does not exists');
            }

            logger.debug(`reading content from ${contentPath}`);

            const contents = await read(contentPath);

            const files: Array<AssetEntity | PostEntity> = [];

            for (const filePath of Object.keys(contents)) {
                let entity: AssetEntity;
                if (filePath.endsWith('md')) {
                    entity = new PostEntity();
                } else {
                    entity = new AssetEntity();
                }
                entity.relativPath = filePath;
                entity.absolutePath = path.resolve(contentPath, filePath);
                entity.content = Buffer.from(contents[filePath]);

                files.push(entity);
            }

            for (const file of files) {
                logger.info(`writing out ${file.relativPath}`);
                const absoluteFileName = path.resolve(outputPath, file.relativPath);
                const absoluteFilePath = path.dirname(absoluteFileName);
                await mkdirp(absoluteFilePath);
                if (file instanceof PostEntity) {
                    await fse.writeFile(
                        absoluteFileName.replace(/\.md$/, '.html'),
                        react.renderToStaticMarkup(render(file, files))
                    );
                } else {
                    await fse.writeFile(absoluteFileName, file.content);
                }
            }

            logger.info(`Finished writing ${files.length} files`);

        } catch (error) {
            logger.info(`Failed to render your site: ${error.message}`);
            process.exit(1);
        }
    }
}

export = SiteGenerator;

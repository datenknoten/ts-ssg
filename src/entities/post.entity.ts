/*!
 * @license MIT
 */

import * as cheerio from 'cheerio';
import * as gm from 'gray-matter';
import * as moment from 'moment';
import * as prism from 'prismjs';

import { AssetEntity } from './asset.entity';
import { MetadataEntity } from './metadata.entity';

const marked = require('marked');
const htmlToReactParser = require('html-to-react').Parser;
const parser = new htmlToReactParser();
// tslint:disable-next-line
const loadLanguage = require('prismjs/components/index');

export interface BeautifyOptions {
    code: boolean;
}

/**
 * Representation of a post
 */
export class PostEntity extends AssetEntity {
    public metadata: MetadataEntity;

    private _content: Buffer;

    public get content() {
        return this._content;
    }

    public set content(content: Buffer) {
        const header = gm(content.toString());
        this._content = Buffer.from(header.content.trim());
        this.metadata.title = header.data['title'];
        this.metadata.type = (typeof header.data['type'] === 'undefined' ? 'post' : header.data['type']);
        if (header.data['date']) {
            this.metadata.date = moment(header.data['date']).toDate();
        }
        this.metadata.menu = header.data['menu'];
        this.metadata.weight = header.data['weight'];
    }

    public constructor() {
        super();
        this.metadata = new MetadataEntity();
    }

    public get html() {
        return parser.parse(marked(this.content.toString()));
    }

    /**
     * Enrich the html with additional stuff
     */
    public async beautify(options: BeautifyOptions) {
        const $ = cheerio.load(marked(this.content.toString()));
        if (options.code === true) {
            const elements = $('pre code');

            elements.each(function() {
                const attributes = $(this).attr();
                let language = 'markup';
                if (typeof attributes['class'] === 'string' && attributes['class'].startsWith('language')) {
                    language = attributes['class'].split('-')[1];
                }
                const code = $(this).text();
                loadLanguage(language);
                const highlight = prism.highlight(code, prism.languages[language]);
                $(this)
                    .parent()
                    .replaceWith($(`<pre class="line-numbers language-${language}">
<code class="language-${language}">
${highlight}
</code>
</pre>`));
            });
            this.content = Buffer.from($.html());
        }
    }
}

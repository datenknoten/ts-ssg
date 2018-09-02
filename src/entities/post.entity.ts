/*!
 * @license MIT
 */

import * as gm from 'gray-matter';
import * as moment from 'moment';

import { AssetEntity } from './asset.entity';
import { MetadataEntity } from './metadata.entity';

const marked = require('marked');
const htmlToReactParser = require('html-to-react').Parser;
const parser = new htmlToReactParser();

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
        this.metadata.type = header.data['type'];
        if (header.data['date']) {
        this.metadata.date = moment(header.data['date']).toDate();
        }
    }

    public constructor() {
        super();
        this.metadata = new MetadataEntity();
    }

    public get html() {
        return parser.parse(marked(this.content.toString()));
    }
}

/*!
 * @license MIT
 */

import * as React from 'react';

import { AssetEntity } from '../../src/entities/asset.entity';
import { PostEntity } from '../../src/entities/post.entity';

import { Post } from './post';

/**
 * Export a render function
 */
export function render(post: PostEntity, context: AssetEntity[]) {
    return <html>
        <head>
            <title>{post.metadata.title}</title>
        </head>
        <body>
            <Post post={post}></Post>
        </body>
    </html>;
}

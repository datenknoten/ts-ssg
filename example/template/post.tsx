/*!
 * @license MIT
 */

import * as React from 'react';

import { PostEntity } from '../../src/entities/post.entity';

interface Props {
    post: PostEntity;
}

/**
 * Post component
 */
export class Post extends React.Component<Props, {}> {

    public constructor(props: Props) {
        super(props);
    }

    /**
     * Render method
     */
    public render() {
        const postStyle: React.CSSProperties = {
            backgroundColor: 'fuchsia',
        };

        return <article style={postStyle}>
            <h1>{this.props.post.metadata.title}</h1>
            {this.props.post.html}
        </article>;
    }
}

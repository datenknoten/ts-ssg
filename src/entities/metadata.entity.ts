/*!
 * @license MIT
 */

/**
 * Representation of post metadata
 */
export class MetadataEntity {
    public title: string;
    public date: Date;
    public type: string;
    public menu: string[] = [];
    public weight?: number;
}

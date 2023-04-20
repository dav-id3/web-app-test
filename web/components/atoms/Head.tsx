import NextHead from 'next/head'

import { Data, Interactions } from '../interfaces';
import { Atom, AtomProps } from './atom';

interface D extends Data {
    title: string;
    desc: string;
    favicon: string;
}

interface I extends Interactions { }

interface HeadProps extends AtomProps<I, D> {
    data: D;
    interactions: I;
}

export const Head: Atom<I, D> = ({ data: { title, desc, favicon } }: HeadProps): JSX.Element => {
    return (
        <NextHead>
            <title>{title}</title>
            <meta name="description" content={desc} />
            <link rel="icon" href={favicon} />
        </NextHead>
    );
};
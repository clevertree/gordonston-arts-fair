import * as runtime from 'react/jsx-runtime';
import {evaluateSync} from '@mdx-js/mdx';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';

export function mdToHTML(body: string) {
    const mdx = evaluateSync(body, {
        ...runtime,
    }).default;

    return renderToString(createElement(mdx));
}
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {ReactNode} from "react";

// Your React component
// function MyComponent({ name }) {
//     return <div>Hello, {name}!</div>;
// }

// Function to render a React component to an HTML string
export function renderReactNodeToString(node: ReactNode) {
    const tempDiv = document.createElement('div');
    const root = createRoot(tempDiv);

    flushSync(() => {
        root.render(node);
    });
    const anchors = tempDiv.querySelectorAll('a');
    anchors.forEach(anchor => {
        const span = document.createElement('span');
        span.textContent = anchor.getAttribute('href') || '';
        anchor.replaceWith(span);
    });
    return {
        html: tempDiv.innerHTML,
        text: tempDiv.innerText.replaceAll('\n', '\n\n')
    };
}

// Example usage
// const htmlString = renderReactNodeToHtmlString(<MyComponent name="World" />);
// console.log(htmlString); // Output: <div>Hello, World!</div>
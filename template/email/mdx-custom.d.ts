declare module '*.mdx' {
    export const subject: string;

    /**
     * An function component which renders the MDX content using JSX.
     *
     * @param props This value is be available as the named variable `props` inside the MDX component.
     * @returns A JSX element. The meaning of this may depend on the project configuration. I.e. it
     * could be a React, Preact, or Vuex element.
     */
        // export function MDXContent(props: MDXProps): JSX.Element;

    const MDXContent: (props: any) => React.FC<MDXProps>;
    export default MDXContent;
}
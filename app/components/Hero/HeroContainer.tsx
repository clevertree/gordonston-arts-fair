import styles from "./HeroContainer.module.css"
import React from "react";
import clsx from "clsx";

interface HeroContainerProps {
    children: React.ReactNode,
    containerClassName: string,
    className: string
}

export default function HeroContainer(props: HeroContainerProps) {
    return <div className={clsx(styles.container, props.containerClassName)}>
        <div className={styles.background}></div>
        <div className={clsx(styles.content, props.className)}>
            {props.children}
        </div>
    </div>
}
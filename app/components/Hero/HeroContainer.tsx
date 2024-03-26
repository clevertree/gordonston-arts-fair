import styles from "./HeroContainer.module.css"
import React from "react";

interface HeroContainerProps {
    children: React.ReactNode
}

export default function HeroContainer(props: HeroContainerProps) {
    return <div className={styles.container}>
        <div className={styles.background}></div>
        <div className={styles.content}>
            {props.children}
        </div>
    </div>
}
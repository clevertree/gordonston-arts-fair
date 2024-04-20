import styles from "./HeroContainer.module.css"
import React from "react";
import clsx from "clsx";
import Image from "next/image";

interface HeroContainerProps {
    children: React.ReactNode,
    containerClassName: string,
    className: string
}

export default function HeroContainer(props: HeroContainerProps) {
    return <div className={clsx(styles.container, props.containerClassName)}>
        <Image
            alt="Hero Image Background: Gates of Gordonston"
            src="/img/PXL_20220613_225011729.MP6_-scaled.jpg"
            layout='fill'
            objectFit='cover'
            className={styles.backgroundImg}/>
        <div className={clsx(styles.content, props.className)}>
            {props.children}
        </div>
    </div>
}
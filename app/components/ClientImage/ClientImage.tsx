import React from "react";
import Image from "next/image";
import {ImageProps} from "next/dist/shared/lib/get-img-props";


export default function ClientImage(props: ImageProps) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image {...props}/>
}

'use client'

import React from "react";
import Image from "next/image";
import {ImageProps} from "next/dist/shared/lib/get-img-props";


export default function ReloadingImage(props: ImageProps) {
    return <Image
        onError={(e: any) => {
            'use client'
            setTimeout(() => {
                e.target.src += '?&'
            }, 5000)
        }}
        loading='lazy'
        {...props}
    />
}

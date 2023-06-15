
import React, { useState, useEffect} from "react";
import { createApi } from 'unsplash-js';


const KEY = 'N89m-DZ_bqo5hgOMyPsMXYqSsWsQkW1WJNi9yLSDa7o';
export default function UnsplashImage() {
    const unsplash = createApi({ accessKey: KEY});
    unsplash.photos.getRandom()
    .then((res)  => {
        console.log(res.response.urls.raw)
        return res.response.urls.raw;
    })
    .catch((error) => {
        return 'No image';
    })
} 
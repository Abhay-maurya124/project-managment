import React from 'react'

export const AxiosInstence = axios.create({
    baseUrl:'https://localhost:4000/api/v1',
    withCredentials:true
})


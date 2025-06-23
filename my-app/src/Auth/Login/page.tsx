"use client";

import { useAuthStore } from '@/Store/auth'
import React, { useState } from 'react'

const LoginPage = () => {


    const {login} = useAuthStore()
    const [loading , isLoading] = useState(false)
    const [error , setError]  = useState('')

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const email = formData.get('email') 
        const password = formData.get('password') 

        if(!email || !password){
            setError(()=> 'Please Fill the Form')
            return
        }

        isLoading(()=> true)
        setError(()=> '')
        
        const response = await login(email.toString() , password.toString())
        if(response.error){
            setError(()=> 'Invalid Credentials')
            return
        }
        


        isLoading(()=> false)
    }


    return (
    <div>page</div>
  )
}

export default LoginPage
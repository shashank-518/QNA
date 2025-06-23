"use client";

import { useAuthStore } from '@/Store/auth'
import React, { useState } from 'react'

const Register = () => {

    const {CreateAccount , login} = useAuthStore()
    const [loading , isLoading] = useState(false)
    const [error , setError] = useState('')

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const firstname = formData.get('firstname')
        const lastname = formData.get('lastname')
        const email = formData.get('email')
        const password = formData.get('password')

        if(!firstname || !lastname || !email || !password){
            setError('Please fill in all fields')
            return
        }

        isLoading(true)
        setError('')

        const response = await CreateAccount(
            `${firstname}  ${lastname}`,
            email?.toString(),
            password?.toString()
        )

        if(response.error?.message){
            setError(()=> response.error!.message)
            return
        }else{
            const loginResponse = await login(email?.toString(), password?.toString())
            if(loginResponse.error?.message){
                setError(()=> loginResponse.error!.message)
                return
            }
        }

        isLoading(()=> false)



    }




  return (
    <div>
      {error && <p>{error}</p>}


        <form onSubmit={handleSubmit} ></form>


    </div>
  )
}

export default Register

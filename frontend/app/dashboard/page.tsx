'use client'
import React from 'react'
import { SessionAuth } from "supertokens-auth-react/recipe/session";

const Page = () => {
  return (
    <SessionAuth>
      <div>Dashboard</div>
    </SessionAuth>
  )
}

export default Page
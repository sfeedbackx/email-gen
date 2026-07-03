import { useContext, createContext } from "react";
import { Navigate, useParams } from "react-router-dom"
import { paramsSchema } from "../utils/parsers";
import { ROUTES } from "../utils/constants";
import React from "react";

export const contactIdContext = createContext<number>(0)

export const useContactIdContext = () => {
  return useContext(contactIdContext)
}

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { id } = useParams()

  const parsed = paramsSchema.safeParse({ id })

  const numId = parsed.success ? parsed.data.id : 0

  if (!parsed.success) return <Navigate to={ROUTES.CONTACTS} replace />

  return (

    <contactIdContext.Provider value={numId}>

      {children}

    </contactIdContext.Provider>

  )
}

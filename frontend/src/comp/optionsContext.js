import React, { createContext, useState } from 'react'

export const OptionsContext = createContext()

export const OptionProvider=(props)=>{
    
    const[getUser, setUserId] = useState(0)

    return(
   <OptionsContext.Provider value={
                {
                    visitorId : [getUser, setUserId],
                }}>
       {props.children}
   </OptionsContext.Provider>)
}


// context/GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalArguments, setGlobalArguments] = useState({});

  const updateGlobalArguments = (newArguments) => {
    setGlobalArguments((prevArguments) => ({
      ...prevArguments,
      ...newArguments,
    }));
  };

  return (
    <GlobalContext.Provider value={{ globalArguments, updateGlobalArguments }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

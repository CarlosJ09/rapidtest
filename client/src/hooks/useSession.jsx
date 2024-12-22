import { useState, useEffect } from "react";
import { SESSION_KEY } from "../constants/session";

const useSession = (initialValue = "") => {
  const getStoredValue = () => {
    try {
      const item = window.sessionStorage.getItem(SESSION_KEY);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading sessionStorage key “" + SESSION_KEY + "”: ", error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getStoredValue);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error setting sessionStorage key “" + SESSION_KEY + "”: ", error);
    }
  }, [storedValue]);

  return [storedValue, setStoredValue];
};

export default useSession;

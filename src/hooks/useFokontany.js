// src/hooks/useFokontany.js
import { useState, useEffect } from "react";
import { fetchFokontanyNames } from "../services/layer/wfs";

export const useFokontany = () => {
  const [fokontanyNames, setFokontanyNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchFokontanyNames()
      .then(setFokontanyNames)
      .finally(() => setIsLoading(false));
  }, []);

  return { fokontanyNames, isLoading };
};
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get(url)
      .then((res) => {
        if (!mounted) return;
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
        setLoading(false);
      });

    return () => (mounted = false);
  }, deps);

  return { data, loading, error };
}

import { useCallback, useEffect, useState } from "react";
import client, { errorMessage } from "./client";

// Shared data-fetching hook. Replaces the copy-pasted
// useState + useEffect + axios.get + console.log(error) block that appeared
// in nine components, none of which rendered a loading or error state.
//
// `path` must be a string (not an object built during render) so that the
// effect dependency is stable; passing a freshly-allocated object is what
// made FollowingCheck re-fetch on every render, forever.
export default function useFetch(path, { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (skip || !path) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    client
      .get(path, { signal: controller.signal })
      .then((response) => setData(response.data))
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        setError(errorMessage(err, "Could not load this page."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [path, skip, reloadKey]);

  return { data, error, loading, reload };
}

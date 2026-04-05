/**
 * Custom React Hooks for Anwesha Platform
 * Reusable hooks for common operations across the app
 */

import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import * as API from "../utils/api";

/**
 * Hook for fetching data with loading and error states
 * @param {Function} apiCall - API function to call
 * @param {Array} dependencies - Dependencies for useEffect
 * @param {Boolean} immediate - Call immediately on mount
 */
export function useFetch(apiCall, dependencies = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result.data || result);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      fetch();
    }
  }, dependencies);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook for pagination
 */
export function usePagination(initialPage = 1, pageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    setPage,
    setTotal,
    goNext: () => setPage((p) => Math.min(p + 1, totalPages)),
    goPrev: () => setPage((p) => Math.max(p - 1, 1)),
    reset: () => setPage(1),
  };
}

/**
 * Hook for managing form state
 */
export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    resetForm,
  };
}

/**
 * Hook for user authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

/**
 * Hook for managing notification state
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    // Auto-remove after 5 seconds if it's a temporary notification
    if (notification.autoClose !== false) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    unreadCount,
    setUnreadCount,
    addNotification,
    removeNotification,
  };
}

/**
 * Hook for managing async operation
 */
export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus("pending");
      setData(null);
      setError(null);
      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus("success");
        return response;
      } catch (err) {
        setError(err);
        setStatus("error");
        throw err;
      }
    },
    [asyncFunction],
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

/**
 * Hook for debounced search
 */
export function useDebounceSearch(searchFn, delay = 500) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await searchFn(searchTerm);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay, searchFn]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isSearching,
  };
}

/**
 * Hook for managing local storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for tracking previous value
 */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ── API Query Hooks ──

export function useSkills(params) {
  return useFetch(() => API.skillsApi.list(params), [params]);
}

export function useSkill(id) {
  return useFetch(() => API.skillsApi.get(id), [id]);
}

export function useRequests(params) {
  return useFetch(() => API.requestsApi.list(params), [JSON.stringify(params)]);
}

export function useRequest(id) {
  return useFetch(() => API.requestsApi.get(id), [id]);
}

export function useMyRequests() {
  return useFetch(() => API.requestsApi.getMy(), []);
}

export function useProjects(params) {
  return useFetch(
    () => API.projectsApi.getMy(params),
    [JSON.stringify(params)],
  );
}

export function useProject(id) {
  return useFetch(() => API.projectsApi.get(id), [id]);
}

export function useMessages(conversationId, params) {
  return useFetch(
    () => API.messagesApi.getMessages(conversationId, params),
    [conversationId, JSON.stringify(params)],
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data, refetch } = useFetch(
    () => API.notificationsApi.list(),
    [],
    true,
  );

  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data);
      const unread = data.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    }
  }, [data]);

  return {
    notifications,
    unreadCount,
    loading: data === null,
    refetch,
  };
}

export function useUserProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await API.usersApi.getPublicProfile(uid);
        setProfile(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchProfile();
    }
  }, [uid]);

  return { profile, loading, error };
}

export default {
  useFetch,
  usePagination,
  useForm,
  useAuth,
  useNotifications,
  useAsync,
  useDebounceSearch,
  useLocalStorage,
  useSkills,
  useSkill,
  useRequests,
  useRequest,
  useMyRequests,
  useProjects,
  useProject,
  useMessages,
  useUserProfile,
};

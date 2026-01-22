import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get(API_ENDPOINTS.PROJECTS.LIST);
            setProjects(data.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = async (projectData) => {
        const {data} = await api.post(API_ENDPOINTS.PROJECTS.CREATE , projectData)
        setProjects(prev=>[data.data , ...prev])
        return data
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error, createProject, refreshProjects: fetchProjects };
};
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
    },
    PROJECTS: {
        LIST: "/projects",
        CREATE: "/projects",
        GET: (id) => `/projects/${id}`,
    },
    TASKS: {
        LIST: (projectId) => `/tasks/project/${projectId}`,
        CREATE: "/tasks",
        UPDATE_STATUS: (taskId) => `/tasks/${taskId}/status`,
        DELETE : (id)=> `/tasks/${id}`,
    }
};
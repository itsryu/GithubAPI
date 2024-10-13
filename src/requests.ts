type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

class GitHubAPIRequest {
    public static async request<T>(method: Methods, endpoint: string, token: string): Promise<T> {
        const url = `${process.env.GITHUB_API_ENDPOINT}${endpoint}`;
        const headers = { 'Authorization': `token ${token}` };

        try {
            const response = await fetch(url, { method, headers });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json() as T;
        } catch (error) {
            console.error('Request failed', error);
            throw error;
        }
    }

    public static async fetchPaginatedData<T>(endpoint: string, token: string): Promise<T[]> {
        const data: T[] = [];
        let page = 1;

        while (true) {
            const response = await GitHubAPIRequest.request<T[]>('GET', `${endpoint}?page=${page}`, token);

            if (response.length === 0) break;

            data.push(...response);
            page++;
        }

        return data;
    }
}

export { GitHubAPIRequest };
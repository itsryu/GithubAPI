class GitHubAPIRequest {
    public static async request<T>(endpoint: string, token: string): Promise<T | Error> {
        try {
            const response = await fetch(`https://api.github.com${endpoint}`, {
                headers: { 'Authorization': `token ${token}` }
            });

            return await response.json() as T;
        } catch (error) {
            return error as Error;
        }
    }

    public static async fetchPaginatedData<T>(endpoint: string, token: string): Promise<T[]> {
        const data: T[] = [];
        let page = 1;

        while (true) {
            const response = await GitHubAPIRequest.request<T[] | Error>(`${endpoint}?page=${page}`, token);

            if (response instanceof Error) throw response;
            if (response.length === 0) break;

            data.push(...response);
            page++;
        }

        return data;
    }
}

export { GitHubAPIRequest };
import { GitHubAPIRequest } from "./requests";
import { Repository, User } from "./types/github";

class GitHub implements GitHubAPIRequest {
    private readonly username: string;
    private readonly token: string;

    public constructor(username: string, token: string) {
        this.username = username;
        this.token = token;

        this.validate();
    }

    public getUsername(): string {
        return this.username;
    }

    public getToken(): string {
        return this.token;
    }

    private async validate(): Promise<void> {
        if (!this.username || !this.token) {
            throw new Error('Invalid credentials');
        }

        const { login } = await GitHubAPIRequest.request<User>('GET', `/user`, this.token);

        if (login !== this.username) {
            throw new Error('GitHub username does not match token');
        }
    }

    public async getFollowers(): Promise<User[]> {
        return GitHubAPIRequest.fetchPaginatedData<User>(`/users/${this.username}/followers`, this.token);
    }

    public async getFollowing(): Promise<User[]> {
        return GitHubAPIRequest.fetchPaginatedData<User>(`/users/${this.username}/following`, this.token);
    }

    public async getMutuals(): Promise<User[]> {
        const followers = await this.getFollowers();
        const following = await this.getFollowing();

        return following.filter(follower => followers.some(user => user.login === follower.login));
    }

    public async getNotMutuals(): Promise<User[]> {
        const followers = await this.getFollowers();
        const following = await this.getFollowing();

        return following.filter(user => !followers.some(follower => follower.login === user.login));
    }

    public async getRepositories(): Promise<Repository> {
        const response = await GitHubAPIRequest.request<Repository>('GET', `/users/${this.username}/repos`, this.token);

        return response;
    }

    public async postUnfollowNotMutuals(): Promise<void> {
        const notMutuals = await this.getNotMutuals();

        for (const user of notMutuals) {
            await GitHubAPIRequest.request('POST', `/user/following/${user.login}`, this.token);
        }
    }
}

export { GitHub };
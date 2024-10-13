import { GitHub } from "./src/github";
import dotenv from "dotenv";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";

dotenv.config({ path: './.env', encoding: 'utf8', debug: true });

function writeOutput(file: string, data: string) {
    const output = 'output';
    if (!existsSync(output)) mkdirSync(output);
    writeFileSync(`${output}/${file}`, data, { encoding: 'utf8' });
}

async function main() {
    const github = new GitHub(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN);

    const following = await github.getFollowing();
    const followers = await github.getFollowers();
    const mutuals = await github.getMutuals();
    const notMutuals = await github.getNotMutuals();

    const formatUser = (user: any) => `${user.login} (${user.html_url})`;
    const formatOrganization = (org: any) => `${org.login} [Organization] (${org.html_url})`;

    const separateUsersAndOrgs = (list: any[]) => {
        const users = list.filter(item => !item.type || item.type === 'User').map(formatUser);
        const organizations = list.filter(item => item.type === 'Organization').map(formatOrganization);
        return { users, organizations };
    };

    const followingSeparated = separateUsersAndOrgs(following);
    const followersSeparated = separateUsersAndOrgs(followers);
    const mutualsSeparated = separateUsersAndOrgs(mutuals);
    const notMutualsSeparated = separateUsersAndOrgs(notMutuals);

    writeOutput('following.txt', 'Following Users:\n\t' + followingSeparated.users.join('\n\t') + '\nFollowing Organizations:\n\t' + followingSeparated.organizations.join('\n\t') + '\n');
    writeOutput('followers.txt', 'Followers Users:\n\t' + followersSeparated.users.join('\n\t') + '\nFollowers Organizations:\n\t' + followersSeparated.organizations.join('\n\t') + '\n');
    writeOutput('mutuals.txt', 'Mutuals Users:\n\t' + mutualsSeparated.users.join('\n\t') + '\nMutuals Organizations:\n\t' + mutualsSeparated.organizations.join('\n\t') + '\n');
    writeOutput('not_mutuals.txt', 'Not mutuals Users:\n\t' + notMutualsSeparated.users.join('\n\t') + '\nNot mutuals Organizations:\n\t' + notMutualsSeparated.organizations.join('\n\t') + '\n');
}


main().catch(console.error);
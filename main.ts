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

    writeOutput('following.txt', 'Following:\n\t' + (await github.getFollowing()).map(following => `${following.login} (${following.html_url})`).join('\n\t') + '\n');
    writeOutput('followers.txt', 'Followers:\n\t' + (await github.getFollowers()).map(follower => `${follower.login} (${follower.html_url})`).join('\n\t') + '\n');
    writeOutput('mutuals.txt', 'Mutuals:\n\t' + (await github.getMutuals()).map(mutual => `${mutual.login} (${mutual.html_url})`).join('\n\t') + '\n');
    writeOutput('not_mutuals.txt', 'Not mutuals:\n\t' + (await github.getNotMutuals()).map(not_mutual => `${not_mutual.login} (${not_mutual.html_url})`).join('\n\t') + '\n');
}


main().catch(console.error);
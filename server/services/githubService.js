const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const getUser = async (username) => {
  try {
    const { data } = await octokit.rest.users.getByUsername({ username });
    return data;
  } catch (err) {
    if (err.status === 404) {
      const e = new Error(`GitHub user "${username}" not found.`);
      e.status = 404;
      throw e;
    }
    throw err;
  }
};

const getRepos = async (username) => {
  const { data } = await octokit.rest.repos.listForUser({
    username,
    per_page: 100,
    sort: 'updated',
  });
  return data;
};

const getEvents = async (username) => {
  try {
    const pages = await Promise.all([
      octokit.rest.activity.listPublicEventsForUser({ username, per_page: 100, page: 1 }),
      octokit.rest.activity.listPublicEventsForUser({ username, per_page: 100, page: 2 }),
      octokit.rest.activity.listPublicEventsForUser({ username, per_page: 100, page: 3 }),
    ]);
    return pages.flatMap((p) => p.data);
  } catch {
    return [];
  }
};

const getContributions = async (username) => {
  try {
    const query = `
      query($userName:String!) {
        user(login: $userName){
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;
    const result = await octokit.graphql(query, { userName: username });
    return result.user.contributionsCollection.contributionCalendar;
  } catch (err) {
    return null;
  }
};

const getRepoContents = async (owner, repo) => {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: '' });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

module.exports = { getUser, getRepos, getEvents, getRepoContents, getContributions };
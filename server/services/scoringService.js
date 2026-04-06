const { getUser, getRepos, getEvents, getRepoContents, getContributions } = require('./githubService');

const computeActivityScore = (events) => {
  if (!events || events.length === 0) return 0;

  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;

  const recentPushes = events.filter(
    (e) => e.type === 'PushEvent' && new Date(e.created_at).getTime() > oneYearAgo
  );

  if (recentPushes.length === 0) return 0;

  const commitCount = recentPushes.reduce(
    (sum, e) => sum + (e.payload?.commits?.length || 1),
    0
  );

  const commitScore = Math.min((commitCount / 30) * 20, 20);

  const activeDays = new Set(
    recentPushes.map((e) => new Date(e.created_at).toDateString())
  );
  const streakScore = Math.min((activeDays.size / 20) * 5, 5);

  return Math.min(Math.round(commitScore + streakScore), 25);
};

const computeCodeQualityScore = async (repos, username) => {
  if (!repos || repos.length === 0) return 0;

  const sample = repos.slice(0, 15);
  let total = 0;
  const maxPossible = sample.length * 5;

  for (const repo of sample) {
    if (repo.description && repo.description.trim()) total += 1;
    if (repo.license) total += 1;
    if (repo.topics && repo.topics.length > 0) total += 1;

    const contents = await getRepoContents(username, repo.name);
    const names = contents.map((f) => f.name.toLowerCase());

    if (names.some((n) => n.startsWith('readme'))) total += 1;
    if (names.some((n) => ['test', 'tests', '__tests__', 'spec', 'specs'].includes(n))) total += 1;
  }

  if (maxPossible === 0) return 0;
  return Math.min(Math.round((total / maxPossible) * 100), 100);
};

const computeDiversityScore = (repos) => {
  if (!repos || repos.length === 0) return 0;

  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const langScore = Math.min(languages.size, 10);

  const categories = new Set();
  repos.forEach((repo) => {
    const topics = repo.topics || [];
    const haystack = `${repo.name} ${repo.description || ''} ${topics.join(' ')}`.toLowerCase();

    if (/web|frontend|react|vue|angular|svelte|next|nuxt/.test(haystack))  categories.add('web');
    if (/cli|command.line|terminal|shell/.test(haystack))                   categories.add('cli');
    if (/lib|library|package|sdk|module|npm/.test(haystack))               categories.add('lib');
    if (/api|backend|server|express|fastapi|django|rails/.test(haystack))  categories.add('api');
    if (/mobile|android|ios|flutter|react.native/.test(haystack))          categories.add('mobile');
    if (/data|ml|machine.learn|deep.learn|ai|nlp|kaggle/.test(haystack))   categories.add('data');
    if (/game|unity|godot|pygame/.test(haystack))                          categories.add('game');
    if (/tool|devtool|automation|script|bot/.test(haystack))               categories.add('tool');
    if (/database|db|sql|postgres|mongo|redis/.test(haystack))             categories.add('database');
    if (/docker|kubernetes|k8s|devops|ci|cd|deploy/.test(haystack))        categories.add('devops');
  });

  const categoryScore = Math.min(categories.size, 10);
  return Math.min(Math.round(((langScore + categoryScore) / 20) * 100), 100);
};

const computeCommunityScore = (user, repos) => {
  if (!repos || repos.length === 0) return 0;

  const totalStars   = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks   = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
  const followers    = user.followers || 0;

  const starScore     = Math.min((Math.log10(totalStars + 1) / 3) * 40, 40);
  const forkScore     = Math.min((Math.log10(totalForks + 1) / 2.7) * 30, 30);
  const followerScore = followers >= 50 ? 30 : Math.round((followers / 50) * 30);

  return Math.min(Math.round(starScore + forkScore + followerScore), 100);
};

const computeHiringReadyScore = (user) => {
  let score = 0;
  if (user.bio   && user.bio.trim())   score += 25;
  if (user.blog  && user.blog.trim())  score += 25;
  if (user.email && user.email.trim()) score += 25;
  if ((user.public_repos || 0) >= 4)   score += 25;
  return score;
};

const buildHeatmapDataFromGraphQL = (calendar) => {
  const map = {};
  if (!calendar || !calendar.weeks) return map;

  calendar.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      map[day.date] = day.contributionCount;
    });
  });
  
  return map;
};

const buildLanguages = (repos) => {
  if (!repos || repos.length === 0) return [];

  const count = {};
  repos.forEach((r) => {
    if (r.language) count[r.language] = (count[r.language] || 0) + 1;
  });

  const total = Object.values(count).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, c]) => ({ name, percent: Math.round((c / total) * 100) }));
};

const computeReport = async (username) => {
  const [user, repos, events, contributions] = await Promise.all([
    getUser(username),
    getRepos(username),
    getEvents(username),
    getContributions(username)
  ]);

  const activityScore    = computeActivityScore(events);
  const codeQualityScore = await computeCodeQualityScore(repos, username);
  const diversityScore   = computeDiversityScore(repos);
  const communityScore   = computeCommunityScore(user, repos);
  const hiringReadyScore = computeHiringReadyScore(user);

  const overall = Math.min(
    Math.round(
      activityScore    * 0.25 +
      codeQualityScore * 0.20 +
      diversityScore   * 0.20 +
      communityScore   * 0.20 +
      hiringReadyScore * 0.15
    ),
    100
  );

  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map((r) => ({
      name:        r.name,
      stars:       r.stargazers_count,
      forks:       r.forks_count,
      language:    r.language,
      description: r.description,
      url:         r.html_url,
    }));

  return {
    username,
    avatarUrl:   user.avatar_url,
    name:        user.name,
    bio:         user.bio,
    followers:   user.followers,
    publicRepos: user.public_repos,
    scores: {
      activity:    activityScore,
      codeQuality: codeQualityScore,
      diversity:   diversityScore,
      community:   communityScore,
      hiringReady: hiringReadyScore,
      overall,
    },
    topRepos,
    languages:   buildLanguages(repos),
    heatmapData: buildHeatmapDataFromGraphQL(contributions),
    shareUrl:    `/report/${username}`,
    cachedAt:    new Date(),
    expiresAt:   new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
};

module.exports = { computeReport };
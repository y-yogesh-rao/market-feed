const formatContributorsData = (contributorStats,topContributorsCount) => {
    let contributorResponse = [];
    contributorStats = _.orderBy(contributorStats,'total','desc');

    const limitFactor = (contributorStats.length > topContributorsCount) ? topContributorsCount  : contributorStats.length;
    for(let i=0; i<limitFactor; i++) {
        contributorResponse.push({
            commitCount: contributorStats[i]?.total,
            contributor: {
                id: contributorStats[i]?.author?.id,
                type: contributorStats[i]?.author?.type,
                url: contributorStats[i]?.author?.html_url,
                username: contributorStats[i]?.author?.login,
                siteAdmin: contributorStats[i]?.author?.site_admin,
                avatarUrl: contributorStats[i]?.author?.avatar_url,
            }
        })
    }
    return contributorResponse;
}

const modifyGithubResponse = async (organization,popularRepositories,topContributorsCount) => {
    let responseData = [];
    const headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': `token ${process.env.PERSONAL_ACCESS_TOKEN}`
    }
    for(let popularRepository of popularRepositories) {
        let contributorResponse = await Common.axiosRequest(
            `${process.env.GITHUB_API_DOMAIN}/repos/${organization}/${popularRepository?.name}/stats/contributors`,
            'get',headers,{}
        );

        let contributorStats = contributorResponse?.message?.tolowercase() === 'not found' ? [] : contributorResponse;
        contributorStats = formatContributorsData(contributorStats,topContributorsCount);
        responseData.push({
            repository: {
                id: popularRepository?.id,
                name: popularRepository?.name,
                size: popularRepository?.size,
                score: popularRepository?.score,
                url: popularRepository?.html_url,
                isPrivate: popularRepository?.private,
                fullName: popularRepository?.full_name,
                forksCount: popularRepository?.forks_count,
                permissions: popularRepository?.permissions,
                description: popularRepository?.description,
                allowForking: popularRepository?.allow_forking,
                watchersCount: popularRepository?.watchers_count,
                stargazersCount: popularRepository?.stargazers_count,
                openIssuesCount: popularRepository?.open_issues_count,
                owner: {
                    id: popularRepository?.owner?.id,
                    type: popularRepository?.owner?.type,
                    url: popularRepository?.owner?.html_url,
                    username: popularRepository?.owner?.login,
                    siteAdmin: popularRepository?.owner?.site_admin,
                    avatarUrl: popularRepository?.owner?.avatar_url,
                }
            },
            contributorData: contributorStats,
        });
    }
    return responseData;
}

exports.getPopularRepository = async (req,h) => {
    try {
        const { organization, sortParameter, orderParameter, n, m } = req.query;
        const headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': `token ${process.env.PERSONAL_ACCESS_TOKEN}`
        }
        let params = {
            per_page: n,
            sort: sortParameter,
            order: orderParameter,
            q: `org:"${organization}"`,
        }

        let githubResponse = await Common.axiosRequest(`${process.env.GITHUB_API_DOMAIN}/search/repositories`,'get',headers,params);
        let popularRepositories = githubResponse?.items;
        if(!popularRepositories) {
            return h.response({success:false,message:req.i18n.__('FAILED_TO_FETCH_REPOSITORIES_FROM_GITHUB'),responseData:{}}).code(400);
        }

        const responseData = await modifyGithubResponse(organization,popularRepositories,m);
        return h.response({success:true,message:req.i18n.__('REQUEST_SUCCESSFUL'),responseData:responseData}).code(200);
    } catch(error) {
        console.log(error);
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }
}
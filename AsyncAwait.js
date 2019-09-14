console.log('before');
displayCommits();
console.log('after');

async function displayCommits() {
    try {
        const user = await getUser(1);
        console.log(user);
        const repos = await getRepos(user.username);
        console.log(repos); 
        const commits = await getCommits(repos[0]);
        console.log(commits);
    } catch (err) {
        console.log(err.message);
    }
}
function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Reading user from db...');
            resolve({
                id: id, username: 'xyz'
            })
        }, 2000);
    })

}
function getRepos(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting Repos');
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000)
    })

}
function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting Commits...');
            resolve(['commit1', 'commit2'])
        }, 2000);
    })

}
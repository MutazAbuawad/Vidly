console.log('before');
getUser(1)
    .then(user => getRepos(user.username))
    .then(repos => getCommits([repos[0]]))
    .then(commits => console.log(commits))
    .catch(err => console.log('Error',err));
console.log('after');

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
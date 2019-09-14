console.log('before');
getUser(1, (user) => {
    console.log('User', user);
    getRepos(user, repos => {
        console.log('Repos', repos)
        getCommits(repos[0], commits => {
            console.log('Commits', commits);
            // Callback Hell
        });
    })
});
console.log('after');

function getUser(id, callback) {
    setTimeout(() => {
        console.log('Reading user from db...');
        callback({
            id: id, username: 'xyz'
        })
    }, 2000);
}
function getRepos(username, callback) {
    setTimeout(() => {
        console.log('Getting Repos');
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000)
}
function getCommits(repo, callback){
    setTimeout(()=> {
        console.log('Getting Commits...');
        callback(['commit1','commit2'])
    },2000);
}
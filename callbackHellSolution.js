// simple solution to callback hell
// by naming the anonymous functions
console.log('before');
getUser(1, getRepositories);
console.log('after');

function displayCommits(commits){
    console.log(commits);
}
function getCommitss(repos){
    console.log('Repos', repos)
    getCommits(repos[0], displayCommits);
}

function getRepositories(user){
    console.log('User', user);
    getRepos(user, getCommitss);
}
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
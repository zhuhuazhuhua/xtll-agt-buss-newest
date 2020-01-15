const getTrueOrFalse = function (permId) {
    let perms = localStorage.getItem('perm').split(',');
    return perms.indexOf(permId) != -1;
};
export default getTrueOrFalse;
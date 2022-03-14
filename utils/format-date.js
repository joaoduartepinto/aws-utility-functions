module.exports.formatDate = (date) => {
    return ((date.getDate())) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear();
}
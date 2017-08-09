module.exports = function (ngModule) {
    require('./ls-sharepoint-context/')(ngModule);
    require('./ls-people-picker/')(ngModule);
};
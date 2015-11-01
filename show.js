function Show(id, title, link, description, expirationDate, thumbnailLink, isSaved) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.descr = description;
    this.expirationDate = expirationDate;
    this.thumbnailLink = thumbnailLink;
    this.isSaved = isSaved;
}

Show.prototype.getDaysLeft = function () {
    var today = new Date(), lastDayToWatch = new Date(this.expirationDate);
    return Math.floor((lastDayToWatch.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

Show.prototype.isShowSaved = function (callback) {
    var id = this.id; // todo: bind instead...
    chrome.storage.sync.get(id, function (items) {
        if (id in items) {
            this.isSaved = true;
            callback(true);
        } else {
            this.isSaved = false;
            callback(false);
        }
    });
};

Show.prototype.save = function (callback) {
    var showData = {}, savedCallback = (function () {
        this.isSaved = true;
        if (typeof callback === 'function') {
            callback();
        }
    }).bind(this);
    showData[this.id] = {
        expDate: this.expirationDate.getTime(),
        link: this.link,
        title: this.title,
        longdescription: this.descr,
        thumbnailUrl: this.thumbnailLink
    };
    chrome.storage.sync.set(showData, savedCallback);
};

Show.prototype.unsave = function (callback) {
    var unsavedCallback = (function () {
        this.isSaved = false;
        if (typeof callback === 'function') {
            callback();
        }
    }).bind(this);
    chrome.storage.sync.remove(this.id, unsavedCallback);
};

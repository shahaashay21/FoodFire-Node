exports.isEmpty = function (value) {
    if (value == null || value == "") {
        return true;
    } else {
        if (isArray(value)) {
            if (value.length == 0) return true;
            return false;
        } else if (isObject(value)) {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
};

isArray = function (a) {
    return (!!a) && (a.constructor === Array);
};

isObject = function (a) {
    return (!!a) && (a.constructor === Object);
};

exports.isArray = isArray;
exports.isObject = isObject;
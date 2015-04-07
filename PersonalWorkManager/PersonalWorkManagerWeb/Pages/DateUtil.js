//////////  D A T E   U T I L   //////////
var DateUtil = (function () {

    function getFormattedDate(date) {
        if (date === null) {
            return '';
        }
        if (Object.prototype.toString.call(date) !== '[object Date]') {
            date = new Date(date)
        }
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day + '-' + month + '-' + year;
    }

    return {
        Format: function (date) { return getFormattedDate(date) }
    }

})();

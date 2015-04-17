/*---   D A T E   U T I L   ---*/
var DateUtil = (function () {

    function getFormattedDate(date) {
        var year,
            month,
            day;

        if (date === null) {
            return '';
        }
        if (Object.prototype.toString.call(date) !== "[object Date]") {
            date = new Date(date);
        }

        year = date.getFullYear();
        month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : "0" + month;
        day = date.getDate().toString();
        day = day.length > 1 ? day : "0" + day;

        return day + '-' + month + "-" + year;
    }

    return {
        Format: function (date) { return getFormattedDate(date); }
    };

}());

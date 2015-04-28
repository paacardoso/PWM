/*---   D A T E   U T I L   ---*/
var DateUtil = (function () {

    function getFormattedDate(date, options) {
        var year,
            month,
            day,
            hour,
            minute,
            //second,
            defaults = {
                ShowTime: undefined
            };

        //console.log("options before extend: " + JSON.stringify(options));
        if (options !== undefined) {
            jQuery.extend(options, defaults);
        } else {
            options = defaults;
        }
        //console.log("options after extend: " + JSON.stringify(options));

        if (date === null) {
            return '';
        }
        if (Object.prototype.toString.call(date) !== "[object Date]") {
            date = new Date(date);
        }
        //console.log("Parsing date value: " + date);
        year = date.getFullYear();
        month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : "0" + month;
        day = date.getDate().toString();
        day = day.length > 1 ? day : "0" + day;
        //console.log("y: " + year + "; m: " + month + "; d : " + day);

        if (options.ShowTime === true) {
            hour = date.getHours().toString();
            hour = hour.length > 1 ? hour : "0" + hour;
            minute = date.getMinutes().toString();
            minute = minute.length > 1 ? minute : "0" + minute;
            //second = date.getSeconds().toString();
            //second = second.length > 1 ? second : "0" + second;
            //console.log("h: " + hour + "; m: " + minute); // + "; s: " + second);
            return day + '-' + month + "-" + year + " " +
                   hour + ":" + minute; // + ":" + second;
        }
        return day + '-' + month + "-" + year;
    }

    return {
        Format: function (date, options) { return getFormattedDate(date, options); },
        DATE_FORMAT: "DD-MM-YYYY",
        DATETIME_FORMAT: "DD-MM-YYYY HH:mm"
    };

}());

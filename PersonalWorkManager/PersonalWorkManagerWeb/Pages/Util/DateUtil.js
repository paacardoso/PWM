/*---   D A T E   U T I L   ---*/
var DateUtil = (function () {

    var DATE_FORMAT_STR = "DD-MM-YYYY",
        DATETIME_FORMAT_STR = "DD-MM-YYYY HH:mm";

    function formatString(date, options) {
        var defaults = {
                Format: undefined
            };

        //console.log("options before extend: " + JSON.stringify(options));
        if (options !== undefined) {
            jQuery.extend(options, defaults);
        } else {
            options = defaults;
        }
        //console.log("options after extend: " + JSON.stringify(options));

        if (date === null) {
            //console.log("date is null");
            return "";
        }
        if (options.Format === undefined) {
            //console.log("Formatting date: '" + date + "'");
            return moment(date).format();
        }
        //console.log("Formatting date: '" + date + "' with format: " + options.Format);
        return moment(date).format(options.Format);
    }
    function parseString(date, options) {
        var defaults = {
                Format: undefined
            };

        //console.log("options before extend: " + JSON.stringify(options));
        if (options !== undefined) {
            jQuery.extend(options, defaults);
        } else {
            options = defaults;
        }
        //console.log("options after extend: " + JSON.stringify(options));

        switch (options.Format) {
        case DATE_FORMAT_STR:
            //console.log("Parsing date: '" + date +
            //    "' with format: " + DATE_FORMAT_STR);
            return moment(date, DATE_FORMAT_STR);
        case DATETIME_FORMAT_STR:
            //console.log("Parsing date: '" + date +
            //    "' with format: " + DATETIME_FORMAT_STR);
            return moment(date, DATETIME_FORMAT_STR);
        default:
            //console.log("Parsing date: '" + date + "'");
            return moment(date);
        }
    }
    function toUTC(date) {
        if (date !== null) {
            return date.format();
        }
        return null;
    }

    return {
        DATE_FORMAT: DATE_FORMAT_STR,
        DATETIME_FORMAT: DATETIME_FORMAT_STR,
        format: function (date, options) {
            return formatString(date, options);
        },
        formatDate: function (date) {
            return formatString(date, { Format: DATE_FORMAT_STR });
        },
        formatDateTime: function (date) {
            return formatString(date, { Format: DATETIME_FORMAT_STR });
        },
        parse: function (date, options) {
            return parseString(date, options);
        },
        parseDate: function (date) {
            return parseString(date, { Format: DATE_FORMAT_STR });
        },
        parseDateTime: function (date) {
            return parseString(date, { Format: DATETIME_FORMAT_STR });
        },
        parseUTC: function (date) {
            return parseString(date);
        },
        toUTC: function (date) {
            return toUTC(date);
        },
        today: function () {
            return moment();
        },
        defineDateInterval: function (startElement, endElement) {
            $(startElement).on("dp.change", function (e) {
                if (e.date !== null) {
                    $(endElement).data("DateTimePicker").minDate(e.date);
                }
            });
            $(endElement).on("dp.change", function (e) {
                if (e.date !== null) {
                    $(startElement).data("DateTimePicker").maxDate(e.date);
                }
            });
        }
    };

}());

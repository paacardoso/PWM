/*---   M E S S A G E B O X   ---*/
var MessageBox = (function () {

    function showMainMessage(msg, level, icon, options) {

        var html,
            defaults = {
                Div: undefined,
                StackTrace: undefined
            };

        //console.log("options before extend: " + JSON.stringify(options));
        if (options !== undefined) {
            jQuery.extend(options, defaults);
        } else {
            options = defaults;
        }
        //console.log("options after extend: " + JSON.stringify(options));

        if (options.Div === undefined) {
            if ($("#divModalMessage").length > 0) {
                if ($("#divModalMessage").is(":visible")) {
                    options.Div = "#divModalMessage";
                } else {
                    options.Div = "#divMainMessage";
                }
            } else {
                options.Div = "#divMainMessage";
            }
        }

        html = "<div class='row'>" +
                   "<div class='col-sm-1'>" +
                       "<span style='font-size: 2.5em;' class='glyphicon glyphicon-" +
                       icon + "' aria-hidden='true'></span>" +
                   "</div>" +
                   "<div class='col-sm-11'>" +
                       "<a href='#' class='close'" +
                       " onclick=\"$('" + options.Div + "')" +
                       ".html(''); $('" + options.Div + "')" +
                       ".attr('class', ''); \">&times;</a>" +
                       "<strong><span>" + msg + "</span></strong>";
        if (options.StackTrace !== undefined) {
            html += "<span style='float: right'>" +
                        "<a style='text-align: right; color: #AAAAAA' href='#'" +
                        " onclick=\"$('#lblMainStackTrace').toggle();\">" +
                        "StackTrace&nbsp;</a>" +
                    "</span>" +
                    "<div id='lblMainStackTrace' style='display: none'>" +
                        "<hr>" +
                        options.StackTrace +
                    "</div>";
        }
        html +=    "</div>" +
               "</div>";

        $(options.Div).html(html);
        $(options.Div).attr("class", "alert alert-" + level);
        $(options.Div).show();
    }
    function clearMain() {
        $("#divMainMessage").hide();
    }

    function msgBoxAsk(title, message, cancelledFunc, confirmedFunc) {
        $("#mdlQuestionLabel").text(title);
        $("#mdlQuestionText").text(message);
        $("#btnQuestionCancelled").unbind("click");
        $("#btnQuestionCancelled").on("click", cancelledFunc);
        $("#btnQuestionConfirmed").unbind("click");
        $("#btnQuestionConfirmed").on("click", confirmedFunc);
        $("#mdlQuestion").modal("show");
    }
    function msgBoxHide() {
        $("#mdlQuestion").modal("hide");
    }

    return {
        Success: function (msg, options) {
            showMainMessage(msg, "success", "ok", options);
        },
        Info: function (msg, options) {
            showMainMessage(msg, "info", "exclamation-sign", options);
        },
        Warning: function (msg, options) {
            showMainMessage(msg, "warning", "warning-sign", options);
        },
        Danger: function (msg, options) {
            showMainMessage(msg, "danger", "remove", options);
        },
        Error: function (msg, options) {
            showMainMessage(msg, "danger", "remove", options);
        },
        Exception: function (msg, options) {
            showMainMessage(msg, "danger", "remove", options);
        },
        Clear: function () {
            clearMain();
        },

        // Ask Methods
        Ask: function (title, message, cancelledFunc, confirmedFunc) {
            msgBoxAsk(title, message, cancelledFunc, confirmedFunc);
        },
        Hide: function () {
            msgBoxHide();
        }

    };

}());

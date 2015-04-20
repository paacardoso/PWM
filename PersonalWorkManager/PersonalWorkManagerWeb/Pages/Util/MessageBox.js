/*---   M E S S A G E B O X   ---*/
var MessageBox = (function () {

    function showMainMessage(msg, level, icon, optional) {

        var html,
            divElement;

        html = "<div class='row'>" +
                    "<div class='col-sm-1'>" +
                        "<span style='font-size: 2.5em;' class='glyphicon glyphicon-" +
                        icon + "' aria-hidden='true'></span>" +
                    "</div>" +
                    "<div class='col-sm-11'>" +
                        "<a href='#' class='close' onclick=\"$('#divMainMessage')" +
                        ".hide();\">&times;</a>" +
                        "<strong><span>" + msg + "</span></strong>";
        if (optional !== undefined) {
            html += "<span style='float: right'>" +
                            "<a style='text-align: right; color: #AAAAAA' href='#'" +
                            " onclick=\"$('#lblMainStackTrace').toggle();\">" +
                            "StackTrace&nbsp;</a>" +
                        "</span>" +
                        "<div style='display: none'>" +
                            "<hr>" +
                            optional +
                        "</div>";
        }
        html += "</div>" +
                       "</div>";

        if ($("#divModalMessage").length) {
            divElement = "#divModalMessage";
        } else {
            divElement = "#divMainMessage";
        }

        $(divElement).html(html);
        $(divElement).attr("class", "alert alert-" + level);
        $(divElement).show();
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
        // Message Methods
        Success: function (msg, optional) {
            showMainMessage(msg, "success", "ok", optional);
        },
        Info: function (msg, optional) {
            showMainMessage(msg, "info", "exclamation-sign", optional);
        },
        Warning: function (msg, optional) {
            showMainMessage(msg, "warning", "warning-sign", optional);
        },
        Danger: function (msg, optional) {
            showMainMessage(msg, "danger", "remove", optional);
        },
        Error: function (msg, optional) {
            showMainMessage(msg, "danger", "remove", optional);
        },
        Exception: function (msg, optional) {
            showMainMessage(msg, "danger", "remove", optional);
        },
        Clear: function () {
            clearMain();
        },

        // Ask Methods
        Ask: function (title, message, cancelledFunc, confirmedFunc) {
            msgBoxAsk(title, message, cancelledFunc, confirmedFunc);
        },
        Hide: function () { msgBoxHide(); }

    };

}());

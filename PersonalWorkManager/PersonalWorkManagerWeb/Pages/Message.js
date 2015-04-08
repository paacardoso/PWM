//////////  M A I N   //////////
var MainMessage = (function() {

    function showMainMessage(msg, level, icon, optional) {

        var html = "<div class='row'>" +
                       "<div class='col-sm-1'>" +
                           "<span style='font-size: 2.5em;' class='glyphicon glyphicon-" + icon + "' aria-hidden='true'></span>" +
                       "</div>" +
                       "<div class='col-sm-11'>" +
                           "<strong><span>&nbsp;" + msg + "</span></strong>" +
                           "<a href='#' class='close' onclick=\"$('#divMainMessage').hide();\">&times;</a>";
        if (typeof optional != 'undefined') {
                   html += "<span style='float: right'>" +
                               "<a style='text-align: right; color: #AAAAAA' href='#' onclick=\"$('#lblMainStackTrace').toggle();\">StackTrace&nbsp;</a>" +
                           "</span>" +
                           "<div style='display: none'>" +
                               "<hr>" +
                               optional +
                           "</div>";
        }
               html += "</div>" +
                   "</div>";

        $('#divMainMessage').html(html);
        $('#divMainMessage').attr('class', 'alert alert-' + level);
        $('#divMainMessage').show();
    }

    function clearMain() {
        $('#divMainMessage').hide();
    }

    return {
        Success: function (msg, optional) { showMainMessage(msg, 'success', 'ok', optional) },
        Info: function (msg, optional) { showMainMessage(msg, 'info', 'exclamation-sign', optional) },
        Warning: function (msg, optional) { showMainMessage(msg, 'warning', 'warning-sign', optional) },
        Danger: function (msg, optional) { showMainMessage(msg, 'danger', 'remove', optional) },
        Error: function (msg, optional) { showMainMessage(msg, 'danger', 'remove', optional) },
        Exception: function (msg, optional) { showMainMessage(msg, 'danger', 'remove', optional) },
        Clear: function () { clearMain(); }
    };

})();


//////////  M O D A L  //////////
var ModalMessage = (function () {

    function showModalMessage(msg, level, icon, optional) {

        var html = "<div class='row'>" +
                       "<div class='col-sm-1'>" +
                           "<span style='font-size: 2.5em;' class='glyphicon glyphicon-" + icon + "' aria-hidden='true'></span>" +
                       "</div>" +
                       "<div class='col-sm-11'>" +
                           "<a href='#' class='close' onclick=\"$('#divModalMessage').hide();\">&times;</a>" +
                           "<strong><span>" + msg + "</span></strong>";
        if (typeof optional != 'undefined') {
                   html += "<span style='float: right'>" +
                               "<a style='text-align: right; color: #AAAAAA' href='#' onclick=\"$('#lblModalStackTrace').toggle();\">StackTrace&nbsp;</a>" +
                           "</span>" +
                           "<div id='lblModalStackTrace' style='display: none; word-wrap: break-word;'>" +
                               "<hr>" +
                               optional +
                           "</div>";
        }
               html += "</div>" +
                   "</div>";

        $('#divModalMessage').html(html);
        $('#divModalMessage').attr('class', 'alert alert-' + level);
        $('#divModalMessage').show();
    }

    function clearModal() {
        $('#divModalMessage').hide();
    }

    return {
        Success: function (msg, optional) { showModalMessage(msg, 'success', 'ok', optional) },
        Info: function (msg, optional) { showModalMessage(msg, 'info', 'exclamation-sign', optional) },
        Warning: function (msg, optional) { showModalMessage(msg, 'warning', 'warning-sign', optional) },
        Danger: function (msg, optional) { showModalMessage(msg, 'danger', 'remove', optional) },
        Error: function (msg, optional) { showModalMessage(msg, 'danger', 'remove', optional) },
        Exception: function (msg, optional) { showModalMessage(msg, 'danger', 'remove', optional) },
        Clear: function () { clearModal(); }
    }

})();


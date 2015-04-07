//////////  M A I N   //////////
var MainMessage = (function() {

    function showMainMessage(msg, level, optional) {
        $('#lblMainMessageText').html(msg);
        $("#imgMainMessageIcon").attr("src", "../Resources/Images/msg_" + level + ".png");
        if (typeof optional != 'undefined') {
            $('#lblMainStackTrace').html('<hr>' + optional);
        } else {
            $('#lnkMainStackTrace').hide();
        }
        $('#divMainMessage').attr('class', 'alert alert-' + level);
        $('#divMainMessage').show();
    }

    function clearMain() {
        $('#divMainMessage').hide();
    }

    return {
        Success: function (msg, optional) { showMainMessage(msg, 'success', optional) },
        Info: function (msg, optional) { showMainMessage(msg, 'info', optional) },
        Warning: function (msg, optional) { showMainMessage(msg, 'warning', optional) },
        Danger: function (msg, optional) { showMainMessage(msg, 'danger', optional) },
        Error: function (msg, optional) { showMainMessage(msg, 'danger', optional) },
        Exception: function (msg, optional) { showMainMessage(msg, 'danger', optional) },
        Clear: function () { clearMain(); }
    };

})();


//////////  M O D A L  //////////
var ModalMessage = (function () {

    function showModalMessage(msg, level, optional) {

        var html = "<div class='row'>" +
                       "<div class='col-sm-1'>" +
                           "<img src='../../Resources/Images/msg_" + level + ".png' />" +
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
                       "</div>"
        }
           html += "</div>"

        $('#divModalMessage').html(html);
        $('#divModalMessage').attr('class', 'alert alert-' + level);
        $('#divModalMessage').show();
    }

    function clearModal() {
        $('#divModalMessage').hide();
    }

    return {
        Success: function (msg, optional) { showModalMessage(msg, 'success', optional) },
        Info: function (msg, optional) { showModalMessage(msg, 'info', optional) },
        Warning: function (msg, optional) { showModalMessage(msg, 'warning', optional) },
        Danger: function (msg, optional) { showModalMessage(msg, 'danger', optional) },
        Error: function (msg, optional) { showModalMessage(msg, 'danger', optional) },
        Exception: function (msg, optional) { showModalMessage(msg, 'danger', optional) },
        Clear: function () { clearModal(); }
    }

})();


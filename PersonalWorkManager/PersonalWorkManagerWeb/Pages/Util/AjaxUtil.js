/*---   A J A X   U T I L   ---*/
var AjaxUtil = (function () {

    function defaultFailFunc(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }

    function ajaxCall(url, data, doneFunc, failFunc) {

        //alert('calling [' + url + '] with parameters [' + data + ']');

        var jqxhr;

        jqxhr = $.ajax({
            type: "POST",
            url: url,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(doneFunc)
            .fail(
                function (msg) {
                    if (typeof (failFunc) === "function") {
                        return failFunc(msg);
                    }
                    return defaultFailFunc(msg);
                }
            )
            .always(function () {
                //alert("complete");
            });

    }

    return {
        Call: function (url, data, doneFunc, failFunc) {
            return ajaxCall(url, data, doneFunc, failFunc);
        }
    };

}());

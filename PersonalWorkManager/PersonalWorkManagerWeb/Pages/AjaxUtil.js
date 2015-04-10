function ajaxCall(url, data, doneFunc, failFunc) {

    //alert('calling [' + url + '] with parameters [' + data + ']');

    //create the ajax request
    var jqxhr = $.ajax({
        type: "POST", //HTTP method
        url: url, //page/method name
        data: data, //json to represent argument
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .done(doneFunc)
    .fail(
        function (msg) {
            if (typeof (failFunc) === "function")
                return failFunc(msg);
            else
                return defaultFailFunc(msg);
        }
    )
    .always(function () {
        //alert("complete");
    });

}

function defaultFailFunc(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}
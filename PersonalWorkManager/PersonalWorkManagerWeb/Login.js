var pageHasLoaded = false;

$(function () {
    pageLoad();
});

function pageLoad() {
    // Page load safety check
    if (pageHasLoaded) {
        return;
    }
    pageHasLoaded = true;

    setupPage();
}


////////////////   S E T U P   //////////////////
function setupPage() {
    setupForm();
}
function setupForm() {
    $("#txtLogin").attr('maxlength', '100');
    $("#txtPassword").attr('maxlength', '1000');
}


////////////////    C H A N G E   P A S S W O R D   //////////////////
function login() {
    ajaxCall("Login.aspx/LoginJSON",
             "{'Login':'" + $('#txtLogin').val() + "', " +
              "'Password':'" + $('#txtPassword').val() + "', " +
              "'Persistable':" + $('#chkPersistLoginCookie').is(":checked") + "}",
              loginCallbackOk,
              loginCallbackFailed);
}
function loginCallbackOk(result) {
    var currentUser = JSON.parse(result.d);
    if (currentUser === null) {
        MessageBox.Info('O Login e/ou a senha estão incorrectos. Tente novamente.');
    } else {
        sessionStorage.setItem('current_resource', JSON.stringify(currentUser));
        var vars = getUrlVars();
        if (vars['ReturnUrl'] == undefined)
            window.location.href = resolveURL("/Pages/Projects.aspx");
        else
            window.location.href = decodeURIComponent(vars['ReturnUrl']);
    }
}
function loginCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}

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
        //alert('login ok, «' + currentUser.Name + '» is logged in !!!!');
        sessionStorage.setItem('current_resource', JSON.stringify(currentUser));
        window.location.href = resolveURL("/Pages/Projects.aspx");
    }
}
function loginCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}

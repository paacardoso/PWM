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
//    alert($('#txtLogin2').val());
//    alert($('#txtPassword2').val());
//    alert($('#chkPersistLoginCookie2').is(":checked"));
    ajaxCall("Login.aspx/LoginJSON",
             "{'Login':'" + $('#txtLogin2').val() + "', " +
              "'Password':'" + $('#txtPassword2').val() + "', " +
              "'Persistable':" + $('#chkPersistLoginCookie2').is(":checked") + "}",
             loginCallbackOk,
             loginCallbackFailed);
}
function loginCallbackOk(result) {
    var currentUser = JSON.parse(result.d);
    if (currentUser === null) {
        MainMessage.Info('O Login e/ou a senha estão incorrectos. Tente novamente.');
    } else {
        sessionStorage.setItem('current_resource', currentUser);
        redirectToProjects();
    }
}
function loginCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MainMessage.Exception(ex.Message, ex.StackTrace);
}

function redirectToProjects() {
    window.location.href = resolveURL("/Pages/Projects.aspx");
}

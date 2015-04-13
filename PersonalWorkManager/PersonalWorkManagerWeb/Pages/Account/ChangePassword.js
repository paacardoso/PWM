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
    $("#txtOldPassword").attr('maxlength', '200');
    $("#txtNewPassword").attr('maxlength', '2000');
    $("#txtConfirmPassword").attr('maxlength', '1000');
}


////////////////    C H A N G E   P A S S W O R D   //////////////////
function validatePassword() {
    var msg = '';
    //if ($('#txtOldPassword').val() == '')
    //    msg += "O campo 'Senha actual' é obrigatório."
    //    if ($('#txtNewPassword').val() == '') {
    //        if (msg.length > 0) msg += "<br>";
    //        msg += "O campo 'Nova senha' é obrigatório."
    //    }
    //    if ($('#txtConfirmPassword').val() == '') {
    //        if (msg.length > 0) msg += "<br>";
    //        msg += "O campo 'Confirmar senha' é obrigatório."
    //    }
    if ($('#txtNewPassword').val() != $('#txtConfirmPassword').val()) {
        msg += "A nova senha não é igual à senha de confirmação."
    }
    if (msg.length > 0) {
        MessageBox.Info(msg);
        return false;
    }
    else
        return true;
}
function updatePassword() {
    if (validatePassword() === true) {
        var currentUser = jQuery.parseJSON(sessionStorage.getItem('current_resource'));
        //alert('changing id: ' + currentUser.Id);
        ajaxCall("ChangePassword.aspx/ChangePasswordJSON",
                 "{'Id':" + currentUser.Id + ", " +
                 "'OldPassword':'" + $('#txtOldPassword').val() + "', " +
                 "'NewPassword':'" + $('#txtNewPassword').val() + "'}",
                 updatePasswordCallbackOk,
                 updatePasswordCallbackFailed);
    }
}
function updatePasswordCallbackOk(result) {
    //alert('success ... ');
    var msg = jQuery.parseJSON(result.d);
    if (msg.result == true)
        window.location.href = resolveURL("/Pages/Projects.aspx");
    else
        MessageBox.Info(msg.message);
}
function updatePasswordCallbackFailed(msg) {
    //alert('failed ... ');
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}

function cancelChange() {
    redirectToProjects();
}

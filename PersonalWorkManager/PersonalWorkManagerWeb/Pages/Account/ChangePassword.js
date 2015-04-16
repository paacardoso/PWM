var ChangePassword = (function () {

    var pageHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
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
        if ($('#txtNewPassword').val() !== $('#txtConfirmPassword').val()) {
            msg += "A nova senha não é igual à senha de confirmação.";
        }
        if (msg.length > 0) {
            MessageBox.Info(msg);
            return false;
        }
        return true;
    }


    /*---   U P D A T E   ---*/
    function updatePasswordCallbackOk(result) {
        //alert('success ... ');
        var msg = jQuery.parseJSON(result.d);
        if (msg.result === true) {
            window.location.href = Master.resolveURL("/Pages/Projects.aspx");
        } else {
            MessageBox.Info(msg.message);
        }
    }
    function updatePasswordCallbackFailed(msg) {
        //alert('failed ... ');
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function updatePassword() {
        var currentUser;
        if (validatePassword() === true) {
            currentUser = jQuery.parseJSON(sessionStorage.getItem('current_resource'));
            //alert('changing id: ' + currentUser.Id);
            AjaxUtil.Call("ChangePassword.aspx/ChangePasswordJSON",
                          "{'Id':" + currentUser.Id + ", " +
                          "'OldPassword':'" + $('#txtOldPassword').val() + "', " +
                          "'NewPassword':'" + $('#txtNewPassword').val() + "'}",
                          updatePasswordCallbackOk,
                          updatePasswordCallbackFailed);
        }
    }
    function cancelChange() {
        window.location.href = Master.resolveURL("/Pages/Projects.aspx");
    }


    /*---   S E T U P   ---*/
    function setupForm() {
        $("#txtOldPassword").attr('maxlength', '200');
        $("#txtNewPassword").attr('maxlength', '2000');
        $("#txtConfirmPassword").attr('maxlength', '1000');
    }
    function setupPage() {
        setupForm();
    }


    /*---   L O A D   ---*/


    /*---   M A I N   ---*/
    function pageLoad() {
        // Page load safety check
        if (pageHasLoaded) {
            return;
        }
        pageHasLoaded = true;

        setupPage();
    }
    $(function () {
        pageLoad();
    });


    /*---   P U B L I C   ---*/
    return {
        updatePassword: function () { return updatePassword(); },
        cancelChange: function () { return cancelChange(); }
    };

}());
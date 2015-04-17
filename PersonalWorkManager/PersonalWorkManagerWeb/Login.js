var Login = (function () {

    var pageHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    /*---   L O G I N   ---*/
    function loginCallbackOk(result) {
        var currentUser = JSON.parse(result.d),
            vars;
        if (currentUser === null) {
            MessageBox.Info('O Login e/ou a senha estão incorrectos. Tente novamente.');
        } else {
            sessionStorage.setItem('current_resource', JSON.stringify(currentUser));
            vars = UrlUtil.getUrlVars();
            if (vars.ReturnUrl === undefined) {
                window.location.href = UrlUtil.resolveURL("/Pages/Projects.aspx");
            } else {
                window.location.href = decodeURIComponent(vars.ReturnUrl);
            }
        }
    }
    function loginCallbackFailed(msg) {
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function login() {
        AjaxUtil.Call("Login.aspx/LoginJSON",
                      "{'Login':'" + $("#txtLogin").val() + "', " +
                      "'Password':'" + $("#txtPassword").val() + "', " +
                      "'Persistable':" + $("#chkPersistLoginCookie").is(":checked") + "}",
                      loginCallbackOk,
                      loginCallbackFailed);
    }


    /*---   S E T U P   ---*/
    function setupForm() {
        $("#txtLogin").attr('maxlength', '100');
        $("#txtPassword").attr('maxlength', '1000');
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
        login: function () { return login(); }
    };

}());

var Resources = (function () {

    var pageHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    function validateRequired() {
        var msg = '';
        if ($("#txtLogin").val() === '') {
            msg += "O campo 'Login' é obrigatório.";
        }
        if ($("#txtName").val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($("#ddlStatus").val() === null) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Estado' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.info(msg);
            return false;
        }
        return true;
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlResource").modal("hide");
        var data = {Id: result.d,
                    Login: $("#txtLogin").val(),
                    Name: $("#txtName").val(),
                    Status: $("#ddlStatus option:selected").text() };
        $("#tblResources").bootstrapTable("append", data);
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function insert() {
        if (validateRequired() === true) {
            AjaxUtil.invoke("Resources.aspx/InsertResourceJSON",
                          {Login: $("#txtLogin").val(),
                           Name: $("#txtName").val(),
                           Password: $("#txtPassword").val(),
                           IdStatus: $("#ddlStatus").val()},
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $("#mdlLabel").text("Adicionar Novo Recurso");
        MessageBox.clear();
        $("#txtId").val("");
        $("#txtLogin").val("");
        $("#txtName").val("");
        $("#txtPassword").val("");
        $("#ddlStatus").val("");
        $("#btnActionConfirmed").unbind("click");
        $("#btnActionConfirmed").on("click", insert);
        $("#mdlResource").on("shown.bs.modal", function () { $("#txtLogin").focus(); });
        $("#mdlResource").modal("show");
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $("#mdlResource").modal("hide");
        $("#tblResources").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById("#tblResources", $("#txtId").val()),
            row: {
                Id: $("#txtId").val(),
                Login: $("#txtLogin").val(),
                Name: $("#txtName").val(),
                Status: $("#ddlStatus option:selected").text()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function update() {
        if (validateRequired() === true) {
            AjaxUtil.invoke("Resources.aspx/UpdateResourceJSON",
                          {Id: $("#txtId").val(),
                           Login: $("#txtLogin").val(),
                           Name: $("#txtName").val(),
                           Password: $("#txtPassword").val(),
                           IdStatus: $("#ddlStatus").val()},
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var resource;
        if (row === undefined) {
            resource = $("#tblResources").bootstrapTable("getSelections")[0];
        } else {
            resource = row;
        }
        MessageBox.clear();
        $("#mdlLabel").text("Editar Recurso");
        $("#txtId").val(resource.Id);
        $("#txtLogin").val(resource.Login);
        $("#txtName").val(resource.Name);
        //$("#txtPassword").val(resource.Password);
        $("#ddlStatus option:contains('" + resource.StatusName + "')")
            .attr('selected', true);
        $("#btnActionConfirmed").unbind("click");
        $("#btnActionConfirmed").on("click", update);
        $("#mdlResource").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblResources").bootstrapTable("remove", ids);
        MessageBox.hide();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.hide();
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function removeCancelled() {
        MessageBox.hide();
    }
    function removeConfirmed(resource) {
        var resources = [],
            ids = {
                field: "Id",
                values: []
            },
            index;

        if (resource !== undefined) {
            resources[0] = resource;
        } else {
            resources = $("#tblResources").bootstrapTable("getSelections");
        }

        for (index = 0; index < resources.length; index += 1) {
            ids.values[index] = resources[index].Id;
        }

        AjaxUtil.invoke("Resources.aspx/DeleteResourcesJSON",
                      {Ids: ids.values.join()},
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(resource) {
        if (resource !== undefined) {
            MessageBox.ask("Remover Recurso",
                           "Confirma a remoção do Recurso '" + resource.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(resource); });
        } else {
            MessageBox.ask("Remover Recurso",
                           "Confirma a remoção dos Recursos seleccionados ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
    function setupToolbar() {
        var selectedRows = $("#tblResources").bootstrapTable("getSelections");
        if (selectedRows.length === 0) {
            $("#btnEdit").prop("disabled", true);
            $("#btnRemove").prop("disabled", true);
        } else {
            if (selectedRows.length === 1) {
                $("#btnEdit").prop("disabled", false);
                $("#btnRemove").prop("disabled", false);
            } else {
                $("#btnEdit").prop("disabled", true);
                $("#btnRemove").prop("disabled", false);
            }
        }
    }
    function setupTable() {
        window.actionEvents = {
            "click .edit": function (e, value, row, index) {
                showEditDialog(row);
            },
            "click .remove": function (e, value, row, index) {
                showRemoveDialog(row);
            }
        };
    }
    function setupForm() {
        $("#txtLogin").attr("maxlength", "100");
        $("#txtName").attr("maxlength", "200");
    }
    function setupPage() {
        $("#tblResources")
            .on("check.bs.table", function (e, row) { setupToolbar(); })
            .on("uncheck.bs.table", function (e, row) { setupToolbar(); });
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterTableLoad() {
        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            var obj,
                index;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            index = TableUtil.getTableIndexById('#tblResources', obj.Id);
            $("#tblResources").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.removeItem("search_all_selected_obj");
        }
    }
    function getResourcesCallbackOk(result) {
        $("#tblResources").bootstrapTable("destroy");
        $("#tblResources").bootstrapTable({
            data: JSON.parse(result.d)
        });
        setupToolbar();
        afterTableLoad();
    }
    //function getResourcesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getResources() {
        AjaxUtil.invoke("Resources.aspx/GetResourcesJSON",
                      {},
                      getResourcesCallbackOk);
    }
    function getResourceStatusesCallbackOk(result) {
        var ddl = $("#ddlStatus");
        $.each(JSON.parse(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getResourceStatusesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getResourceStatuses() {
        AjaxUtil.invoke("Resources.aspx/GetResourceStatusesJSON",
                      {},
                      getResourceStatusesCallbackOk);
    }


    /*---   M A I N   ---*/
    function pageLoad() {
        // Page load safety check
        if (pageHasLoaded) {
            return;
        }
        pageHasLoaded = true;

        setupPage();

        getResourceStatuses();
        getResources();
    }
    $(function () {
        pageLoad();
    });


    /*---   P U B L I C   ---*/
    return {
        getResources: function () { return getResources(); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (resource) { return showRemoveDialog(resource); }
    };

}());

var Statuses = (function () {

    var pageHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    function validateRequired() {
        var msg = '';
        if ($("#txtName").val() === '') {
            msg += "O campo 'Nome' é obrigatório.";
        }
        //console.log("index: " + $("#ddlStatusType").val());
        if ($("#ddlStatusType").val() === null) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Tipo de Estado' é obrigatório.";
        }
        if ($("#txtOrder").val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Ordem' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.info(msg);
            return false;
        }
        return true;
    }
    function setupToolbar() {
        var selectedRows = $("#tblStatuses").bootstrapTable("getSelections");
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


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlStatus").modal("hide");
        var data = {Id: result.d,
                    Name: $("#txtName").val(),
                    Description: $("#txtDescription").val(),
                    StatusTypeName: $("#ddlStatusType option:selected").text(),
                    Order: $("#txtOrder").val() };
        $("#tblStatuses").bootstrapTable("append", data);
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function insert() {
        if (validateRequired() === true) {
            AjaxUtil.invoke("Statuses.aspx/InsertStatusJSON",
                          {Name: $("#txtName").val(),
                           Description: $("#txtDescription").val(),
                           IdStatusType: $("#ddlStatusType").val(),
                           Order: $("#txtOrder").val()},
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $("#mdlLabel").text("Adicionar Novo Estado");
        MessageBox.clear();
        $("#txtId").val("");
        $("#txtName").val("");
        $("#txtDescription").val("");
        $("#ddlStatusType").val("");
        $("#txtOrder").val("");
        $("#btnActionConfirmed").unbind("click");
        $("#btnActionConfirmed").on("click", insert);
        $("#mdlStatus").on("shown.bs.modal", function () { $("#txtName").focus(); });
        $("#mdlStatus").modal("show");
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $("#mdlStatus").modal("hide");
        $("#tblStatuses").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById('#tblStatuses', $("#txtId").val()),
            row: {
                Id: $("#txtId").val(),
                Name: $("#txtName").val(),
                Description: $("#txtDescription").val(),
                StatusTypeName: $("#ddlStatusType option:selected").text(),
                Order: $("#txtOrder").val()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function update() {
        if (validateRequired() === true) {
            AjaxUtil.invoke("Statuses.aspx/UpdateStatusJSON",
                          {Id: $("#txtId").val(),
                           Name: $("#txtName").val(),
                           Description: $("#txtDescription").val(),
                           IdStatusType: $("#ddlStatusType").val(),
                           Order: $("#txtOrder").val()},
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var status;
        if (row === undefined) {
            status = $("#tblStatuses").bootstrapTable("getSelections")[0];
        } else {
            status = row;
        }
        MessageBox.clear();
        $("#mdlLabel").text("Editar Estado");
        $("#txtId").val(status.Id);
        $("#txtName").val(status.Name);
        $("#txtDescription").val(status.Description);
        //$("#ddlStatusType").val(status.IdStatusType);
        $("#ddlStatusType option:contains('" + status.StatusTypeName + "')")
            .attr("selected", true);
        $("#txtOrder").val(status.Order);
        $("#btnActionConfirmed").unbind("click");
        $("#btnActionConfirmed").on("click", update);
        $("#mdlStatus").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblStatuses").bootstrapTable("remove", ids);
        MessageBox.hide();
        setupToolbar();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.hide();
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function removeCancelled() {
        MessageBox.hide();
    }
    function removeConfirmed(status) {
        var statuses = [],
            ids = {
                field: 'Id',
                values: []
            },
            index;

        if (status !== undefined) {
            statuses[0] = status;
        } else {
            statuses = $("#tblStatuses").bootstrapTable("getSelections");
        }

        for (index = 0; index < statuses.length; index += 1) {
            ids.values[index] = statuses[index].Id;
        }

        AjaxUtil.invoke("Statuses.aspx/DeleteStatusesJSON",
                      {Ids: ids.values.join()},
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);

    }
    function showRemoveDialog(status) {
        if (status !== undefined) {
            MessageBox.ask("Remover Estado",
                           "Confirma a remoção do Estado '" + status.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(status); });
        } else {
            MessageBox.ask("Remover Estado",
                           "Confirma a remoção dos Estados seleccionados ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
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
        $("#txtName").attr("maxlength", "200");
        $("#txtDescription").attr("maxlength", "1000");
        $("#txtOrder").inputmask({ mask: "9[9]",
                                   greedy: false });
    }
    function setupPage() {
        TableUtil.setToolbarBehavior("#tblStatuses", setupToolbar);
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterTableLoad() {
        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            var obj,
                index;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            index = TableUtil.getTableIndexById('#tblStatuses', obj.Id);
            $("#tblStatuses").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.removeItem("search_all_selected_obj");
        }
    }
    function getStatusStatusTypesCallbackOk(result) {
        var ddl = $("#ddlStatusType");
        $.each(JSON.parse(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getStatusStatusTypesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getStatusStatusTypes() {
        AjaxUtil.invoke("Statuses.aspx/GetStatusStatusTypesJSON",
                      {},
                      getStatusStatusTypesCallbackOk);
    }
    function getStatusesCallbackOk(result) {
        $("#tblStatuses").bootstrapTable("destroy");
        $("#tblStatuses").bootstrapTable({
            data: JSON.parse(result.d)
        });
        setupToolbar();
        afterTableLoad();
    }
    //function getStatusesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getStatuses() {
        AjaxUtil.invoke("Statuses.aspx/GetStatusesJSON",
                      {},
                      getStatusesCallbackOk);
    }


    /*---   M A I N   ---*/
    function pageLoad() {
        // Page load safety check
        if (pageHasLoaded) {
            return;
        }
        pageHasLoaded = true;

        setupPage();

        getStatusStatusTypes();
        getStatuses();
    }
    $(function () {
        pageLoad();
    });


    /*---   P U B L I C   ---*/
    return {
        getStatuses: function () { return getStatuses(); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (status) { return showRemoveDialog(status); }
    };

}());

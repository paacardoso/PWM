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
            MessageBox.Info(msg);
            return false;
        }
        return true;
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlStatus").modal("hide");
        var data = '[{"Id":' + result.d + ', ' +
                   '"Name":"' + $("#txtName").val() + '", ' +
                   '"Description":"' + $("#txtDescription").val() + '", ' +
                   '"StatusTypeName":"' +
                        $("#ddlStatusType option:selected").text() + '", ' +
                   '"Order":' + $("#txtOrder").val() + '}]';
        $("#tblStatuses").bootstrapTable("append", JSON.parse(data));
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function insert() {
        if (validateRequired() === true) {
            AjaxUtil.Call("Statuses.aspx/InsertStatusJSON",
                          '{Name:"' + $("#txtName").val() + '", ' +
                          'Description:"' + $("#txtDescription").val() + '", ' +
                          'IdStatusType:' + $("#ddlStatusType").val() + ', ' +
                          'Order:' + $("#txtOrder").val() + '}',
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $("#mdlLabel").text("Adicionar Novo Estado");
        MessageBox.Clear();
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
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function update() {
        if (validateRequired() === true) {
            AjaxUtil.Call("Statuses.aspx/UpdateStatusJSON",
                          '{Id:' + $("#txtId").val() + ', ' +
                          'Name:"' + $("#txtName").val() + '", ' +
                          'Description:"' + $("#txtDescription").val() + '", ' +
                          'IdStatusType:' + $("#ddlStatusType").val() + ', ' +
                          'Order:' + $("#txtOrder").val() + '}',
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
        MessageBox.Clear();
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
        MessageBox.Hide();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Hide();
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function removeCancelled() {
        MessageBox.Hide();
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

        AjaxUtil.Call("Statuses.aspx/DeleteStatusesJSON",
                      '{Ids:"' + ids.values.join() + '"}',
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);

    }
    function showRemoveDialog(status) {
        if (status !== undefined) {
            MessageBox.Ask("Remover Estado",
                           "Confirma a remoção do Estado '" + status.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(status); });
        } else {
            MessageBox.Ask("Remover Estado",
                           "Confirma a remoção dos Estados seleccionados ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
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
        $("#txtOrder").inputmask("9[9]");
    }
    function actionFormatter(value, row, index) {
        return [
            '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
            '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
        ].join('');
    }
    function setupPage() {
        $("#tblStatuses")
            .on("check.bs.table", function (e, row) { setupToolbar(); })
            .on("uncheck.bs.table", function (e, row) { setupToolbar(); });
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterTableLoad() {
        var id, index;
        if (sessionStorage.getItem("search_all_selected_id").toString() !== 'null') {
            id = sessionStorage.getItem("search_all_selected_id");
            index = TableUtil.getTableIndexById("#tblStatuses", id);
            $("#tblStatuses").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.setItem("search_all_selected_id", null);
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
        AjaxUtil.Call("Statuses.aspx/GetStatusStatusTypesJSON",
                      "",
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
        AjaxUtil.Call("Statuses.aspx/GetStatusesJSON",
                      "",
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
        actionFormatter: function (value, row, index) {
            return actionFormatter(value, row, index);
        },
        getStatuses: function () { return getStatuses(); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (status) { return showRemoveDialog(status); }
    };

}());

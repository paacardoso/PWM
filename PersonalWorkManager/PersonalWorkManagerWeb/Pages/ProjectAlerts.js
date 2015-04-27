var ProjectAlerts = (function () {

    var tabHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    function validateInputFields() {
        var msg = "";
        if ($("#txtAlertName").val() === "") {
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($("#txtAlertDescription").val() === "") {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($("#txtAlertDueDate").datetimepicker().children("input").val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Data' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.Info(msg, { Div: "#divAlertModalMessage" });
            return false;
        }
        MessageBox.Clear();
        return true;
    }



    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlAlert").modal("hide");
        var data = {"Id": result.d,
                    "Name": $("#txtAlertName").val(),
                    "Description": $("#txtAlertDescription").val(),
                    "DueDate": $("#txtAlertDueDate").datetimepicker()
                     .children("input").val() };
        $("#tblAlerts").bootstrapTable('append', data);
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divAlertModalMessage" });
    }
    function insertAlert() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/InsertAlertJSON",
                          '{Name:"' + $("#txtAlertName").val() + '", ' +
                          'Description:"' + $("#txtAlertDescription").val() + '", ' +
                          'DueDate:"' + $("#txtAlertDueDate").datetimepicker()
                            .children("input").val() + '", ' +
                          'IdProject:' + $("#txtId").val() + '}',
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $("#mdlAlertLabel").text("Adicionar novo Alerta");
        $("#txtAlertId").val("");
        $("#txtAlertName").val("");
        $("#txtAlertDescription").val("");
        $("#txtAlertDueDate").datetimepicker().children("input").val('');
        $("#btnAlertActionConfirmed").unbind("click");
        $("#btnAlertActionConfirmed").on("click", insertAlert);
        $("#mdlAlert").modal("show");
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $("#mdlAlert").modal("hide");
        $("#tblAlerts").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById("#tblAlerts", $("#txtAlertId").val()),
            row: {
                Id: $("#txtAlertId").val(),
                Name: $("#txtAlertName").val(),
                Description: $("#txtAlertDescription").val(),
                DueDate: $("#txtAlertDueDate").datetimepicker().children("input").val()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divAlertModalMessage" });
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/updateAlertJSON",
                          '{Id:"' + $("#txtAlertId").val() + '", ' +
                          'Name:"' + $("#txtAlertName").val() + '", ' +
                          'Description:"' + $("#txtAlertDescription").val() + '", ' +
                          'DueDate:"' + $("#txtAlertDueDate").datetimepicker()
                            .children("input").val() + '", ' +
                          'IdProject:' + $("#txtId").val() + '}',
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var alert;
        if (row === undefined) {
            alert = $("#tblAlerts").bootstrapTable("getSelections")[0];
        } else {
            alert = row;
        }
        MessageBox.Clear();
        $("#mdlAlertLabel").text("Editar Alerta");
        $("#txtAlertId").val(alert.Id);
        $("#txtAlertName").val(alert.Name);
        $("#txtAlertDescription").val(alert.Description);
        $("#txtAlertDueDate").datetimepicker().children("input")
            .val(DateUtil.Format(alert.DueDate));
        $("#btnAlertActionConfirmed").unbind("click");
        $("#btnAlertActionConfirmed").on("click", update);
        $("#mdlAlert").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblAlerts").bootstrapTable("remove", ids);
        MessageBox.Hide();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Hide();
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divAlertModalMessage" });
    }
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(alert) {
        var alerts = [],
            ids = {
                field: "Id",
                values: []
            },
            index;

        if (alert !== undefined) {
            alerts[0] = alert;
        } else {
            alerts = $("#tblAlerts").bootstrapTable("getSelections");
        }

        for (index = 0; index < alerts.length; index += 1) {
            ids.values[index] = alerts[index].Id;
        }
        AjaxUtil.Call("Projects.aspx/DeleteAlertsJSON",
                      '{Ids:"' + ids.values.join() + '"}',
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(alert) {
        if (alert !== undefined) {
            MessageBox.Ask("Remover Alerta",
                           "Confirma a remoção do alerta '" + alert.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(alert); });
        } else {
            MessageBox.Ask("Remover Alerta",
                           "Confirma a remoção dos alertas seleccionados ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
    function setupToolbar() {
        var selectedRows = $("#tblAlerts").bootstrapTable("getSelections");
        if (selectedRows.length === 0) {
            $("#btnAlertEdit").prop("disabled", true);
            $("#btnAlertRemove").prop("disabled", true);
        } else {
            if (selectedRows.length === 1) {
                $("#btnAlertEdit").prop("disabled", false);
                $("#btnAlertRemove").prop("disabled", false);
            } else {
                $("#btnAlertEdit").prop("disabled", true);
                $("#btnAlertRemove").prop("disabled", false);
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
        $("#txtAlertName").attr("maxlength", "200");
        $("#txtAlertDescription").attr("maxlength", "1000");
        $("#txtAlertDueDate").datetimepicker({
            format: "DD-MM-YYYY"
        });
    }
    function setupPage() {
        $("#tblAlerts")
            .on("check.bs.table", function (e, row) { setupToolbar(); })
            .on("uncheck.bs.table", function (e, row) { setupToolbar(); });
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterAlertsLoad() {
        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            var obj,
                index;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            index = TableUtil.getTableIndexById('#tblAlerts', obj.Id);
            $("#tblAlerts").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.removeItem("search_all_selected_obj");
        }
    }
    function getAlertsCallbackOk(result) {
        $("#tblAlerts").bootstrapTable("destroy");
        $("#tblAlerts").bootstrapTable({
            data: JSON.parse(result.d)
        });
        setupToolbar();
        afterAlertsLoad();
    }
    //function getAlertsCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getAlerts() {
        var idProject = $("#txtId").val();
        AjaxUtil.Call("Projects.aspx/GetAlertsJSON",
                      '{IdProject:' + idProject + '}',
                      getAlertsCallbackOk);
    }


    /*---   M A I N   ---*/
    function tabLoad() {
        // Tab load safety check
        if (tabHasLoaded) {
            return;
        }
        tabHasLoaded = true;

        setupPage();

        getAlerts();
    }


    /*---   P U B L I C   ---*/
    return {
        getAlerts: function (idProject) { return getAlerts(idProject); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (Alert) { return showRemoveDialog(Alert); },
        tabLoad: function () { return tabLoad(); }
    };

}());

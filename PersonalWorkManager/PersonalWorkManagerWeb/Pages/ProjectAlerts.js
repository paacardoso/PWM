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
            msg += "O campo 'Descrição' é obrigatório.";
        }
        if ($("#txtAlertDueDate").data("DateTimePicker").date() === null) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Data' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.info(msg, { Div: "#divAlertModalMessage" });
            return false;
        }
        MessageBox.clear({ Div: "#divAlertModalMessage" });
        return true;
    }
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


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlAlert").modal("hide");
        var data = {Id: result.d,
                    Name: $("#txtAlertName").val(),
                    Description: $("#txtAlertDescription").val(),
                    DueDate: DateUtil.formatDateTime($("#txtAlertDueDate")
                        .data("DateTimePicker").date())};
        $("#tblAlerts").bootstrapTable('append', data);
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divAlertModalMessage" });
    }
    function insertAlert() {
        if (validateInputFields() === true) {
            AjaxUtil.invoke("Projects.aspx/InsertAlertJSON",
                          {Name: $("#txtAlertName").val(),
                           Description: $("#txtAlertDescription").val(),
                           DueDate: DateUtil.toUTC($("#txtAlertDueDate")
                               .data("DateTimePicker").date()),
                           IdProject: $("#txtId").val()},
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        MessageBox.clear({ Div: "#divAlertModalMessage" });
        $("#mdlAlertLabel").text("Adicionar novo Alerta");
        $("#txtAlertId").val("");
        $("#txtAlertName").val("");
        $("#txtAlertDescription").val("");
        $("#txtAlertDueDate").data("DateTimePicker").date(DateUtil.today());
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
                DueDate: DateUtil.formatDateTime($("#txtAlertDueDate")
                    .data("DateTimePicker").date())
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divAlertModalMessage" });
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.invoke("Projects.aspx/updateAlertJSON",
                          {Id: $("#txtAlertId").val(),
                           Name: $("#txtAlertName").val(),
                           Description: $("#txtAlertDescription").val(),
                           DueDate: DateUtil.toUTC($("#txtAlertDueDate")
                               .data("DateTimePicker").date()),
                           IdProject: $("#txtId").val()},
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var my_alert;
        if (row === undefined) {
            my_alert = $("#tblAlerts").bootstrapTable("getSelections")[0];
        } else {
            my_alert = row;
        }
        MessageBox.clear({ Div: "#divAlertModalMessage" });
        $("#mdlAlertLabel").text("Editar Alerta");
        $("#txtAlertId").val(my_alert.Id);
        $("#txtAlertName").val(my_alert.Name);
        $("#txtAlertDescription").val(my_alert.Description);
        $("#txtAlertDueDate").data("DateTimePicker")
            .date(DateUtil.parseDateTime(my_alert.DueDate));
        $("#btnAlertActionConfirmed").unbind("click");
        $("#btnAlertActionConfirmed").on("click", update);
        $("#mdlAlert").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblAlerts").bootstrapTable("remove", ids);
        MessageBox.hide();
        setupToolbar();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.hide();
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divAlertModalMessage" });
    }
    function removeCancelled() {
        MessageBox.hide();
    }
    function removeConfirmed(my_alert) {
        var my_alerts = [],
            ids = {
                field: "Id",
                values: []
            },
            index;

        if (my_alert !== undefined) {
            my_alerts[0] = my_alert;
        } else {
            my_alerts = $("#tblAlerts").bootstrapTable("getSelections");
        }

        for (index = 0; index < my_alerts.length; index += 1) {
            ids.values[index] = my_alerts[index].Id;
        }
        AjaxUtil.invoke("Projects.aspx/DeleteAlertsJSON",
                      {Ids: ids.values.join()},
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(al) {
        if (al !== undefined) {
            MessageBox.ask("Remover Alerta",
                           "Confirma a remoção do ala '" + al.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(al); });
        } else {
            MessageBox.ask("Remover Alerta",
                           "Confirma a remoção dos alas seleccionados ?",
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
        $("#txtAlertName").attr("maxlength", "200");
        $("#txtAlertDescription").attr("maxlength", "1000");
        $("#txtAlertDueDate").datetimepicker({
            format: DateUtil.DATETIME_FORMAT,
            showClose: true
        });
    }
    function setupPage() {
        TableUtil.setToolbarBehavior("#tblAlerts", setupToolbar);
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
        var rows = JSON.parse(result.d);
        rows.forEach(function (row) {
            row.DueDate = DateUtil.formatDateTime(row.DueDate);
        });
        $("#tblAlerts").bootstrapTable("destroy");
        $("#tblAlerts").bootstrapTable({
            data: rows
        });
        setupToolbar();
        afterAlertsLoad();
    }
    //function getAlertsCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getAlerts() {
        var idProject = $("#txtId").val();
        //console.log("Getting alerts of project id: " + idProject);
        AjaxUtil.invoke("Projects.aspx/GetAlertsJSON",
                      {IdProject: idProject},
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
        tabLoad: function () { return tabLoad(); },
        invalidate: function () { tabHasLoaded = false; }
    };

}());

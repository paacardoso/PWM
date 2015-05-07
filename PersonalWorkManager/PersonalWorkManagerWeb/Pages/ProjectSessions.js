var ProjectSessions = (function () {

    var tabHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    function validateInputFields() {
        var msg = "";
        if ($("#txtSessionStartTime").data("DateTimePicker").date() === null) {
            msg += "O campo 'Hora Inicial' é obrigatório.";
        }
        if ($("#txtSessionEndTime").data("DateTimePicker").date() === null) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Hora Final' é obrigatório.";
        }
        if ($("#ddlSessionTask option:selected").val() === undefined) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Tarefa' é obrigatório.";
        }
        if ($("#ddlSessionResource option:selected").val() === undefined) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Recurso' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.info(msg, { Div: "#divSessionModalMessage" });
            return false;
        }
        MessageBox.clear({ Div: "#divSessionModalMessage" });
        return true;
    }
    function setupToolbar() {
        var selectedRows = $("#tblSessions").bootstrapTable("getSelections");
        if (selectedRows.length === 0) {
            $("#btnSessionEdit").prop("disabled", true);
            $("#btnSessionRemove").prop("disabled", true);
        } else {
            if (selectedRows.length === 1) {
                $("#btnSessionEdit").prop("disabled", false);
                $("#btnSessionRemove").prop("disabled", false);
            } else {
                $("#btnSessionEdit").prop("disabled", true);
                $("#btnSessionRemove").prop("disabled", false);
            }
        }
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlSession").modal("hide");
        var data = {Id: result.d,
                    StartTime: DateUtil.formatDateTime($("#txtSessionStartTime")
                      .data("DateTimePicker").date()),
                    EndTime: DateUtil.formatDateTime($("#txtSessionEndTime")
                      .data("DateTimePicker").date()),
                    Task: $("#ddlSessionTask option:selected").text(),
                    Resource: $("#ddlSessionResource option:selected").text()};
        $("#tblSessions").bootstrapTable('append', data);
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divSessionModalMessage" });
    }
    function insertSession() {
        if (validateInputFields() === true) {
            AjaxUtil.invoke("Projects.aspx/InsertSessionJSON",
                          {StartTime: DateUtil.toUTC($("#txtSessionStartTime")
                             .data("DateTimePicker").date()),
                           EndTime: DateUtil.toUTC($("#txtSessionEndTime")
                             .data("DateTimePicker").date()),
                           IdTask: $("#ddlSessionTask").val(),
                           IdResource: $("#ddlSessionResource").val()},
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        MessageBox.clear({ Div: "#divSessionModalMessage" });
        $("#mdlSessionLabel").text("Adicionar nova Sessão");
        $("#txtSessionId").val("");
        $("#txtSessionStartTime").data("DateTimePicker").minDate(false).maxDate(false);
        $("#txtSessionEndTime").data("DateTimePicker").minDate(false).maxDate(false);
        $("#txtSessionStartTime").data("DateTimePicker").date(DateUtil.today());
        $("#txtSessionEndTime").data("DateTimePicker").date(null);
        $("#ddlSessionTask").val("");
        $("#ddlSessionResource").val("");
        $("#btnSessionActionConfirmed").unbind("click");
        $("#btnSessionActionConfirmed").on("click", insertSession);
        $("#mdlSession").modal("show");
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        //console.log("Session updated ...");
        $("#mdlSession").modal("hide");
        $("#tblSessions").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById("#tblSessions", $("#txtSessionId").val()),
            row: {
                Id: $("#txtSessionId").val(),
                StartTime: DateUtil.formatDateTime($("#txtSessionStartTime")
                    .data("DateTimePicker").date()),
                EndTime: DateUtil.formatDateTime($("#txtSessionEndTime")
                    .data("DateTimePicker").date()),
                Task: $("#ddlSessionTask option:selected").text(),
                Resource: $("#ddlSessionResource option:selected").text()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divSessionModalMessage" });
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.invoke("Projects.aspx/updateSessionJSON",
                          {Id: $("#txtSessionId").val(),
                           StartTime: DateUtil.toUTC($("#txtSessionStartTime")
                             .data("DateTimePicker").date()),
                           EndTime: DateUtil.toUTC($("#txtSessionEndTime")
                             .data("DateTimePicker").date()),
                           IdTask: $("#ddlSessionTask").val(),
                           IdResource: $("#ddlSessionResource").val()},
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var session;
        if (row === undefined) {
            session = $("#tblSessions").bootstrapTable("getSelections")[0];
        } else {
            session = row;
        }
        MessageBox.clear({ Div: "#divSessionModalMessage" });
        $("#mdlSessionLabel").text("Editar Sessão");
        $("#txtSessionId").val(session.Id);
        $("#txtSessionStartTime").data("DateTimePicker").date(DateUtil
            .parseDateTime(session.StartTime));
        $("#txtSessionEndTime").data("DateTimePicker").date(DateUtil
            .parseDateTime(session.EndTime));
        $("#ddlSessionTask option:contains('" + session.TaskName + "')")
            .attr("selected", true);
        $("#ddlSessionResource option:contains('" + session.ResourceName + "')")
            .attr("selected", true);
        $("#btnSessionActionConfirmed").unbind("click");
        $("#btnSessionActionConfirmed").on("click", update);
        $("#mdlSession").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblSessions").bootstrapTable("remove", ids);
        MessageBox.hide();
        setupToolbar();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.hide();
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divSessionModalMessage" });
    }
    function removeCancelled() {
        MessageBox.hide();
    }
    function removeConfirmed(session) {
        var sessions = [],
            ids = {
                field: "Id",
                values: []
            },
            index;

        if (session !== undefined) {
            sessions[0] = session;
        } else {
            sessions = $("#tblSessions").bootstrapTable("getSelections");
        }

        for (index = 0; index < sessions.length; index += 1) {
            ids.values[index] = sessions[index].Id;
        }
        AjaxUtil.invoke("Projects.aspx/DeleteSessionsJSON",
                      {Ids: ids.values.join()},
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(session) {
        if (session !== undefined) {
            MessageBox.ask("Remover Sessão",
                           "Confirma a remoção da sessão '" + session.Id + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(session); });
        } else {
            MessageBox.ask("Remover Sessão",
                           "Confirma a remoção das sessões seleccionadas ?",
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
        $("#txtSessionStartTime").datetimepicker({
            format: DateUtil.DATETIME_FORMAT,
            showClose: true
        });
        $("#txtSessionEndTime").datetimepicker({
            format: DateUtil.DATETIME_FORMAT,
            showClose: true
        });
        DateUtil.defineDateInterval("#txtSessionStartTime", "#txtSessionEndTime");
    }
    function setupPage() {
        TableUtil.setToolbarBehavior("#tblSessions", setupToolbar);
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterSessionsLoad() {
        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            var obj,
                index;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            index = TableUtil.getTableIndexById('#tblSessions', obj.Id);
            $("#tblSessions").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.removeItem("search_all_selected_obj");
        }
    }
    function getSessionsCallbackOk(result) {
        var rows = JSON.parse(result.d);
        rows.forEach(function (row) {
            row.StartTime = DateUtil.formatDateTime(row.StartTime);
            row.EndTime = DateUtil.formatDateTime(row.EndTime);
        });
        $("#tblSessions").bootstrapTable("destroy");
        $("#tblSessions").bootstrapTable({
            data: rows
        });
        setupToolbar();
        afterSessionsLoad();
    }
    //function getSessionsCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getSessions() {
        var idProject = $("#txtId").val();
        AjaxUtil.invoke("Projects.aspx/GetSessionsJSON",
                      {IdProject: idProject},
                      getSessionsCallbackOk);
    }
    function getSessionTasksCallbackOk(result) {
        var ddl = $("#ddlSessionTask");
        $.each(JSON.parse(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getSessionTasksCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getSessionTasks() {
        var idProject = $("#txtId").val();
        AjaxUtil.invoke("Projects.aspx/GetSessionTasksJSON",
                      {IdProject: idProject},
                      getSessionTasksCallbackOk);
    }
    function getSessionResourcesCallbackOk(result) {
        var ddl = $("#ddlSessionResource");
        $.each(JSON.parse(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getSessionResourcesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getSessionResources() {
        var idProject = $("#txtId").val();
        AjaxUtil.invoke("Projects.aspx/GetSessionResourcesJSON",
                      {IdProject: idProject},
                      getSessionResourcesCallbackOk);
    }


    /*---   M A I N   ---*/
    function tabLoad() {
        // Tab load safety check
        if (tabHasLoaded) {
            return;
        }
        tabHasLoaded = true;

        setupPage();

        getSessionTasks();
        getSessionResources();
        getSessions();
    }


    /*---   P U B L I C   ---*/
    return {
        getSessions: function (idProject) { return getSessions(idProject); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (Session) { return showRemoveDialog(Session); },
        tabLoad: function () { return tabLoad(); },
        invalidate: function () { tabHasLoaded = false; }
    };

}());

var ProjectTasks = (function () {

    var tabHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    function validateInputFields() {
        var msg = "";
        if ($("#txtTaskName").val() === "") {
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($("#txtTaskDescription").val() === "") {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($("#txtTaskOrder").val() === "") {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Ordem' é obrigatório.";
        }
        if ($("#ddlTaskStatus option:selected").val() === undefined) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Estado' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.Info(msg, { Div: "#divTaskModalMessage" });
            return false;
        }
        MessageBox.Clear();
        return true;
    }



    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlTask").modal("hide");
        var data = '[{"Id":' + result.d + ', ' +
                   '"Name":"' + $("#txtTaskName").val() + '", ' +
                   '"Description":"' + $("#txtTaskDescription").val() + '", ' +
                   '"Order":' + $("#txtTaskOrder").val() + ', ' +
                   '"Status":"' + $("#ddlTaskStatus option:selected").text() + '"}]';
        $("#tblTasks").bootstrapTable('append', JSON.parse(data));
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divTaskModalMessage" });
    }
    function insertTask() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/InsertTaskJSON",
                          '{Name:"' + $("#txtTaskName").val() + '", ' +
                          'Description:"' + $("#txtTaskDescription").val() + '", ' +
                          'Order:' + $("#txtTaskOrder").val() + ', ' +
                          'IdProject:' + $("#txtId").val() + ', ' +
                          'IdStatus:' + $("#ddlTaskStatus").val() + '}',
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $("#mdlTaskLabel").text("Adicionar nova Tarefa");
        $("#txtTaskId").val("");
        $("#txtTaskName").val("");
        $("#txtTaskDescription").val("");
        $("#txtTaskOrder").val("");
        $("#ddlTaskStatus").val("");
        $("#btnTaskActionConfirmed").unbind("click");
        $("#btnTaskActionConfirmed").on("click", insertTask);
        $("#mdlTask").modal("show");
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $("#mdlTask").modal("hide");
        $("#tblTasks").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById("#tblTasks", $("#txtTaskId").val()),
            row: {
                Id: $("#txtTaskId").val(),
                Name: $("#txtTaskName").val(),
                Description: $("#txtTaskDescription").val(),
                Order: $("#txtTaskOrder").val(),
                Status: $("#ddlTaskStatus option:selected").text()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divTaskModalMessage" });
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/updateTaskJSON",
                          '{Id:"' + $("#txtTaskId").val() + '", ' +
                          'Name:"' + $("#txtTaskName").val() + '", ' +
                          'Description:"' + $("#txtTaskDescription").val() + '", ' +
                          'Order:' + $("#txtTaskOrder").val() + ', ' +
                          'IdProject:' + $("#txtId").val() + ', ' +
                          'IdStatus:' + $("#ddlTaskStatus").val() + '}',
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var task;
        if (row === undefined) {
            task = $("#tblTasks").bootstrapTable("getSelections")[0];
        } else {
            task = row;
        }
        MessageBox.Clear();
        $("#mdlTaskLabel").text("Editar Tarefa");
        $("#txtTaskId").val(task.Id);
        $("#txtTaskName").val(task.Name);
        $("#txtTaskDescription").val(task.Description);
        $("#txtTaskOrder").val(task.Order);
        $("#ddlTaskStatus option:contains('" + task.StatusName + "')")
            .attr("selected", true);
        $("#btnTaskActionConfirmed").unbind("click");
        $("#btnTaskActionConfirmed").on("click", update);
        $("#mdlTask").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblTasks").bootstrapTable("remove", ids);
        MessageBox.Hide();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Hide();
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divTaskModalMessage" });
    }
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(task) {
        var tasks = [],
            ids = {
                field: "Id",
                values: []
            },
            index;

        if (task !== undefined) {
            tasks[0] = task;
        } else {
            tasks = $("#tblTasks").bootstrapTable("getSelections");
        }

        for (index = 0; index < tasks.length; index += 1) {
            ids.values[index] = tasks[index].Id;
        }
        AjaxUtil.Call("Projects.aspx/DeleteTasksJSON",
                      '{Ids:"' + ids.values.join() + '"}',
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(task) {
        if (task !== undefined) {
            MessageBox.Ask("Remover Tarefa",
                           "Confirma a remoção da tarefa '" + task.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(task); });
        } else {
            MessageBox.Ask("Remover Tarefa",
                           "Confirma a remoção das tarefas seleccionadas ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
    function setupToolbar() {
        var selectedRows = $("#tblTasks").bootstrapTable("getSelections");
        if (selectedRows.length === 0) {
            $("#btnTaskEdit").prop("disabled", true);
            $("#btnTaskRemove").prop("disabled", true);
        } else {
            if (selectedRows.length === 1) {
                $("#btnTaskEdit").prop("disabled", false);
                $("#btnTaskRemove").prop("disabled", false);
            } else {
                $("#btnTaskEdit").prop("disabled", true);
                $("#btnTaskRemove").prop("disabled", false);
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
        $("#txtTaskName").attr("maxlength", "200");
        $("#txtTaskDescription").attr("maxlength", "1000");
        $("#txtTaskOrder").inputmask("9[9]");
    }
    function actionFormatter(value, row, index) {
        return [
            '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
            '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
        ].join('');
    }
    function setupPage() {
        $("#tblTasks")
            .on("check.bs.table", function (e, row) { setupToolbar(); })
            .on("uncheck.bs.table", function (e, row) { setupToolbar(); });
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterTasksLoad() {
        if (sessionStorage.getItem("search_all_selected_obj").toString() !== 'null') {
            var obj,
                index;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            index = TableUtil.getTableIndexById('#tblTasks', obj.Id);
            $("#tblTasks").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.setItem("search_all_selected_obj", null);
        }
    }
    function getTasksCallbackOk(result) {
        $("#tblTasks").bootstrapTable("destroy");
        $("#tblTasks").bootstrapTable({
            data: JSON.parse(result.d)
        });
        setupToolbar();
        afterTasksLoad();
    }
    //function getTasksCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getTasks() {
        var idProject = $("#txtId").val();
        AjaxUtil.Call("Projects.aspx/GetTasksJSON",
                      '{IdProject:' + idProject + '}',
                      getTasksCallbackOk);
    }
    function getTaskStatusesCallbackOk(result) {
        var ddl = $("#ddlTaskStatus");
        $.each(JSON.parse(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getTaskStatusesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getTaskStatuses() {
        AjaxUtil.Call("Projects.aspx/GetTaskStatusesJSON",
                      "",
                      getTaskStatusesCallbackOk);
    }


    /*---   M A I N   ---*/
    function tabLoad() {
        // Tab load safety check
        if (tabHasLoaded) {
            return;
        }
        tabHasLoaded = true;

        setupPage();

        getTaskStatuses();
        getTasks();
    }


    /*---   P U B L I C   ---*/
    return {
        actionFormatter: function (value, row, index) {
            return actionFormatter(value, row, index);
        },
        getTasks: function (idProject) { return getTasks(idProject); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (task) { return showRemoveDialog(task); },
        tabLoad: function () { return tabLoad(); }
    };

}());

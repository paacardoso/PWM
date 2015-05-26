/*jslint browser: true*/
/*global ProjectSessions*/
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
            msg += "O campo 'Descrição' é obrigatório.";
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
            MessageBox.info(msg, { Div: "#divTaskModalMessage" });
            return false;
        }
        MessageBox.clear({ Div: "#divTaskModalMessage" });
        return true;
    }
    function setupToolbar() {
        var selectedRows = $("#tblTasks").bootstrapTable("getSelections");

        $("#btnTaskEdit").prop("disabled", (selectedRows.length === 0) ||
                                           (selectedRows.length > 1));
        $("#btnTaskRemove").prop("disabled", (selectedRows.length === 0));
        $("#btnTaskOrderUp").prop("disabled", (selectedRows.length === 0) ||
                                              (selectedRows.length > 1));
        $("#btnTaskOrderDown").prop("disabled", (selectedRows.length === 0) ||
                                                (selectedRows.length > 1));

        /*if (selectedRows.length === 0) {
            $("#btnTaskEdit").prop("disabled", true);
            $("#btnTaskRemove").prop("disabled", true);
            $("#btnTaskOrderUp").prop("disabled", true);
            $("#btnTaskOrderDown").prop("disabled", true);
        } else {
            if (selectedRows.length === 1) {
                $("#btnTaskEdit").prop("disabled", false);
                $("#btnTaskRemove").prop("disabled", false);
            } else {
                $("#btnTaskEdit").prop("disabled", true);
                $("#btnTaskRemove").prop("disabled", false);
            }
        }*/
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlTask").modal("hide");
        var data = {Id: result.d,
                    Name: $("#txtTaskName").val(),
                    Description: $("#txtTaskDescription").val(),
                    Order: $("#txtTaskOrder").val(),
                    Status: $("#ddlTaskStatus option:selected").text() };
        $("#tblTasks").bootstrapTable('append', data);
        ProjectSessions.invalidate();
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divTaskModalMessage" });
    }
    function insertTask() {
        if (validateInputFields() === true) {
            AjaxUtil.invoke("Projects.aspx/InsertTaskJSON",
                          {Name: $("#txtTaskName").val(),
                           Description: $("#txtTaskDescription").val(),
                           Order: $("#txtTaskOrder").val(),
                           IdProject: $("#txtId").val(),
                           IdStatus: $("#ddlTaskStatus").val()},
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        MessageBox.clear({ Div: "#divTaskModalMessage" });
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
        ProjectSessions.invalidate();
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divTaskModalMessage" });
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.invoke("Projects.aspx/updateTaskJSON",
                          {Id: $("#txtTaskId").val(),
                           Name: $("#txtTaskName").val(),
                           Description: $("#txtTaskDescription").val(),
                           Order: $("#txtTaskOrder").val(),
                           IdProject: $("#txtId").val(),
                           IdStatus: $("#ddlTaskStatus").val()},
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
        MessageBox.clear({ Div: "#divTaskModalMessage" });
        $("#mdlTaskLabel").text("Editar Tarefa");
        $("#txtTaskId").val(task.Id);
        $("#txtTaskName").val(task.Name);
        $("#txtTaskDescription").val(task.Description);
        $("#txtTaskOrder").val(task.Order);
        $("#ddlTaskStatus option:contains('" + task.Status + "')")
            .attr("selected", true);
        $("#btnTaskActionConfirmed").unbind("click");
        $("#btnTaskActionConfirmed").on("click", update);
        $("#mdlTask").modal("show");
    }
    function moveOrderCallbackOk(result) {
        $("#mdlTask").modal("hide");
        console.log("order after: " + $("#txtTaskOrder").val());
        $("#tblTasks").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById("#tblTasks", $("#txtTaskId").val()),
            row: {
                Order: $("#txtTaskOrder").val()
            }
        });
        var data = $("#tblTasks").bootstrapTable("getData");
        //console.log(JSON.stringify(data));
        $("#tblTasks").bootstrapTable("destroy");
        $("#tblTasks").bootstrapTable({
            data: data
        });
    }
    function moveOrderCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divTaskModalMessage" });
    }
    function moveOrder(row, order) {
        var task;
        if (row === undefined) {
            task = $("#tblTasks").bootstrapTable("getSelections")[0];
        } else {
            task = row;
        }
        if ((order === -1) && (task.Order <= 1)) {
            return;
        }
        $("#txtTaskId").val(task.Id);
        $("#txtTaskOrder").val((parseInt(task.Order, 10) + parseInt(order, 10)));
        AjaxUtil.invoke("Projects.aspx/MoveTaskOrderJSON",
                        {Id: task.Id,
                        Order: order},
                        moveOrderCallbackOk,
                        moveOrderCallbackFailed);
    }
    function moveOrderUp(row) {
        moveOrder(row, -1);
    }
    function moveOrderDown(row) {
        moveOrder(row, 1);
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblTasks").bootstrapTable("remove", ids);
        MessageBox.hide();
        setupToolbar();
        ProjectSessions.invalidate();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.hide();
        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divTaskModalMessage" });
    }
    function removeCancelled() {
        MessageBox.hide();
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
        AjaxUtil.invoke("Projects.aspx/DeleteTasksJSON",
                      {Ids: ids.values.join()},
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(task) {
        if (task !== undefined) {
            MessageBox.ask("Remover Tarefa",
                           "Confirma a remoção da tarefa '" + task.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(task); });
        } else {
            MessageBox.ask("Remover Tarefa",
                           "Confirma a remoção das tarefas seleccionadas ?",
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
            },
            "click .up": function (e, value, row, index) {
                moveOrderUp(row);
            },
            "click .down": function (e, value, row, index) {
                moveOrderDown(row);
            }
        };
    }
    function setupForm() {
        $("#txtTaskName").attr("maxlength", "200");
        $("#txtTaskDescription").attr("maxlength", "1000");
        $("#txtTaskOrder").inputmask({ mask: "9[9]",
                                       greedy: false });
    }
    function setupPage() {
        TableUtil.setToolbarBehavior("#tblTasks", setupToolbar);
        setupTable();
        setupForm();
    }
    function actionFormatter(value, row, index) {
        return [
            '<i style="cursor: pointer;"' +
                ' class="edit glyphicon glyphicon-edit"></i>',
            '<i style="cursor: pointer;"' +
                ' class="remove glyphicon glyphicon-remove"></i>',
            '<i style="cursor: pointer;"' +
                ' class="up glyphicon glyphicon-arrow-up"></i>',
            '<i style="cursor: pointer;"' +
                ' class="down glyphicon glyphicon-arrow-down"></i>'
        ].join('');
    }


    /*---   L O A D   ---*/
    function afterTasksLoad() {
        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            var obj,
                index;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            index = TableUtil.getTableIndexById('#tblTasks', obj.Id);
            $("#tblTasks").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.removeItem("search_all_selected_obj");
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
        AjaxUtil.invoke("Projects.aspx/GetTasksJSON",
                      {IdProject: idProject},
                      getTasksCallbackOk);
    }
    function getTaskStatusesCallbackOk(result) {
        var ddl = $("#ddlTaskStatus");
        ddl.empty();
        $.each(JSON.parse(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getTaskStatusesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getTaskStatuses() {
        AjaxUtil.invoke("Projects.aspx/GetTaskStatusesJSON",
                      {},
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
        getTasks: function (idProject) { return getTasks(idProject); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (task) { return showRemoveDialog(task); },
        moveOrderUp: function (row) { return moveOrderUp(row); },
        moveOrderDown: function (row) { return moveOrderDown(row); },
        tabLoad: function () { return tabLoad(); },
        invalidate: function () { tabHasLoaded = false; },
        actionFormatter: function (value, row, index) {
            return actionFormatter(value, row, index);
        }
    };

}());

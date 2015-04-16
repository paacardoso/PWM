var ProjectTasks = (function () {

    var tabHasLoaded = false,
        tabMode = '';

    /*---   A F T E R   L O A D   ---*/
    function validateInputFields() {
        var msg = '';
        if ($('#txtTaskName').val() === '') {
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($('#txtTaskDescription').val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($('#txtTaskOrder').val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Ordem' é obrigatório.";
        }
        if ($("#ddlTaskStatus option:selected").val() === undefined) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Estado' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.Info(msg);
            return false;
        }
        MessageBox.Clear();
        return true;
    }
    function setupToolbar(mode) {
        tabMode = mode;
        switch (tabMode) {
        case '':
            $('#btnTaskNew').show();
            $('#btnTaskSave').hide();
            $('#btnTaskRemove').hide();
            $('#btnTaskCancel').hide();
            break;
        case 'new':
            $('#btnTaskNew').hide();
            $('#btnTaskSave').show();
            $('#btnTaskRemove').hide();
            $('#btnTaskCancel').show();
            break;
        case 'edit':
            $('#btnTaskNew').show();
            $('#btnTaskSave').show();
            $('#btnTaskRemove').show();
            $('#btnTaskCancel').hide();
            break;
        default:
        }
    }
    function clearForm() {
        // TODO
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        // TODO
        setupToolbar('edit');
    }
    function insertCallbackFailed(msg) {
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function insertTask() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/InsertTaskJSON",
                          "{'Name':'" + $('#txtTaskName').val() + "', " +
                          "'Description':'" + $('#txtDescription').val() + "', " +
                          "'Order':" + $('#txtTaskorder').val() + ", " +
                          "'IdStatus':" + $('#ddlStatus').val() + "}",
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        // TODO
        setupToolbar('edit');
    }
    function updateCallbackFailed(msg) {
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/updateJSON",
                          "{'Id':'" + $('#txtTaskId').val() + "', " +
                          "'Name':'" + $('#txtTaskName').val() + "', " +
                          "'Description':'" + $('#txtTaskDescription').val() + "', " +
                          "'Order:'" + $('#txtTaskOrder').val() + ", " +
                          "'IdStatus':" + $('#ddlTaskStatus').val() + "}",
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var param;
        if (row === undefined) {
            param = $('#tblTasks').bootstrapTable('getSelections')[0];
        } else {
            param = row;
        }
        MessageBox.Clear();
        $('#mdlLabel').text('Editar Tarefa');
        $("#txtTaskId").val(param.Id);
        $("#txtName").val(param.Name);
        $("#txtDescription").val(param.Description);
        $("#txtOrder").val(param.Order);
        $("#ddlTaskStatus option:contains('" + param.StatusName + "')")
            .attr('selected', true);
        $('#btnActionConfirmed').unbind('click');
        $('#btnActionConfirmed').on('click', update);
        $('#mdlTask').modal('show');
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, id) {
        // TODO
        MessageBox.Hide();
        clearForm();
        setupToolbar('');
    }
    function removeCallbackFailed(msg) {
        MessageBox.Hide();
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(id) {
        AjaxUtil.Call("Projects.aspx/DeleteTaskJSON",
                      "{'Id':" + id + "}",
                      function (result) { removeCallbackOk(result, id); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(param) {
        if (param !== undefined) {
            MessageBox.Ask('Remover Tarefa',
                           "Confirma a remoção da tarefa '" + param.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(param); });
        } else {
            MessageBox.Ask('Remover Tarefa',
                           "Confirma a remoção das tarefas seleccionadas ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
    function setupForm() {
        // TODO
    }
    function actionFormatter(value, row, index) {
        return [
            '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
            '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
        ].join('');
    }
    function setupPage() {
        setupToolbar('');
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterTasksLoad() {
        var id, index;
        if (sessionStorage.getItem('search_all_selected_id') !== null) {
            id = sessionStorage.getItem('search_all_selected_id');

            index = TableUtil.getTableIndexById('#tblTasks', id);
            $('#tblTasks').bootstrapTable('check', index);
            showEditDialog();

            sessionStorage.setItem('search_all_selected_id', null);
        }
    }
    function getTasksCallbackOk(result) {
        //alert('b');
        $('#tblTasks').bootstrapTable('destroy');
        $('#tblTasks').bootstrapTable({
            data: jQuery.parseJSON(result.d)
        });
        afterTasksLoad();
    }
    //function getTasksCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getProjectTasks(idProject) {
        //alert('idProject: ' + idProject);
        AjaxUtil.Call("Projects.aspx/GetTasksJSON",
                      "{'IdProject':" + idProject + "}",
                      getTasksCallbackOk);
    }


    /*---   M A I N   ---*/
    function tabLoad() {
        // Tab load safety check
        if (tabHasLoaded) {
            return;
        }
        tabHasLoaded = true;

        setupPage();
        getProjectTasks($("#txtId").val());
    }
    function newTask() {
        clearForm();
        setupToolbar('new');
    }
    function saveTask() {
        if (tabMode === 'new') {
            insertTask();
        } else if (tabMode === 'edit') {
            update();
        }
    }
    function removeTask() {
        showRemoveDialog();
    }
    function cancelNewTask() {
        setupToolbar('');
    }


    /*---   P U B L I C   ---*/
    return {
        actionFormatter: function (value, row, index) {
            return actionFormatter(value, row, index);
        },
        getProjectTasks: function (idProject) { return getProjectTasks(idProject); },
        newTask: function () { return newTask(); },
        saveTask: function () { return saveTask(); },
        removeTask: function () { return removeTask(); },
        cancelNewTask: function () { return cancelNewTask(); },
        tabLoad: function () { return tabLoad(); }
    };

}());

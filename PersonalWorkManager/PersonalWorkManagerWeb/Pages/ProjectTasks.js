var tabTasksHasLoaded = false;
var tabTasksMode = '';

function tabTasksLoad() {
    // Page load safety check
    if (tabTasksHasLoaded) {
        return;
    }
    tabTasksHasLoaded = true;

    setupTasksPage();
    getTasks($("#txtId").val());
}
function afterTasksLoad() {
    if (sessionStorage.getItem('search_all_selected_id') != null) {
        var id = sessionStorage.getItem('search_all_selected_id')

        // TODO

        sessionStorage.setItem('search_all_selected_id', null)
    }
}


////////////////   S E T U P   //////////////////
function setupTasksPage() {
    setupTasksToolbar('');
    setupTasksForm();
}
function setupTasksForm() {
    // TODO
}
function setupTasksToolbar(mode) {
    tabTasksMode = mode;
    switch (tabTasksMode) {
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
function clearTasksForm() {
    // TODO
}

////////////////   L O A D   //////////////////
function getTasks(idProject) {
    //alert('idProject: ' + idProject);
    ajaxCall("Projects.aspx/GetTasksJSON",
             "{'IdProject':" + idProject + "}",
             getTasksCallbackOk);
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


////////////////   M A I N   F U N C T I O N S   //////////////////
function newTask() {
    clearTasksForm();
    setupTasksToolbar('new');
}
function saveTask() {
    if (tabTasksMode === 'new') {
        insertTask();
    } else if (tabTasksMode === 'edit') {
        updateTask();
    }
}
function removeTask() {
    showTaskRemoveDialog();
}
function cancelNewTask() {
    setupTasksToolbar('');
}

///////////   V A L I D A T I O N   ///////////
function validateTaskInputFields() {
    var msg = '';
    if ($('#txtTaskName').val() == '')
        msg += "O campo 'Nome' é obrigatório."
    if ($('#txtTaskDescription').val() == '') {
        if (msg.length > 0) msg += "<br>";
        msg += "O campo 'Nome' é obrigatório."
    }
    if ($('#txtTaskOrder').val() == '') {
        if (msg.length > 0) msg += "<br>";
        msg += "O campo 'Ordem' é obrigatório."
    }
    if ($("#ddlTaskStatus option:selected").val() === undefined) {
        if (msg.length > 0) msg += "<br>";
        msg += "O campo 'Estado' é obrigatório."
    }
    if (msg.length > 0) {
        MessageBox.Info(msg);
        return false;
    }
    else {
        MessageBox.Clear();
        return true;
    }
}


//////////////////   A D D   //////////////////
function insertTask() {
    if (validateTaskInputFields() === true) {
        ajaxCall("Projects.aspx/InsertTaskJSON",
                 "{'Name':'" + $('#txtTaskName').val() + "', " +
                  "'Description':'" + $('#txtDescription').val() + "', " +
                  "'Order':" + $('#txtTaskorder').val() + ", " +
                  "'IdStatus':" + $('#ddlStatus').val() + "}",
                 insertTaskCallbackOk,
                 insertTaskCallbackFailed);
    }
}
function insertTaskCallbackOk(result) {
    // TODO
    setupTaskToolbar('edit');
}
function insertTaskCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}


//////////////////   E D I T   //////////////////
function updateTask() {
    if (validateInoutFields() === true) {
        ajaxCall("Projects.aspx/UpdateTaskJSON",
                 "{'Id':'" + $('#txtTaskId').val() + "', " +
                  "'Name':'" + $('#txtTaskName').val() + "', " +
                  "'Description':'" + $('#txtTaskDescription').val() + "', " +
                  "'Order:'" + $('#txtTaskOrder').val() + ", " +
                  "'IdStatus':" + $('#ddlTaskStatus').val() + "}",
                 updateTaskCallbackOk,
                 updateTaskCallbackFailed);
    }
}
function updateTaskCallbackOk(result) {
    // TODO
    setupTaskToolbar('edit');
}
function updateTaskCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}


//////////////////   R E M O V E   //////////////////
function showTaskRemoveDialog() {
    // TODO
    //MessageBox.Ask('Remover Tarefa', "Confirma a remoção da tarefa '" + proj.text() + "' ?", removeCancelled, function () { removeConfirmed(selectize.getValue()); });
}
function removeTaskCancelled() {
    MessageBox.Hide();
}
function removeTaskConfirmed(id) {
    ajaxCall("Projects.aspx/DeleteTaskJSON",
             "{'Id':" + id + "}",
             function (result) { removeTaskCallbackOk(result, id); },
             removeTaskCallbackFailed);
}
function removeTaskCallbackOk(result, id) {
    // TODO
    MessageBox.Hide();
    clearTaskForm();
    setupTaskToolbar('');
}
function removeTaskCallbackFailed(msg) {
    MessageBox.Hide();
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}

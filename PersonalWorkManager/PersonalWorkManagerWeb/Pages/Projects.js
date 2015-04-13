var pageHasLoaded = false;
var tabProjectMode = '';

$(function () {
    pageLoad();
});

function pageLoad() {
    // Page load safety check
    if (pageHasLoaded) {
        return;
    }
    pageHasLoaded = true;

    switchTab('project');
    setupPage();
    getProjects();
}
function afterProjectsLoad() {
    if (sessionStorage.getItem('search_all_selected_id') != null) {
        var id = sessionStorage.getItem('search_all_selected_id')

        var ddl = $("#ddlProject");
        var selectize = ddl[0].selectize;
        var proj = selectize.getItem(selectize.setValue(id, false));

        sessionStorage.setItem('search_all_selected_id', null)
    }
}

////////////////   M A I N   S E T U P   //////////////////
function switchTab(tab) {
    switch (tab) {
        case 'project':
            $('#tlbProject').show();
            $('#tlbTasks').hide();
            $('#tlbAlerts').hide();
            $('#tlbNotes').hide();
            $('#tlbSessions').hide();
            break;
        case 'tasks':
            $('#tlbProject').hide();
            $('#tlbTasks').show();
            $('#tlbAlerts').hide();
            $('#tlbNotes').hide();
            $('#tlbSessions').hide();
            tabTasksLoad();  // <-- ProjectTaks.js
            break;

        default:

    }
}


////////////////   S E T U P   //////////////////
function setupPage() {
    setupToolbar('');
    setupForm();
}
function setupForm() {
    $('#ddlProject').selectize({
        create: false,
        valueField: 'Id',
        labelField: 'Name',
        searchField: ['Code', 'Name', 'Description'],
        sortField: {
            field: 'Name',
            direction: 'asc'
        },
        render: {
            option: function (item, escape) {
                //alert(JSON.stringify(item));
                //alert(item.Description.length);
                var top_description = (item.Description.length > 300 ? item.Description.substring(0, 300) + ' (...)' : item.Description);
                return '<div>' +
                         '<span>' +
                           '<span style="float: left; width: 120px; font-style: bold; text-align: right;">' + escape(item.Code) + '&nbsp;</span>' +
                           '<span style="font-size: 130%;">&nbsp;' + escape(item.Name) + '</span>' +
                         '</span>' +
                         '<br>' +
                         '<span>' +
                           '<span style="float: left; width: 120px; text-align: right;"><strong>&nbsp;</strong></span>' +
                           '<span style="font-style: italic">&nbsp;' + escape(top_description) + '</span>' +
                         '</span>' +
                       '</div>';
            }
        },
        onChange: function (value) { getProject(value); },
        dropdownParent: 'body'
    });
    $("#txtName").attr('maxlength', '200');
    $("#txtDescription").attr('maxlength', '1000');
    $("#txtStartDate").datetimepicker({
        format: "DD-MM-YYYY"
    });
    $("#txtEndDate").datetimepicker({
        format: "DD-MM-YYYY"
    });
    $("#txtStartDate").on("dp.change", function (e) {
        $('#txtEndDate').data("DateTimePicker").minDate(e.date);
    });
    $("#txtEndDate").on("dp.change", function (e) {
        $('#txtStartDate').data("DateTimePicker").maxDate(e.date);
    });
    getProjectStatuses();
}
function setupToolbar(mode) {
    tabProjectMode = mode;
    switch (tabProjectMode) {
        case '':
            $('#btnProjectNew').show();
            $('#btnProjectSave').hide();
            $('#btnProjectRemove').hide();
            $('#btnProjectCancel').hide();
            break;
        case 'new':
            $('#btnProjectNew').hide();
            $('#btnProjectSave').show();
            $('#btnProjectRemove').hide();
            $('#btnProjectCancel').show();
            break;
        case 'edit':
            $('#btnProjectNew').show();
            $('#btnProjectSave').show();
            $('#btnProjectRemove').show();
            $('#btnProjectCancel').hide();
            break;
        default:
    }
}
function clearForm() {
    $("#txtId").val('');
    $("#txtCode").val('');
    $("#txtName").val('');
    $("#txtDescription").val('');
    $('#txtStartDate').datetimepicker().children('input').val('');
    $("#txtEndDate").datetimepicker().children('input').val('');
    $("#ddlStatus").val(-1);
}

////////////////   L O A D   //////////////////
function getProjects() {
    ajaxCall("Projects.aspx/GetProjectsJSON",
             "",
             getProjectsCallbackOk);
}
function getProjectsCallbackOk(result) {
    var ddl = $("#ddlProject");
    var selectize = ddl[0].selectize;
    $.each(eval(result.d), function () {
        //alert('a' + JSON.stringify(this));
        selectize.addOption({ Id: this.Id, Code: this.Code, Name: this.Name, Description: this.Description });
    });
    selectize.clear(true);
    afterProjectsLoad();
}
//function getProjectsCallbackFailed() {
// handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
//}
function getProjectStatuses() {
    ajaxCall("Projects.aspx/GetProjectStatusesJSON",
             "",
             getProjectStatusesCallbackOk);
}
function getProjectStatusesCallbackOk(result) {
    var ddl = $("#ddlStatus");
    $.each(eval(result.d), function () {
        ddl.append($("<option />").val(this.Id).text(this.Name));
    });
}
//function getProjectStatusesCallbackFailed() {
// handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
//}
function getProject(id) {
    if (id !== '')
        ajaxCall("Projects.aspx/GetProjectJSON",
                 "{'Id':'" + id + "'}",
                 getProjectCallbackOk);
}
function getProjectCallbackOk(result) {
    var proj = JSON.parse(result.d)[0];
    $("#txtId").val(proj.Id);
    $("#txtCode").val(proj.Code);
    $("#txtName").val(proj.Name);
    $("#txtDescription").val(proj.Description);
    $('#txtStartDate').datetimepicker().children('input').val(DateUtil.Format(proj.StartDate));
    $("#txtEndDate").datetimepicker().children('input').val(DateUtil.Format(proj.EndDate));
    $("#ddlStatus").val(proj.IdStatus);
    setupToolbar('edit');
}
//function getProjectCallbackFailed() {
// handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
//}


////////////////   M A I N   F U N C T I O N S   //////////////////
function newProject() {
    $("#ddlProject")[0].selectize.clear(true);
    clearForm();
    setupToolbar('new');
}
function saveProject() {
    if (tabProjectMode === 'new') {
        insert();
    } else if (tabProjectMode === 'edit') {
        update();
    }
}
function removeProject() {
    showRemoveDialog();
}
function cancelNewProject() {
    setupToolbar('');
}

///////////   V A L I D A T I O N   ///////////
function validateRequired() {
    var msg = '';
    if ($('#txtCode').val() == '')
        msg += "O campo 'Código' é obrigatório."
    if ($('#txtName').val() == '') {
        if (msg.length > 0) msg += "<br>";
        msg += "O campo 'Nome' é obrigatório."
    }
    if ($('#txtStartDate').datetimepicker().children('input').val() == '') {
        if (msg.length > 0) msg += "<br>";
        msg += "O campo 'Data Inicial' é obrigatório."
    }
    if ($("#ddlStatus option:selected").val() === undefined) {
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
function insert() {
    if (validateRequired() === true) {
        ajaxCall("Projects.aspx/InsertProjectJSON",
                 "{'Code':'" + $('#txtCode').val() + "', " +
                  "'Name':'" + $('#txtName').val() + "', " +
                  "'Description':'" + $('#txtDescription').val() + "', " +
                  "'StartDate':'" + $('#txtStartDate').datetimepicker().children('input').val() + "', " +
                  "'EndDate':'" + $('#txtEndDate').datetimepicker().children('input').val() + "', " +
                  "'IdStatus':" + $('#ddlStatus').val() + "}",
                 insertCallbackOk,
                 insertCallbackFailed);
    }
}
function insertCallbackOk(result) {
    $("#ddlProject")[0].selectize.addOption({ value: result.d, code: $('#txtCode').val(), text: $('#txtName').val(), description: $('#txtDescription').val() });
    setupToolbar('edit');
}
function insertCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}


//////////////////   E D I T   //////////////////
function update() {
    if (validateRequired() === true) {
        ajaxCall("Projects.aspx/UpdateProjectJSON",
                 "{'Id':'" + $('#txtId').val() + "', " +
                  "'Code':'" + $('#txtCode').val() + "', " +
                  "'Name':'" + $('#txtName').val() + "', " +
                  "'Description':'" + $('#txtDescription').val() + "', " +
                  "'StartDate':'" + $('#txtStartDate').datetimepicker().children('input').val() + "', " +
                  "'EndDate':'" + $('#txtEndDate').datetimepicker().children('input').val() + "', " +
                  "'IdStatus':" + $('#ddlStatus').val() + "}",
                 updateCallbackOk,
                 updateCallbackFailed);
    }
}
function updateCallbackOk(result) {
    $("#ddlProject")[0].selectize.updateOption($('#txtId').val(),
                                                { value: $('#txtId').val(),
                                                  code: $('#txtCode').val(),
                                                  text: $('#txtName').val(),
                                                  description: $('#txtDescription').val() 
                                                });
    setupToolbar('edit');
}
function updateCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}


//////////////////   R E M O V E   //////////////////
function showRemoveDialog() {
    var ddl = $("#ddlProject");
    var selectize = ddl[0].selectize;
    var proj = selectize.getItem(selectize.getValue());
    MessageBox.Ask('Remover Projecto', "Confirma a remoção do projecto '" + proj.text() + "' ?", removeCancelled, function () { removeConfirmed(selectize.getValue()); });
}
function removeCancelled() {
    MessageBox.Hide();
}
function removeConfirmed(id) {
    ajaxCall("Projects.aspx/DeleteProjectJSON",
             "{'Id':" + id + "}",
             function (result) { removeCallbackOk(result, id); },
             removeCallbackFailed);
}
function removeCallbackOk(result, id) {
    $("#ddlProject")[0].selectize.clear(true);
    $("#ddlProject")[0].selectize.removeOption(id);
    MessageBox.Hide();
    clearForm();
    setupToolbar('');
}
function removeCallbackFailed(msg) {
    MessageBox.Hide();
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}

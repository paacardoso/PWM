var pageHasLoaded = false;

$(function () {
    pageLoad();
});

function pageLoad() {
    // Page load safety check
    if (pageHasLoaded) {
        return;
    }
    pageHasLoaded = true;

    setupPage();
    getStatuses();
}
function afterTableLoad() {
    if (sessionStorage.getItem('search_all_selected_id') != null) {
        var id = sessionStorage.getItem('search_all_selected_id')
        var index = getTableIndexById('#tblStatuses', id);
        $('#tblStatuses').bootstrapTable('check', index);
        showEditDialog();
        sessionStorage.setItem('search_all_selected_id', null)
    }
}


////////////////   S E T U P   //////////////////
function setupPage() {
    $('#tblStatuses')
    .on('check.bs.table', function (e, row) {
        setupToolbar();
    })
    .on('uncheck.bs.table', function (e, row) {
        setupToolbar();
    });
    setupTable();
    setupForm();
}
function setupToolbar() {
    var selectedRows = $('#tblStatuses').bootstrapTable('getSelections');
    if (selectedRows.length === 0) {
        $('#btnEdit').prop('disabled', true);
        $('#btnRemove').prop('disabled', true);
    } else {
        if (selectedRows.length === 1) {
            $('#btnEdit').prop('disabled', false);
            $('#btnRemove').prop('disabled', false);
        } else {
            $('#btnEdit').prop('disabled', true);
            $('#btnRemove').prop('disabled', false);
        }
    }
}
function setupTable() {
    window.actionEvents = {
        'click .edit': function (e, value, row, index) {
            showEditDialog(row);
        },
        'click .remove': function (e, value, row, index) {
            showRemoveDialog(row);
        }
    };
}
function setupForm() {
    $("#txtName").attr('maxlength', '200');
    $("#txtDescription").attr('maxlength', '1000');
    $('#txtOrder').inputmask('9[9]');
    getStatusStatusTypes();
}
function actionFormatter(value, row, index) {
    return [
        '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
        '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
    ].join('');
}


////////////////   L O A D   //////////////////
function getStatuses() {
    ajaxCall("Statuses.aspx/GetStatusesJSON",
             "",
             getStatusesCallbackOk);
}
function getStatusesCallbackOk(result) {
    $('#tblStatuses').bootstrapTable('destroy');
    $('#tblStatuses').bootstrapTable({
        data: eval(result.d)
    });
    setupToolbar();
    afterTableLoad();
}
//function getStatusesCallbackFailed() {
// handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
//}
function getStatusStatusTypes() {
    ajaxCall("Statuses.aspx/GetStatusStatusTypesJSON",
             "",
             getStatusStatusTypesCallbackOk);
}
function getStatusStatusTypesCallbackOk(result) {
    var ddl = $("#ddlStatusType");
    $.each(eval(result.d), function () {
        ddl.append($("<option />").val(this.Id).text(this.Name));
    });
}
//function getStatusStatusTypesCallbackFailed() {
// handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
//}


/////////   V A L I D A T I O N   ///////////
function validateRequired() {
    var msg = '';
    if ($('#txtName').val() == '')
        msg += "O campo 'Nome' é obrigatório."
    if ($('#ddlStatusType').val() == -1) {
        if (msg.length > 0) msg += "<br>";
        msg += "O campo 'Tipo de Estado' é obrigatório."
    }
    if ($('#txtOrder').val() == '') {
        if (msg.length > 0) msg += "<br>";
        msg += "O campo 'Ordem' é obrigatório."
    }
    if (msg.length > 0) {
        MessageBox.Info(msg);
        return false;
    }
    else
        return true;
}


////////////////   A D D   //////////////////
function showAddDialog() {
    $('#mdlLabel').text('Adicionar Novo Estado');
    MessageBox.Clear();
    $('#txtId').val('');
    $('#txtName').val('');
    $('#txtDescription').val('');
    $('#ddlStatusType').val('');
    $('#txtOrder').val('');
    $('#btnActionConfirmed').unbind('click');
    $('#btnActionConfirmed').on('click', insert);
    $('#mdlStatus').on('shown.bs.modal', function () { $('#txtName').focus(); });
    $('#mdlStatus').modal('show');
}
function insert() {
    if (validateRequired() === true) {
        ajaxCall("Statuses.aspx/InsertStatusJSON",
                 "{'Name':'" + $('#txtName').val() + "', " +
                  "'Description':'" + $('#txtDescription').val() + "', " + 
                  "'IdStatusType':" + $('#ddlStatusType').val() + ", " +
                  "'Order':" + $('#txtOrder').val() + "}",
                 insertCallbackOk,
                 insertCallbackFailed);
    }
}
function insertCallbackOk(result) {
    $('#mdlStatus').modal('hide');
    var data = "[{'Id':" + result.d + ", " +
                  "'Name':'" + $('#txtName').val() + "', " +
                  "'Description':'" + $('#txtDescription').val() + "', " +
                  "'StatusTypeName':'" + $('#ddlStatusType option:selected').text() + "', " +
                  "'Order':" + $('#txtOrder').val() + "}]";
    $('#tblStatuses').bootstrapTable('append', eval(data));
}
function insertCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}


////////////////   E D I T   //////////////////
function showEditDialog(row) {
    var param;
    if (typeof row == 'undefined')
        param = $('#tblStatuses').bootstrapTable('getSelections')[0];
    else
        param = row;
    MessageBox.Clear();
    $('#mdlLabel').text('Editar Estado');
    $("#txtId").val(param.Id);
    $("#txtName").val(param.Name);
    $("#txtDescription").val(param.Description);
    //$("#ddlStatusType").val(param.IdStatusType);
    $("#ddlStatusType option:contains('" + param.StatusTypeName + "')").attr('selected', true);
    $("#txtOrder").val(param.Order);
    $('#btnActionConfirmed').unbind('click');
    $('#btnActionConfirmed').on('click', update);
    $('#mdlStatus').modal('show');
}
function update() {
    if (validateRequired() === true) {
        ajaxCall("Statuses.aspx/UpdateStatusJSON",
                  "{'Id':'" + $('#txtId').val() + "', " +
                   "'Name':'" + $('#txtName').val() + "', " +
                   "'Description':'" + $('#txtDescription').val() + "', " +
                   "'IdStatusType':" + $('#ddlStatusType').val() + ", " +
                   "'Order':" + $('#txtOrder').val() + "}",
                  updateCallbackOk,
                  updateCallbackFailed);
    }
}
function updateCallbackOk(result) {
    $('#mdlStatus').modal('hide');
    $('#tblStatuses').bootstrapTable('updateRow', {
        index: getTableIndexById('#tblStatuses', $("#txtId").val()),
        row: {
            Id: $("#txtId").val(),
            Name: $('#txtName').val(),
            Description: $('#txtDescription').val(),
            StatusTypeName: $('#ddlStatusType option:selected').text(),
            Order: $('#txtOrder').val()
        }
    });
}
function updateCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}


////////////////   R E M O V E   //////////////////
function showRemoveDialog(param) {
    if (typeof param != 'undefined')
        MessageBox.Ask('Remover Estado', "Confirma a remoção do Estado '" + param.Name + "' ?", removeCancelled, function () { removeConfirmed(param); });
    else
        MessageBox.Ask('Remover Estado', "Confirma a remoção dos Statuses seleccionados ?", removeCancelled, function () { removeConfirmed(undefined); });
}
function removeCancelled() {
    MessageBox.Hide();
}
function removeConfirmed(param) {
    var params = [];
    if (param !== undefined) {
        params[0] = param;
    }
    else {
        params = $('#tblStatuses').bootstrapTable('getSelections');
    }

    var ids = {
        field: 'Id',
        values: new Array()
    };

    for (var index = 0; index < params.length; ++index) {
        ids.values[index] = params[index].Id;
    }

    ajaxCall("Statuses.aspx/DeleteStatusesJSON",
             "{'Ids':'" + ids.values.join() + "'}",
             function (result) { removeCallbackOk(result, ids); },
             removeCallbackFailed);

}
function removeCallbackOk(result, ids) {
    $('#tblStatuses').bootstrapTable('remove', eval(ids));
    MessageBox.Hide();
}
function removeCallbackFailed(msg) {
    MessageBox.Hide();
    var ex = jQuery.parseJSON(msg.responseText);
    MessageBox.Exception(ex.Message, ex.StackTrace);
}

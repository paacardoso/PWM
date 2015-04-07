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
    getParameters();
}
function afterTableLoad() {
    if (sessionStorage.getItem('search_all_selected_id') != null) {
        var id = sessionStorage.getItem('search_all_selected_id')
        var index = getTableIndexById('#tblParameters', id);
        $('#tblParameters').bootstrapTable('check', index);
        showEditDialog();
        sessionStorage.setItem('search_all_selected_id', null)
    }
}


////////////////   S E T U P   //////////////////
function setupPage() {
    $('#tblParameters')
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
    var selectedRows = $('#tblParameters').bootstrapTable('getSelections');
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
    $("#txtValue").attr('maxlength', '2000');
    $("#txtDescription").attr('maxlength', '1000');
}
function actionFormatter(value, row, index) {
    return [
        '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
        '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
    ].join('');
}


////////////////   L O A D   //////////////////
function getParameters() {
    ajaxCall("Parameters.aspx/GetParametersJSON",
             "",
             getParametersCallbackOk);
}
function getParametersCallbackOk(result) {
    $('#tblParameters').bootstrapTable('destroy');
    $('#tblParameters').bootstrapTable({
        data: eval(result.d)
    });
    setupToolbar();
    afterTableLoad();
}
//function getParametersCallbackFailed() {
// handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
//}


/////////   V A L I D A T I O N   ///////////
function validateRequired() {
    var msg = '';
    if ($('#txtName').val() == '')
        msg += "O campo 'Name' é obrigatório."
    if (msg.length > 0) {
        ModalMessage.Info(msg);
        return false;
    }
    else
        return true;
}


////////////////   A D D   //////////////////
function showAddDialog() {
    $('#mdlLabel').text('Adicionar Novo Parâmetro');
    ModalMessage.Clear();
    $('#txtId').val('');
    $('#txtName').val('');
    $('#txtValue').val('');
    $('#txtDescription').val('');
    $('#btnActionConfirmed').unbind('click');
    $('#btnActionConfirmed').on('click', insert);
    $('#mdlParameter').on('shown.bs.modal', function () { $('#txtName').focus(); });
    $('#mdlParameter').modal('show');
}
function insert() {
    if (validateRequired() === true) {
        ajaxCall("Parameters.aspx/InsertParameterJSON",
                 "{'Name':'" + $('#txtName').val() + "', " +
                  "'Value':'" + $('#txtValue').val() + "', " +
                  "'Description':'" + $('#txtDescription').val() + "'}",
                 insertCallbackOk,
                 insertCallbackFailed);
    }
}
function insertCallbackOk(result) {
    $('#mdlParameter').modal('hide');
    var data = "[{'Id':" + result.d + ", 'Name':'" + $('#txtName').val() + "', " +
                 "'Value':'" + $('#txtValue').val() + "', " +
                 "'Description':'" + $('#txtDescription').val() + "'}]";
    $('#tblParameters').bootstrapTable('append', eval(data));
}
function insertCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    ModalMessage.Exception(ex.Message, ex.StackTrace);
}


////////////////   E D I T   //////////////////
function showEditDialog(row) {
    var param;
    if (typeof row == 'undefined')
        param = $('#tblParameters').bootstrapTable('getSelections')[0];
    else
        param = row;
    ModalMessage.Clear();
    $('#mdlLabel').text('Editar Parâmetro');
    $("#txtId").val(param.Id);
    $("#txtName").val(param.Name);
    $("#txtValue").val(param.Value);
    $("#txtDescription").val(param.Value);
    $('#btnActionConfirmed').unbind('click');
    $('#btnActionConfirmed').on('click', update);
    $('#mdlParameter').modal('show');
}
function update() {
    if (validateRequired() === true) {
        ajaxCall("Parameters.aspx/UpdateParameterJSON",
                  "{'Id':'" + $('#txtId').val() + "', " +
                   "'Name':'" + $('#txtName').val() + "', " +
                   "'Value':'" + $('#txtValue').val() + "', " +
                   "'Description':'" + $('#txtDescription').val() + "'}",
                  updateCallbackOk,
                  updateCallbackFailed);
    }
}
function updateCallbackOk(result) {
    $('#mdlParameter').modal('hide');
    $('#tblParameters').bootstrapTable('updateRow', {
        index: getTableIndexById('#tblParameters', $("#txtId").val()),
        row: {
            Id: $("#txtId").val(),
            Name: $('#txtName').val(),
            Value: $('#txtValue').val(),
            Description: $('#txtDescription').val()
        }
    });
}
function updateCallbackFailed(msg) {
    var ex = jQuery.parseJSON(msg.responseText);
    ModalMessage.Exception(ex.Message, ex.StackTrace);
}


////////////////   R E M O V E   //////////////////
function showRemoveDialog(param) {
    if (typeof param != 'undefined')
        MsgBox.Ask('Remover Parâmetro', "Confirma a remoção do parâmetro '" + param.Name + "' ?", removeCancelled, function () { removeConfirmed(param); });
    else
        MsgBox.Ask('Remover Parâmetro', "Confirma a remoção dos parâmetros seleccionados ?", removeCancelled, function () { removeConfirmed(undefined); });
}
function removeCancelled() {
    MsgBox.Hide();
}
function removeConfirmed(param) {
    var params = [];
    if (param !== undefined) {
        params[0] = param;
    }
    else {
        params = $('#tblParameters').bootstrapTable('getSelections');
    }

    var ids = {
        field: 'Id',
        values: new Array()
    };

    for (var index = 0; index < params.length; ++index) {
        ids.values[index] = params[index].Id;
    }

    ajaxCall("Parameters.aspx/DeleteParametersJSON",
             "{'Ids':'" + ids.values.join() + "'}",
             function (result) { removeCallbackOk(result, ids); },
             removeCallbackFailed);

}
function removeCallbackOk(result, ids) {
    $('#tblParameters').bootstrapTable('remove', eval(ids));
    MsgBox.Hide();
}
function removeCallbackFailed(msg) {
    MsgBox.Hide();
    var ex = jQuery.parseJSON(msg.responseText);
    MainMessage.Exception(ex.Message, ex.StackTrace);
}

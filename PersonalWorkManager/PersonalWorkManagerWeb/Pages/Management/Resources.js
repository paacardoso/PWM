var Resources = (function () {

    var pageHasLoaded = false;


    /*---   V A L I D A T I O N   ---*/
    function validateRequired() {
        var msg = '';
        if ($('#txtLogin').val() === '') {
            msg += "O campo 'Login' é obrigatório.";
        }
        if ($('#txtName').val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($("#ddlStatus option:selected").val() === undefined) {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Estado' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.Info(msg);
            return false;
        }
        return true;
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $('#mdlResource').modal('hide');
        var data = "[{'Id':" + result.d + ", " +
                    "'Login':'" + $('#txtLogin').val() + "', " +
                    "'Name':'" + $('#txtName').val() + "', " +
                    "'Status':'" + $('#ddlStatus option:selected').text() + "'}]";
        $('#tblResources').bootstrapTable('append', jQuery.parseJSON(data));
    }
    function insertCallbackFailed(msg) {
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function insert() {
        if (validateRequired() === true) {
            ajaxCall("Resources.aspx/InsertResourceJSON",
                    "{'Login':'" + $('#txtLogin').val() + "', " +
                    "'Name':'" + $('#txtName').val() + "', " +
                    "'Password':'" + $('#txtPassword').val() + "', " +
                    "'IdStatus':" + $('#ddlStatus').val() + "}",
                    insertCallbackOk,
                    insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $('#mdlLabel').text('Adicionar Novo Recurso');
        MessageBox.Clear();
        $('#txtId').val('');
        $('#txtLogin').val('');
        $('#txtName').val('');
        $('#ddlStatus').val('');
        $('#btnActionConfirmed').unbind('click');
        $('#btnActionConfirmed').on('click', insert);
        $('#mdlResource').on('shown.bs.modal', function () { $('#txtLogin').focus(); });
        $('#mdlResource').modal('show');
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $('#mdlResource').modal('hide');
        $('#tblResources').bootstrapTable('updateRow', {
            index: getTableIndexById('#tblResources', $("#txtId").val()),
            row: {
                Id: $("#txtId").val(),
                Login: $('#txtLogin').val(),
                Name: $('#txtName').val(),
                Status: $('#ddlStatus option:selected').text()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function update() {
        if (validateRequired() === true) {
            ajaxCall("Resources.aspx/UpdateResourceJSON",
                    "{'Id':'" + $('#txtId').val() + "', " +
                    "'Login':'" + $('#txtLogin').val() + "', " +
                    "'Name':'" + $('#txtName').val() + "', " +
                    "'Password':'" + $('#txtPassword').val() + "', " +
                    "'IdStatus':" + $('#ddlStatus').val() + "}",
                    updateCallbackOk,
                    updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var param;
        if (row === undefined) {
            param = $('#tblResources').bootstrapTable('getSelections')[0];
        } else {
            param = row;
        }
        MessageBox.Clear();
        $('#mdlLabel').text('Editar Recurso');
        $("#txtId").val(param.Id);
        $("#txtLogin").val(param.Login);
        $("#txtName").val(param.Name);
        //$("#txtPassword").val(param.Password);
        $("#ddlStatus option:contains('" + param.StatusName + "')").attr('selected', true);
        $('#btnActionConfirmed').unbind('click');
        $('#btnActionConfirmed').on('click', update);
        $('#mdlResource').modal('show');
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $('#tblResources').bootstrapTable('remove', jQuery.parseJSON(ids));
        MessageBox.Hide();
    }
    function removeCallbackFailed(msg) {
        MessageBox.Hide();
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(param) {
        var params = [],
        ids = {
            field: 'Id',
            values: []
        },
        index;

        if (param !== undefined) {
            params[0] = param;
        } else {
            params = $('#tblResources').bootstrapTable('getSelections');
        }

        for (index = 0; index < params.length; index += 1) {
            ids.values[index] = params[index].Id;
        }

        ajaxCall("Resources.aspx/DeleteResourcesJSON",
             "{'Ids':'" + ids.values.join() + "'}",
             function (result) { removeCallbackOk(result, ids); },
             removeCallbackFailed);

    }
    function showRemoveDialog(param) {
        if (param !== undefined) {
            MessageBox.Ask('Remover Recurso',
                       "Confirma a remoção do Recurso '" + param.Name + "' ?",
                       removeCancelled,
                       function () { removeConfirmed(param); });
        } else {
            MessageBox.Ask('Remover Recurso',
                       "Confirma a remoção dos Recursos seleccionados ?",
                       removeCancelled,
                       function () { removeConfirmed(undefined); });
        }
    }


    /*---   L O A D   ---*/
    function afterTableLoad() {
        var id, index;
        if (sessionStorage.getItem('search_all_selected_id') !== null) {
            id = sessionStorage.getItem('search_all_selected_id');
            index = getTableIndexById('#tblResources', id);
            $('#tblResources').bootstrapTable('check', index);
            showEditDialog();
            sessionStorage.setItem('search_all_selected_id', null);
        }
    }
    function getResourcesCallbackOk(result) {
        $('#tblResources').bootstrapTable('destroy');
        $('#tblResources').bootstrapTable({
            data: jQuery.parseJSON(result.d)
        });
        setupToolbar();
        afterTableLoad();
    }
    //function getResourcesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getResources() {
        ajaxCall("Resources.aspx/GetResourcesJSON",
                "",
                getResourcesCallbackOk);
    }
    function getResourceStatusesCallbackOk(result) {
        var ddl = $("#ddlStatus");
        $.each(jQuery.parseJSON(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getResourceStatusesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getResourceStatuses() {
        ajaxCall("Resources.aspx/GetResourceStatusesJSON",
                "",
                getResourceStatusesCallbackOk);
    }


    /*---   S E T U P   ---*/
    function setupToolbar() {
        var selectedRows = $('#tblResources').bootstrapTable('getSelections');
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
        $("#txtLogin").attr('maxlength', '100');
        $("#txtName").attr('maxlength', '200');
        getResourceStatuses();
    }
    function actionFormatter(value, row, index) {
        return [
            '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
            '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
        ].join('');
    }
    function setupPage() {
        $('#tblResources')
        .on('check.bs.table', function (e, row) { setupToolbar(); })
        .on('uncheck.bs.table', function (e, row) { setupToolbar(); });
        setupTable();
        setupForm();
    }


    /*---   M A I N   ---*/
    function pageLoad() {
        // Page load safety check
        if (pageHasLoaded) {
            return;
        }
        pageHasLoaded = true;

        setupPage();
        getResources();
    }
    $(function () {
        pageLoad();
    });


    /*---   P U B L I C   ---*/
    return {
        getResources: function () { return getResources(); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (param) { return showRemoveDialog(param); }
    }

})();

var Parameters = (function () {

    var pageHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    function validateRequired() {
        var msg = '';
        if ($("#txtName").val() === '') {
            msg += "O campo 'Nome' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.Info(msg);
            return false;
        }
        return true;
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlParameter").modal("hide");
        var data = '[{"Id":' + result.d + ', ' +
                   '"Name":"' + $("#txtName").val() + '", ' +
                   '"Value":"' + $("#txtValue").val() + '", ' +
                   '"Description":"' + $("#txtDescription").val() + '"}]';
        $("#tblParameters").bootstrapTable('append', JSON.parse(data));
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace});
    }
    function insert() {
        if (validateRequired() === true) {
            AjaxUtil.Call("Parameters.aspx/InsertParameterJSON",
                          '{Name:"' + $("#txtName").val() + '", ' +
                          'Value:"' + $("#txtValue").val() + '", ' +
                          'Description:"' + $("#txtDescription").val() + '"}',
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $("#mdlLabel").text("Adicionar Novo Parâmetro");
        MessageBox.Clear();
        $("#txtId").val("");
        $("#txtName").val("");
        $("#txtValue").val("");
        $("#txtDescription").val("");
        $("#btnActionConfirmed").unbind("click");
        $("#btnActionConfirmed").on("click", insert);
        $("#mdlParameter").on("shown.bs.modal", function () { $("#txtName").focus(); });
        $("#mdlParameter").modal("show");
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $("#mdlParameter").modal("hide");
        $("#tblParameters").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById("#tblParameters", $("#txtId").val()),
            row: {
                Id: $("#txtId").val(),
                Name: $("#txtName").val(),
                Value: $("#txtValue").val(),
                Description: $("#txtDescription").val()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function update() {
        if (validateRequired() === true) {
            AjaxUtil.Call("Parameters.aspx/UpdateParameterJSON",
                          '{Id:' + $("#txtId").val() + ', ' +
                          'Name:"' + $("#txtName").val() + '", ' +
                          'Value:"' + $("#txtValue").val() + '", ' +
                          'Description:"' + $("#txtDescription").val() + '"}',
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var param;
        if (row === undefined) {
            param = $("#tblParameters").bootstrapTable("getSelections")[0];
        } else {
            param = row;
        }
        MessageBox.Clear();
        $("#mdlLabel").text("Editar Parâmetro");
        $("#txtId").val(param.Id);
        $("#txtName").val(param.Name);
        $("#txtValue").val(param.Value);
        $("#txtDescription").val(param.Description);
        $("#btnActionConfirmed").unbind("click");
        $("#btnActionConfirmed").on("click", update);
        $("#mdlParameter").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        //console.log("ids: " + JSON.stringify(ids));
        $("#tblParameters").bootstrapTable("remove", ids);
        MessageBox.Hide();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Hide();
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(param) {
        var params = [],
            ids = {
                field: "Id",
                values: []
            },
            index;

        if (param !== undefined) {
            params[0] = param;
        } else {
            params = $("#tblParameters").bootstrapTable("getSelections");
        }

        for (index = 0; index < params.length; index += 1) {
            ids.values[index] = params[index].Id;
        }

        AjaxUtil.Call("Parameters.aspx/DeleteParametersJSON",
                      '{Ids:"' + ids.values.join() + '"}',
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);

    }
    function showRemoveDialog(param) {
        if (param !== undefined) {
            MessageBox.Ask("Remover Parâmetro",
                           "Confirma a remoção do parâmetro '" + param.Name + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(param); });
        } else {
            MessageBox.Ask("Remover Parâmetro",
                           "Confirma a remoção dos parâmetros seleccionados ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
    function setupToolbar() {
        var selectedRows = $("#tblParameters").bootstrapTable("getSelections");
        if (selectedRows.length === 0) {
            $("#btnEdit").prop("disabled", true);
            $("#btnRemove").prop("disabled", true);
        } else {
            if (selectedRows.length === 1) {
                $("#btnEdit").prop("disabled", false);
                $("#btnRemove").prop("disabled", false);
            } else {
                $("#btnEdit").prop("disabled", true);
                $("#btnRemove").prop("disabled", false);
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
        $("#txtName").attr("maxlength", "200");
        $("#txtValue").attr("maxlength", '2000');
        $("#txtDescription").attr("maxlength", "1000");
    }
    function actionFormatter(value, row, index) {
        return [
            '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
            '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
        ].join('');
    }
    function setupPage() {
        $("#tblParameters")
            .on("check.bs.table", function (e, row) {
                setupToolbar();
            })
            .on("uncheck.bs.table", function (e, row) {
                setupToolbar();
            });
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterTableLoad() {
        //console.log("sessionStorage.getItem('search_all_selected_id'): " +
        //    sessionStorage.getItem("search_all_selected_id"));
        //console.log("type of sessionStorage.getItem('search_all_selected_id'): " +
        //    typeof sessionStorage.getItem("search_all_selected_id"));
        if (sessionStorage.getItem("search_all_selected_id").toString() !== 'null') {
            var id = sessionStorage.getItem("search_all_selected_id"),
                index = TableUtil.getTableIndexById('#tblParameters', id);
            $("#tblParameters").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.setItem("search_all_selected_id", null);
        }
    }
    function getParametersCallbackOk(result) {
        $("#tblParameters").bootstrapTable("destroy");
        $("#tblParameters").bootstrapTable({
            data: JSON.parse(result.d)
        });
        setupToolbar();
        afterTableLoad();
    }
    //function getParametersCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getParameters() {
        AjaxUtil.Call("Parameters.aspx/GetParametersJSON",
                      "",
                      getParametersCallbackOk);
    }


    /*---   M A I N   ---*/
    function pageLoad() {
        // Page load safety check
        if (pageHasLoaded) {
            return;
        }
        pageHasLoaded = true;

        setupPage();
        getParameters();
    }
    $(function () {
        pageLoad();
    });


    /*---   P U B L I C   ---*/
    return {
        actionFormatter: function (value, row, index) {
            return actionFormatter(value, row, index);
        },
        getParameters: function () { return getParameters(); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (param) { return showRemoveDialog(param); }
    };

}());

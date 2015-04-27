var ProjectNotes = (function () {

    var tabHasLoaded = false;

    /*---   A F T E R   L O A D   ---*/
    function validateInputFields() {
        var msg = "";
        if ($("#txtNoteText").val() === "") {
            msg += "O campo 'Nome' é obrigatório.";
        }
        if (msg.length > 0) {
            MessageBox.Info(msg, { Div: "#divNoteModalMessage" });
            return false;
        }
        MessageBox.Clear();
        return true;
    }



    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#mdlNote").modal("hide");
        var data = {"Id": result.d,
                    "Text": $("#txtNoteText").val()};
        console.log(JSON.stringify(data));
        $("#tblNotes").bootstrapTable('append', data);

    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divNoteModalMessage" });
    }
    function insertNote() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/InsertNoteJSON",
                          '{Text:"' + $("#txtNoteText").val() + '", ' +
                          'IdProject:' + $("#txtId").val() + '}',
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }
    function showAddDialog() {
        $("#mdlNoteLabel").text("Adicionar nova Nota");
        $("#txtNoteId").val("");
        $("#txtNoteText").val("");
        $("#btnNoteActionConfirmed").unbind("click");
        $("#btnNoteActionConfirmed").on("click", insertNote);
        $("#mdlNote").modal("show");
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $("#mdlNote").modal("hide");
        $("#tblNotes").bootstrapTable("updateRow", {
            index: TableUtil.getTableIndexById("#tblNotes", $("#txtNoteId").val()),
            row: {
                Id: $("#txtNoteId").val(),
                Text: $("#txtNoteText").val()
            }
        });
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divNoteModalMessage" });
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/updateNoteJSON",
                          '{Id:"' + $("#txtNoteId").val() + '", ' +
                          'Text:"' + $("#txtNoteText").val() + '", ' +
                          'IdProject:' + $("#txtId").val() + '}',
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }
    function showEditDialog(row) {
        var note;
        if (row === undefined) {
            note = $("#tblNotes").bootstrapTable("getSelections")[0];
        } else {
            note = row;
        }
        MessageBox.Clear();
        $("#mdlNoteLabel").text("Editar Nota");
        $("#txtNoteId").val(note.Id);
        $("#txtNoteText").val(note.Text);
        $("#btnNoteActionConfirmed").unbind("click");
        $("#btnNoteActionConfirmed").on("click", update);
        $("#mdlNote").modal("show");
    }


    /*---   R E M O V E   ---*/
    function removeCallbackOk(result, ids) {
        $("#tblNotes").bootstrapTable("remove", ids);
        MessageBox.Hide();
    }
    function removeCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Hide();
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace,
                                          Div: "#divNoteModalMessage" });
    }
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(note) {
        var notes = [],
            ids = {
                field: "Id",
                values: []
            },
            index;

        if (note !== undefined) {
            notes[0] = note;
        } else {
            notes = $("#tblNotes").bootstrapTable("getSelections");
        }

        for (index = 0; index < notes.length; index += 1) {
            ids.values[index] = notes[index].Id;
        }
        AjaxUtil.Call("Projects.aspx/DeleteNotesJSON",
                      '{Ids:"' + ids.values.join() + '"}',
                      function (result) { removeCallbackOk(result, ids); },
                      removeCallbackFailed);
    }
    function showRemoveDialog(note) {
        if (note !== undefined) {
            MessageBox.Ask("Remover Nota",
                           "Confirma a remoção da nota '" + note.Id + "' ?",
                           removeCancelled,
                           function () { removeConfirmed(note); });
        } else {
            MessageBox.Ask("Remover Nota",
                           "Confirma a remoção das notas seleccionadas ?",
                           removeCancelled,
                           function () { removeConfirmed(undefined); });
        }
    }


    /*---   S E T U P   ---*/
    function setupToolbar() {
        var selectedRows = $("#tblNotes").bootstrapTable("getSelections");
        if (selectedRows.length === 0) {
            $("#btnNoteEdit").prop("disabled", true);
            $("#btnNoteRemove").prop("disabled", true);
        } else {
            if (selectedRows.length === 1) {
                $("#btnNoteEdit").prop("disabled", false);
                $("#btnNoteRemove").prop("disabled", false);
            } else {
                $("#btnNoteEdit").prop("disabled", true);
                $("#btnNoteRemove").prop("disabled", false);
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
        $("#txtNoteText").attr("maxlength", "4000");
    }
    function setupPage() {
        $("#tblNotes")
            .on("check.bs.table", function (e, row) { setupToolbar(); })
            .on("uncheck.bs.table", function (e, row) { setupToolbar(); });
        setupTable();
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterNotesLoad() {
        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            var obj,
                index;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            index = TableUtil.getTableIndexById('#tblNotes', obj.Id);
            $("#tblNotes").bootstrapTable("check", index);
            showEditDialog();
            sessionStorage.removeItem("search_all_selected_obj");
        }
    }
    function getNotesCallbackOk(result) {
        $("#tblNotes").bootstrapTable("destroy");
        $("#tblNotes").bootstrapTable({
            data: JSON.parse(result.d)
        });
        setupToolbar();
        afterNotesLoad();
    }
    //function getNotesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getNotes() {
        var idProject = $("#txtId").val();
        AjaxUtil.Call("Projects.aspx/GetNotesJSON",
                      '{IdProject:' + idProject + '}',
                      getNotesCallbackOk);
    }


    /*---   M A I N   ---*/
    function tabLoad() {
        // Tab load safety check
        if (tabHasLoaded) {
            return;
        }
        tabHasLoaded = true;

        setupPage();

        getNotes();
    }


    /*---   P U B L I C   ---*/
    return {
        getNotes: function (idProject) { return getNotes(idProject); },
        showAddDialog: function () { return showAddDialog(); },
        showEditDialog: function (row) { return showEditDialog(row); },
        showRemoveDialog: function (note) { return showRemoveDialog(note); },
        tabLoad: function () { return tabLoad(); }
    };

}());

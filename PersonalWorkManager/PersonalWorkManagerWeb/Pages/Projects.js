var Projects = (function () {

    var pageHasLoaded = false,
        tabProjectMode = '';

    /*---   A F T E R   L O A D   ---*/
    function validateInputFields() {
        var msg = '';
        if ($("#txtCode").val() === '') {
            msg += "O campo 'Código' é obrigatório.";
        }
        if ($("#txtName").val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Nome' é obrigatório.";
        }
        if ($("#txtStartDate").datetimepicker().children("input").val() === '') {
            if (msg.length > 0) { msg += "<br>"; }
            msg += "O campo 'Data Inicial' é obrigatório.";
        }
        if ($("#ddlStatus option:selected").val() === undefined) {
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
    function switchTab(tab) {
        switch (tab) {
        case 'project':
            $("#tlbProject").show();
            $("#tlbTasks").hide();
            $("#tlbAlerts").hide();
            $("#tlbNotes").hide();
            $("#tlbSessions").hide();
            break;
        case 'tasks':
            $("#tlbProject").hide();
            $("#tlbTasks").show();
            $("#tlbAlerts").hide();
            $("#tlbNotes").hide();
            $("#tlbSessions").hide();
            ProjectTasks.tabLoad();
            break;
        default:
        }
    }
    function setupToolbar(mode) {
        tabProjectMode = mode;
        switch (tabProjectMode) {
        case '':
            $("#btnProjectNew").show();
            $("#btnProjectSave").hide();
            $("#btnProjectRemove").hide();
            $("#btnProjectCancel").hide();
            break;
        case 'new':
            $("#btnProjectNew").hide();
            $("#btnProjectSave").show();
            $("#btnProjectRemove").hide();
            $("#btnProjectCancel").show();
            break;
        case 'edit':
            $("#btnProjectNew").show();
            $("#btnProjectSave").show();
            $("#btnProjectRemove").show();
            $("#btnProjectCancel").hide();
            break;
        default:
        }
    }
    function clearForm() {
        $("#txtId").val('');
        $("#txtCode").val('');
        $("#txtName").val('');
        $("#txtDescription").val('');
        $("#txtStartDate").datetimepicker().children("input").val('');
        $("#txtEndDate").datetimepicker().children("input").val('');
        $("#ddlStatus").val(-1);
    }
    function getProjectCallbackOk(result) {
        var proj = JSON.parse(result.d)[0];
        $("#txtId").val(proj.Id);
        $("#txtCode").val(proj.Code);
        $("#txtName").val(proj.Name);
        $("#txtDescription").val(proj.Description);
        $("#txtStartDate").datetimepicker().children('input')
                .val(DateUtil.Format(proj.StartDate));
        $("#txtEndDate").datetimepicker().children('input')
                .val(DateUtil.Format(proj.EndDate));
        $("#ddlStatus").val(proj.IdStatus);

        ProjectTasks.tabTasksHasLoaded = false;

        $("#tabProject a[href="#tabMain"]").tab('show');
        switchTab('project');
        setupToolbar('edit');
    }
    //function getProjectCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getProject(id) {
        if (id !== '') {
            AjaxUtil.Call("Projects.aspx/GetProjectJSON",
                              "{'Id':'" + id + "'}",
                              getProjectCallbackOk);
        }
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        $("#ddlProject")[0].selectize
            .addOption({ value: result.d,
                         code: $("#txtCode").val(),
                         text: $("#txtName").val(),
                         description: $("#txtDescription").val()
                       });
        setupToolbar('edit');
    }
    function insertCallbackFailed(msg) {
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function insert() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/InsertProjectJSON",
                          "{'Code':'" + $("#txtCode").val() + "', " +
                          "'Name':'" + $("#txtName").val() + "', " +
                          "'Description':'" + $("#txtDescription").val() + "', " +
                          "'StartDate':'" + $("#txtStartDate").datetimepicker()
                            .children("input").val() + "', " +
                          "'EndDate':'" + $("#txtEndDate").datetimepicker()
                            .children("input").val() + "', " +
                          "'IdStatus':" + $("#ddlStatus").val() + "}",
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        $("#ddlProject")[0].selectize
            .updateOption($("#txtId").val(),
                          { value: $("#txtId").val(),
                              code: $("#txtCode").val(),
                              text: $("#txtName").val(),
                              description: $("#txtDescription").val()
                          });
        setupToolbar('edit');
    }
    function updateCallbackFailed(msg) {
        var ex = jQuery.parseJSON(msg.responseText);
        MessageBox.Exception(ex.Message, ex.StackTrace);
    }
    function update() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/UpdateProjectJSON",
                          "{'Id':'" + $("#txtId").val() + "', " +
                          "'Code':'" + $("#txtCode").val() + "', " +
                          "'Name':'" + $("#txtName").val() + "', " +
                          "'Description':'" + $("#txtDescription").val() + "', " +
                          "'StartDate':'" + $("#txtStartDate").datetimepicker()
                            .children("input").val() + "', " +
                          "'EndDate':'" + $("#txtEndDate").datetimepicker()
                            .children("input").val() + "', " +
                          "'IdStatus':" + $("#ddlStatus").val() + "}",
                          updateCallbackOk,
                          updateCallbackFailed);
        }
    }


    /*---   R E M O V E   ---*/
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
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(id) {
        AjaxUtil.Call("Projects.aspx/DeleteProjectJSON",
                      "{'Id':" + id + "}",
                      function (result) { removeCallbackOk(result, id); },
                      removeCallbackFailed);
    }
    function showRemoveDialog() {
        var ddl = $("#ddlProject"),
            selectize = ddl[0].selectize,
            proj = selectize.getItem(selectize.getValue());
        MessageBox.Ask('Remover Projecto',
                       "Confirma a remoção do projecto '" + proj.text() + "' ?",
                       removeCancelled,
                       function () { removeConfirmed(selectize.getValue()); });
    }


    /*---   S E T U P   ---*/
    function setupForm() {
        $("#ddlProject").selectize({
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
                    var top_description;
                    if (item.Description.length > 300) {
                        top_description = item.Description.substring(0, 300) + ' (...)';
                    } else {
                        top_description = item.Description;
                    }
                    return '<div>' +
                             '<span>' +
                               '<span style="float: left; width: 120px;' +
                               ' font-style: bold; text-align: right;">' +
                               escape(item.Code) + '&nbsp;</span>' +
                               '<span style="font-size: 130%;">&nbsp;' +
                               escape(item.Name) +
                               '</span>' +
                             '</span>' +
                             '<br>' +
                             '<span>' +
                               '<span style="float: left; width: 120px;' +
                               ' text-align: right;"><strong>&nbsp;</strong>' +
                               '</span><span style="font-style: italic">&nbsp;' +
                               escape(top_description) +
                               '</span>' +
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
            $("#txtEndDate").data("DateTimePicker").minDate(e.date);
        });
        $("#txtEndDate").on("dp.change", function (e) {
            $("#txtStartDate").data("DateTimePicker").maxDate(e.date);
        });
    }
    function setupPage() {
        setupToolbar('');
        setupForm();
    }


    /*---   L O A D   ---*/
    function afterProjectsLoad() {
        if (sessionStorage.getItem('search_all_selected_id') !== null) {
            /*
            var id = sessionStorage.getItem('search_all_selected_id'),
                ddl = $("#ddlProject"),
                selectize = ddl[0].selectize,
                proj = selectize.getItem(selectize.setValue(id, false));
            */
            sessionStorage.setItem('search_all_selected_id', null);
        }
    }
    function getProjectsCallbackOk(result) {
        var ddl = $("#ddlProject"),
            selectize = ddl[0].selectize;
        $.each(jQuery.parseJSON(result.d), function () {
            //alert('a' + JSON.stringify(this));
            selectize.addOption(
                {   Id: this.Id,
                    Code: this.Code,
                    Name: this.Name,
                    Description: this.Description }
            );
        });
        selectize.clear(true);
        afterProjectsLoad();
    }
    //function getProjectsCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getProjects() {
        AjaxUtil.Call("Projects.aspx/GetProjectsJSON",
                      "",
                      getProjectsCallbackOk);
    }
    function getProjectStatusesCallbackOk(result) {
        var ddl = $("#ddlStatus");
        $.each(jQuery.parseJSON(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getProjectStatusesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getProjectStatuses() {
        AjaxUtil.Call("Projects.aspx/GetProjectStatusesJSON",
                 "",
                 getProjectStatusesCallbackOk);
    }


    /*---   M A I N   ---*/
    function newProject() {
        $("#ddlProject")[0].selectize.clear(true);
        clearForm();
        setupToolbar('new');
    }
    function cancelNewProject() {
        setupToolbar('');
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
    function pageLoad() {
        // Page load safety check
        if (pageHasLoaded) {
            return;
        }
        pageHasLoaded = true;

        switchTab('project');

        setupPage();

        getProjectStatuses();
        getProjects();
    }
    $(function () {
        pageLoad();
    });

    /*---   P U B L I C   ---*/
    return {
        newProject: function () { return newProject(); },
        cancelNewProject: function () { return cancelNewProject(); },
        saveProject: function () { return saveProject(); },
        removeProject: function () { return removeProject(); },
        getProject: function (id) { return getProject(id); },
        switchTab: function (tab) { return switchTab(tab); }
    };

}());

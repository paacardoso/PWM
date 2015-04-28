/*jslint browser: true*/
/*global ProjectTasks, ProjectAlerts, ProjectNotes, ProjectSessions*/
var Projects = (function () {

    var pageHasLoaded = false,
        tabProjectMode = "";

    /*---   A F T E R   L O A D   ---*/
    function validateInputFields() {
        var msg = '';
        if ($("#txtCode").val() === "") {
            msg += "O campo 'Código' é obrigatório.";
        }
        if ($("#txtName").val() === "") {
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
    function setupToolbar() {
        switch (tabProjectMode) {
        case "":
            $("#btnProjectNew").show();
            $("#btnProjectSave").hide();
            $("#btnProjectRemove").hide();
            $("#btnProjectCancel").hide();
            break;
        case "new":
            $("#btnProjectNew").hide();
            $("#btnProjectSave").show();
            $("#btnProjectRemove").hide();
            $("#btnProjectCancel").show();
            break;
        case "edit":
            $("#btnProjectNew").show();
            $("#btnProjectSave").show();
            $("#btnProjectRemove").show();
            $("#btnProjectCancel").hide();
            break;
        default:
        }
    }
    function setupTabs() {
        switch (tabProjectMode) {
        case "":
            //$("#divMain") is hidden. Nothing to do
            break;
        case "new":
            $('#tabProject a[href="#tabTasks"]').hide();
            $('#tabProject a[href="#tabAlerts"]').hide();
            $('#tabProject a[href="#tabNotes"]').hide();
            $('#tabProject a[href="#tabSessions"]').hide();
            break;
        case "edit":
            $('#tabProject a[href="#tabTasks"]').show();
            $('#tabProject a[href="#tabAlerts"]').show();
            $('#tabProject a[href="#tabNotes"]').show();
            $('#tabProject a[href="#tabSessions"]').show();
            break;
        default:
        }
    }
    function clearForm() {
        $("#txtId").val('');
        $("#txtCode").val('');
        $("#txtName").val('');
        $("#txtDescription").val('');
        $("#txtStartDate").data("DateTimePicker").date(new Date());
        $("#txtEndDate").data("DateTimePicker").date(null);

        $("#ddlStatus").val(-1);
    }
    function setupMode(mode) {
        //console.log("Changing to mode: " + mode);
        tabProjectMode = mode;
        MessageBox.Clear();
        setupTabs();

        switch (tabProjectMode) {
        case "":
            $("#divMain").hide();
            break;
        case "new":
            $("#divMain").show();
            $("#ddlProject")[0].selectize.clear(true);
            clearForm();
            setupToolbar();
            break;
        case "edit":
            $("#divMain").show();
            setupToolbar();
            break;
        default:
        }
    }
    function getProjectCallbackOk(result) {
        var proj = JSON.parse(result.d)[0],
            obj;
        $("#txtId").val(proj.Id);
        $("#txtCode").val(proj.Code);
        $("#txtName").val(proj.Name);
        $("#txtDescription").val(proj.Description);
        $("#txtStartDate").data("DateTimePicker").date(moment(proj.StartDate));
        $("#txtEndDate").data("DateTimePicker").date(moment(proj.EndDate));
        $("#ddlStatus").val(proj.IdStatus);

        setupMode("edit");

        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));
            switch (obj.Type) {
            case "task":
                $('#tabProject a[href="#tabTasks"]').tab('show');
                break;
            case "alert":
                $('#tabProject a[href="#tabAlerts"]').tab('show');
                break;
            case "note":
                $('#tabProject a[href="#tabNotes"]').tab('show');
                break;
            case "session":
                $('#tabProject a[href="#tabSessions"]').tab('show');
                break;
            default:
                break;
            }
        } else {
            $("#tabProject a[href='#tabMain']").tab("show");
        }
    }
    //function getProjectCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getProject(id) {
        if (id !== '') {
            AjaxUtil.Call("Projects.aspx/GetProjectJSON",
                          {Id: id},
                          getProjectCallbackOk);
        }
    }


    /*---   A D D   ---*/
    function insertCallbackOk(result) {
        //console.log("New project id: " + result.d);
        $("#ddlProject")[0].selectize
            .addOption({ Id: result.d,
                         Code: $("#txtCode").val(),
                         Name: $("#txtName").val(),
                         Description: $("#txtDescription").val()
                       });
        setupMode("edit");
    }
    function insertCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function insert() {
        if (validateInputFields() === true) {
            AjaxUtil.Call("Projects.aspx/InsertProjectJSON",
                          {Code: $("#txtCode").val(),
                           Name: $("#txtName").val(),
                           Description: $("#txtDescription").val(),
                           StartDate: $("#txtStartDate").data("DateTimePicker")
                             .date().format(),
                           EndDate: $("#txtEndDate").data("DateTimePicker")
                             .date().format(),
                           IdStatus: $("#ddlStatus").val()},
                          insertCallbackOk,
                          insertCallbackFailed);
        }
    }


    /*---   E D I T   ---*/
    function updateCallbackOk(result) {
        console.log("Updating Successfull !");
        $("#ddlProject")[0].selectize
            .updateOption($("#txtId").val(),
                          { Id: $("#txtId").val(),
                            Code: $("#txtCode").val(),
                            Name: $("#txtName").val(),
                            Description: $("#txtDescription").val()
                          });
        setupToolbar("edit");
    }
    function updateCallbackFailed(msg) {
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function update() {

        console.log($("#txtStartDate").data("DateTimePicker").date().format());

        if (validateInputFields() === true) {
            console.log("Updating fields ...");
            AjaxUtil.Call("Projects.aspx/UpdateProjectJSON",
                          {Id: $("#txtId").val(),
                           Code: $("#txtCode").val(),
                           Name: $("#txtName").val(),
                           Description: $("#txtDescription").val(),
                           StartDate: $("#txtStartDate").data("DateTimePicker")
                             .date().format(),
                           EndDate: $("#txtEndDate").data("DateTimePicker")
                             .date().format(),
                          IdStatus: $("#ddlStatus").val()},
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
        setupMode('');
    }
    function removeCallbackFailed(msg) {
        MessageBox.Hide();
        var ex = JSON.parse(msg.responseText);
        MessageBox.Exception(ex.Message, {StackTrace: ex.StackTrace });
    }
    function removeCancelled() {
        MessageBox.Hide();
    }
    function removeConfirmed(id) {
        AjaxUtil.Call("Projects.aspx/DeleteProjectJSON",
                      {Id: id},
                      function (result) { removeCallbackOk(result, id); },
                      removeCallbackFailed);
    }
    function showRemoveDialog() {
        var ddl = $("#ddlProject"),
            selectize = ddl[0].selectize,
            proj = selectize.getItem(selectize.getValue());
        MessageBox.Ask("Remover Projecto",
                       "Confirma a remoção do projecto '" + proj.text() + "' ?",
                       removeCancelled,
                       function () { removeConfirmed(selectize.getValue()); });
    }


    /*---   S E T U P   ---*/
    function setupForm() {
        $("#ddlProject").selectize({
            create: false,
            valueField: "Id",
            labelField: "Name",
            searchField: ["Code", "Name", "Description"],
            sortField: {
                field: "Name",
                direction: "asc"
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
            dropdownParent: "body"
        });
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            // e.target // newly activated tab
            // e.relatedTarget // previous active tab
            var activatedTab = e.target.id.replace("anc", ""),
                previousTab = e.relatedTarget.id.replace("anc", "");
            //console.log("activatedTab: " + activatedTab);
            //console.log("previousTab: " + previousTab);
            // Switch toolbars
            $("#tlb" + previousTab).hide();
            $("#tlb" + activatedTab).show();
            switch (activatedTab) {
            case "Main":
                break;
            case "Tasks":
                ProjectTasks.tabLoad();
                break;
            case "Alerts":
                ProjectAlerts.tabLoad();
                break;
            case "Notes":
                ProjectNotes.tabLoad();
                break;
            case "Sessions":
                ProjectSessions.tabLoad();
                break;
            default:
                break;
            }
        });
        $("#txtName").attr("maxlength", "200");
        $("#txtDescription").attr("maxlength", "1000");
        $("#txtStartDate").datetimepicker({
            format: DateUtil.DATE_FORMAT
        });
        $("#txtEndDate").datetimepicker({
            format: DateUtil.DATE_FORMAT
        });
        $("#txtStartDate").on("dp.change", function (e) {
            $("#txtEndDate").data("DateTimePicker").minDate(e.date);
        });
        $("#txtEndDate").on("dp.change", function (e) {
            $("#txtStartDate").data("DateTimePicker").maxDate(e.date);
        });
        $(".selectize-input").css("margin-bottom", "-5px");
    }
    function setupPage() {
        setupForm();
        setupMode(tabProjectMode);
    }


    /*---   L O A D   ---*/
    function afterProjectsLoad() {
        //console.log(typeof sessionStorage.getItem("search_all_selected_obj"));
        if (sessionStorage.getItem("search_all_selected_obj") !== null) {
            var obj,
                ddl = $("#ddlProject"),
                selectize = ddl[0].selectize;
            obj = JSON.parse(sessionStorage.getItem("search_all_selected_obj"));

            switch (obj.Type) {
            case "project":
                //console.log("selecting project id: " + obj.Id);
                selectize.setValue(obj.Id, false);
                sessionStorage.removeItem("search_all_selected_obj");
                break;
            case "task":
            case "alert":
            case "note":
                //console.log("selecting project id: " + obj.IdProject);
                selectize.setValue(obj.IdProject, false);
                // session storage variable should not be cleared here,
                // because it will be needed in getProjectCallbackOK()
                break;
            default:
                break;
            }
        }
    }
    function getProjectsCallbackOk(result) {
        var ddl = $("#ddlProject"),
            selectize = ddl[0].selectize;
        $.each(JSON.parse(result.d), function () {
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
                      {},
                      getProjectsCallbackOk);
    }
    function getProjectStatusesCallbackOk(result) {
        var ddl = $("#ddlStatus");
        $.each(JSON.parse(result.d), function () {
            ddl.append($("<option />").val(this.Id).text(this.Name));
        });
    }
    //function getProjectStatusesCallbackFailed() {
    // handled by the default ajax function (AjaxUtil.js\defaultFailFunc)
    //}
    function getProjectStatuses() {
        AjaxUtil.Call("Projects.aspx/GetProjectStatusesJSON",
                 {},
                 getProjectStatusesCallbackOk);
    }


    /*---   M A I N   ---*/
    function newProject() {
        setupMode("new");
    }
    function cancelNewProject() {
        setupMode("");
    }
    function saveProject() {
        if (tabProjectMode === "new") {
            insert();
        } else if (tabProjectMode === "edit") {
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
        getProject: function (id) { return getProject(id); }
    };

}());

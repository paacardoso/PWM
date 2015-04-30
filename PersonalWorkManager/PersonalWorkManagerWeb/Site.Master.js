//
// --> Authenticated User (JSON string)
// sessionStorage.setItem("current_resource", JSON.stringify(currentUser));
// var currentUser = JSON.parse(sessionStorage.getItem("current_resource"))
//
// --> Type and Id of the selected item of the 'search all' select box
// sessionStorage.setItem("search_all_selected_obj", obj)
// var obj = sessionStorage.getItem("search_all_selected_obj")
// obj = {
//     Type: type,
//     Id: id,
//     IdProject: idProject
// }

var Master = (function () {

    var mainPageHasLoaded = false;


    /*---   A F T E R   L O A D   ---*/
    /*---   A U T H E N T I C A T I O N   ---*/
    //function logout() {
    //    ajaxCall("Login.aspx/LogoutJSON",
    //             "",
    //             logoutCallbackOk,
    //             logoutCallbackFailed);
    //}
    //function logoutCallbackOk(result) {
    //    sessionStorage.setItem("current_resource", null);
    //    window.location.href = resolveURL("/Default.aspx");
    //}
    //function logoutCallbackFailed(msg) {
    //    alert('failed !!!');
    //    var ex = JSON.parse(msg.responseText);
    //    MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
    //}


    /*---   O P E N   ---*/
    function openItem(value) {
        var pos1,
            pos2,
            type,
            id,
            idProject,
            obj;
        pos1 = value.indexOf('_');
        pos2 = value.indexOf('_', pos1 + 1);
        type = value.substring(0, pos1);
        if (pos2 > 0) {
            id = value.substring(pos1 + 1, pos2);
            idProject = value.substring(pos2 + 1);
        } else {
            id = value.substring(pos1 + 1);
            idProject = 0;
        }
        obj = {
            Type: type,
            Id: id,
            IdProject: idProject
        };
        //console.log("obj: " + JSON.stringify(obj));

        sessionStorage.setItem("search_all_selected_obj", JSON.stringify(obj));

        switch (type) {
        case "parameter":
            window.location.href = UrlUtil
                .resolveURL("/Pages/Management/Parameters.aspx");
            break;
        case "resource":
            window.location.href = UrlUtil
                .resolveURL("/Pages/Management/Resources.aspx");
            break;
        case "status":
            window.location.href = UrlUtil
                .resolveURL("/Pages/Management/Statuses.aspx");
            break;
        case "project":
        case "task":
        case "alert":
        case "note":
            window.location.href = UrlUtil
                .resolveURL("/Pages/Projects.aspx");
            break;

        default:
            break;
        }
    }


    /*---   S E T U P   ---*/
    function setupMainPage() {
        // Set main search select box
        $("#ddlSearch").selectize({
            valueField: "Id",
            labelField: "Name",
            searchField: ["Name", "Description"],
            create: false,
            render: {
                option: function (item, escape) {
                    var type_img,
                        div,
                        top_description;
                    type_img = '<span class="fa fa-';
                    switch (item.Type) {
                    case "parameter":
                        type_img += "table";
                        break;
                    case "resource":
                        type_img += "male";
                        break;
                    case "status":
                        type_img += "flag";
                        break;
                    case "project":
                        type_img += "book";
                        break;
                    case "task":
                        type_img += "tasks";
                        break;
                    case "alert":
                        type_img += "alert";
                        break;
                    case "note":
                        type_img += "tag";
                        break;
                    default:
                        break;
                    }
                    type_img += ' fa-fw"></span>';

                    div = '<div>' +
                            '<span>' +
                                type_img +
                                '<span style="font-size: 85%; font-style: bold;">' +
                                    '&nbsp;' + escape(item.Name) + '</span>';
                    if (item.Description !== null) {
                        if (item.Description.length > 70) {
                            top_description = item.Description
                                .substring(0, 70) + ' (...)';
                        } else {
                            top_description = item.Description;
                        }
                        div += '<span style="font-size: 75%; font-style: italic"><br>' +
                            escape(top_description) + '</span>';
                    }
                    div += '</span>' +
                              '</div>';
                    return div;
                }
            },
            load: function (query, callback) {
                if (!query.length) {
                    return callback();
                }
                $.ajax({
                    type: 'POST',
                    url: UrlUtil.resolveURL("/SiteMaster.asmx/SearchAllJSON"),
                    data: '{Text:"' + query + '"}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (msg) {
                        var ex = JSON.parse(msg.responseText);
                        MessageBox.exception(ex.Message, {StackTrace: ex.StackTrace });
                        callback();
                    },
                    success: function (res) {
                        //callback(JSON.parse(res.d).slice(0, 10));
                        callback(JSON.parse(res.d));
                    }
                });
            },
            onChange: function (value) { openItem(value); },
            dropdownParent: null
        });

        // Set logged in user full name
        var currentUser = JSON.parse(sessionStorage.getItem("current_resource"));
        $("#HeadLoginName").text(currentUser.Name);
    }


    /*---   M A I N   ---*/
    function mainPageLoad() {
        // Page load safety check
        if (mainPageHasLoaded) {
            return;
        }
        mainPageHasLoaded = true;

        setupMainPage();
    }
    $(function () {
        mainPageLoad();
    });


    /*---   P U B L I C   ---*/


    /*---   P R O T O T Y P E S   */

}());

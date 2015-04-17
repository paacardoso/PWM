/*---   S E S S I O N   S T O R A G E   I T E M S   */
//
// --> Authenticated User (JSON string)
// sessionStorage.setItem('current_resource', JSON.stringify(currentUser));
// var currentUser = jQuery.parseJSON(sessionStorage.getItem('current_resource'))
//
// --> Type and Id of the selected item of the 'search all' select box
// sessionStorage.setItem('search_all_selected_id', id)
// var id = sessionStorage.getItem('search_all_selected_id')


var Master = (function () {

    var mainPageHasLoaded = false;


    /*---   A F T E R   L O A D   ---*/
    /*---   A U T H E N T I C A T I O N   ---*/
    //function logout() {
    //    alert('logging out ...');
    //    ajaxCall("Login.aspx/LogoutJSON",
    //             "",
    //             logoutCallbackOk,
    //             logoutCallbackFailed);
    //}
    //function logoutCallbackOk(result) {
    //    alert('success !!!');
    //    sessionStorage.setItem('current_resource', null);
    //    window.location.href = resolveURL("/Default.aspx");
    //}
    //function logoutCallbackFailed(msg) {
    //    alert('failed !!!');
    //    var ex = jQuery.parseJSON(msg.responseText);
    //    MessageBox.Exception(ex.Message, ex.StackTrace);
    //}


    /*---   O P E N   ---*/
    function openItem(value) {
        var pos = value.indexOf('_'),
            type = value.substring(0, pos),
            id = value.substring(pos + 1);

        //alert('Type: ' + type + '; Id: ' + id);

        sessionStorage.setItem('search_all_selected_id', id);

        switch (type) {
        case 'Parametro':
            window.location.href = UrlUtil
                .resolveURL("/Pages/Management/Parameters.aspx");
            break;
        case 'Recurso':
            window.location.href = UrlUtil
                .resolveURL("/Pages/Management/Resources.aspx");
            break;
        case 'Estado':
            window.location.href = UrlUtil
                .resolveURL("/Pages/Management/Statuses.aspx");
            break;
        case 'Projecto':
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
            valueField: 'Id',
            labelField: 'Name',
            searchField: ['Name', 'Description'],
            create: false,
            render: {
                option: function (item, escape) {
                    //                //alert(JSON.stringify(item));

                    var type_img,
                        div,
                        top_description;

                    type_img = '<span class="fa fa-';
                    switch (item.Type) {
                    case 'Parametro':
                        type_img += 'table';
                        break;
                    case 'Recurso':
                        type_img += 'male';
                        break;
                    case 'Estado':
                        type_img += 'flag';
                        break;
                    case 'Projecto':
                        type_img += 'book';
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
                    data: "{'Text':'" + query + "'}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (msg) {
                        var ex = jQuery.parseJSON(msg.responseText);
                        MessageBox.Exception(ex.Message, ex.StackTrace);
                        callback();
                    },
                    success: function (res) {
                        //alert(JSON.stringify(res.d));
                        //callback(jQuery.parseJSON(res.d).slice(0, 10));
                        callback(jQuery.parseJSON(res.d));

//                    var ddl = $("#ddlSearch");
//                    var selectize = ddl[0].selectize;
//                    $.each(jQuery.parseJSON(res.d), function () {
//                        //alert('a' + JSON.stringify(this));
//                        selectize.addOption({ Type: this.Type,
//                                              Id: this.Id,
//                                              Name: this.Name,
//                                              Description: this.Description
//                                            });
////                    });

                    }
                });
            },
            onChange: function (value) { openItem(value); },
            dropdownParent: null
        });

        // Set logged in user full name
        var currentUser = jQuery.parseJSON(sessionStorage.getItem('current_resource'));
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

}());

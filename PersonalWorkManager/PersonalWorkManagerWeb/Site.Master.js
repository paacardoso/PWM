////////////////   S E T U P   //////////////////
function setupMainPage() {
    setupMainForm();
}
function setupMainForm() {
    $('#ddlSearch').selectize({
        valueField: 'Id',
        labelField: 'Name',
        searchField: ['Name', 'Description'],
        create: false,
        render: {
            option: function (item, escape) {
                //                //alert(JSON.stringify(item));

                var type_img = '<span class="fa fa-';
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

                var div = '<div>' +
                            '<span>' +
                               type_img +
                               '<span style="font-size: 85%; font-style: bold;">' + '&nbsp;' + escape(item.Name) + '</span>';
                if (item.Description !== null) {
                    var top_description = (item.Description.length > 70 ? item.Description.substring(0, 70) + ' (...)' : item.Description);
                    div += '<span style="font-size: 75%; font-style: italic"><br>' + escape(top_description) + '</span>';
                }
                div += '</span>' +
                          '</div>';
                return div;
            }
        },
        load: function (query, callback) {
            if (!query.length) return callback();
            var site = window.location.pathname.substring(1, window.location.pathname.indexOf('/', 1));
            //alert(window.location.protocol + "//" + window.location.host + "/" + site + "/SiteMaster.asmx/SearchAllJSON");
            $.ajax({
                type: 'POST',
                url: window.location.protocol + "//" + window.location.host + "/" + site + "/SiteMaster.asmx/SearchAllJSON",
                data: "{'Text':'" + query + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (msg) {
                    var ex = jQuery.parseJSON(msg.responseText);
                    MainMessage.Exception(ex.Message, ex.StackTrace);
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
                    //                        selectize.addOption({ Type: this.Type, Id: this.Id, Name: this.Name, Description: this.Description });
                    //                    });

                }
            });
        },
        onChange: function (value) { openItem(value); },
        dropdownParent: null
    });
}


////////////////   L O A D   //////////////////
function openItem(value) {
    var pos = value.indexOf('_');
    var type = value.substring(0, pos);
    var id = value.substring(pos + 1);
    //alert('Type: ' + type + '; Id: ' + id);

    sessionStorage.setItem('search_all_selected_id', id)
    var site = window.location.pathname.substring(1, window.location.pathname.indexOf('/', 1));

    //alert(window.location.protocol + "//" + window.location.host + "/" + site + "/(...)");

    switch (type) {
        case 'Parametro':
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + site + "/Pages/Management/Parameters.aspx";
            break;
        case 'Recurso':
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + site + "/Pages/Management/Resources.aspx";
            break;
        case 'Estado':
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + site + "/Pages/Management/Statuses.aspx";
            break;
        case 'Projecto':
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + site + "/Pages/Projects.aspx";
            break;

        default:
            break;
    }
}


////////   G E N E R A L   F U N C T I O N S   //////////
function resolveURL(url) {
    var site = window.location.pathname.substring(1, window.location.pathname.indexOf('/', 1));
    return window.location.protocol + "//" + window.location.host + "/" + site + url;
}

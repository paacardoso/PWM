/*---   T A B L E   U T I L   --*/
var TableUtil = (function () {

    function getTableIndexById(tableName, id) {
        var rows = $(tableName).bootstrapTable("getData"),
            index,
            row;
        for (index = 0; index < rows.length; index += 1) {
            row = rows[index];
            //console.log("typeof row.Id: " + typeof row.Id +
            //            "; typeof id: " + typeof id);
            if (row.Id.toString() === id) {
                //console.log("table: " + tableName +
                //            "; id: " + id + "; index: " + index);
                return index;
            }
        }
        console.log("No index found for id: '" + id +
                    "' in table: '" + tableName + "'");
    }
    function actionFormatter(value, row, index) {
        return [
            '<i style="cursor: pointer;" class="edit glyphicon glyphicon-edit"></i>',
            '<i style="cursor: pointer;" class="remove glyphicon glyphicon-remove"></i>'
        ].join('');
    }
    function textFormatter(value, row, index) {
        var str,
            i = 0,
            pos,
            lastPos;
        str = value.replace(/\n/g, "<BR>");
        pos = str.indexOf("<BR>");
        lastPos = pos;
        while (pos > -1 && i <= 4) {
            lastPos = pos;
            pos = str.indexOf("<BR>", pos + 1);
            i += 1;
        }
        //console.log("i: " + i + "; pos: " + pos + "; lastPos: " + lastPos);
        if (i <= 4) {
            lastPos = str.lenght;
        }
        if (lastPos > -1) {
            return str.substring(0, lastPos) + " (...)";
        }
        return str;
    }
    function dateFormatter(value, row, index) {
        return DateUtil.Format(value);
    }
    function setToolbarBehavior(tableName, toolbarFunc) {
        $(tableName)
            .on("check.bs.table", function (e, row) {
                toolbarFunc();
            })
            .on("uncheck.bs.table", function (e, row) {
                toolbarFunc();
            })
            .on("check-all.bs.table", function (e, row) {
                toolbarFunc();
            })
            .on("uncheck-all.bs.table", function (e, row) {
                toolbarFunc();
            });
    }

    return {
        getTableIndexById: function (tableName, id) {
            return getTableIndexById(tableName, id);
        },
        actionFormatter: function (value, row, index) {
            return actionFormatter(value, row, index);
        },
        textFormatter: function (value, row, index) {
            return textFormatter(value, row, index);
        },
        dateFormatter: function (value, row, index) {
            return dateFormatter(value, row, index);
        },
        setToolbarBehavior: function (tableName, toolbarFunc) {
            return setToolbarBehavior(tableName, toolbarFunc);
        }
    };

}());



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

    return {
        getTableIndexById: function (tableName, id) {
            return getTableIndexById(tableName, id);
        }
    };

}());



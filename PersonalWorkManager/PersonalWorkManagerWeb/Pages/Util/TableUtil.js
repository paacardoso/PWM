/*---   T A B L E   U T I L   --*/
var TableUtil = (function () {

    function getTableIndexById(tableName, id) {
        var rows = $(tableName).bootstrapTable('getData'),
            index,
            row;
        for (index = 0; index < rows.length; index += 1) {
            row = rows[index];
            if (row.Id === id) {
                return index;
            }
        }
    }

    return {
        getTableIndexById: function (tableName, id) {
            return getTableIndexById(tableName, id);
        }
    };

}());



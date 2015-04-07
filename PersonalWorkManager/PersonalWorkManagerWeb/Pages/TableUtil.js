function getTableIndexById(tableName, id) {
    var rows = $(tableName).bootstrapTable('getData');
    var index;
    var row;
    for (index = 0; index < rows.length; ++index) {
        row = rows[index];
        if (row.Id == id) {
            return index;
        }
    }
}

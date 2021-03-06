function jsgrid_controller(table_name, vc, keyfields) {
  var url = "/api/" + table_name + "/";
  var fixKeys = function (item) {
    keyfields.forEach((kf) => {
      item[kf] = +item[kf];
    });
    return item;
  };
  return {
    loadData: function (filter) {
      var data = $.Deferred();
      $.ajax({
        type: "GET",
        url: url + (vc ? "?versioncount=on" : ""),
        data: filter,
      }).done(function (resp) {
        data.resolve(resp.success);
      });
      return data.promise();
    },
    insertItem: function (item) {
      var data = $.Deferred();
      $.ajax({
        type: "POST",
        url: url,
        data: item,
        headers: {
          "CSRF-Token": _sc_globalCsrf,
        },
      }).done(function (resp) {
        item._versions = 1;
        if (resp.success) {
          item.id = resp.success;
          data.resolve(fixKeys(item));
        } else {
          data.resolve();
        }
      });
      return data.promise();
    },
    updateItem: function (item) {
      var data = $.Deferred();
      $.ajax({
        type: "POST",
        url: url + item.id,
        data: item,
        headers: {
          "CSRF-Token": _sc_globalCsrf,
        },
      }).done(function (resp) {
        if (item._versions) item._versions = +item._versions + 1;
        data.resolve(fixKeys(item));
      });
      return data.promise();
    },
    deleteItem: function (item) {
      return $.ajax({
        type: "DELETE",
        url: url + item.id,
        headers: {
          "CSRF-Token": _sc_globalCsrf,
        },
      });
    },
  };
}
function DecimalField(config) {
  jsGrid.fields.number.call(this, config);
}
DecimalField.prototype = new jsGrid.fields.number({
  filterValue: function () {
    return this.filterControl.val()
      ? parseFloat(this.filterControl.val() || 0, 10)
      : undefined;
  },

  insertValue: function () {
    return this.insertControl.val()
      ? parseFloat(this.insertControl.val() || 0, 10)
      : undefined;
  },

  editValue: function () {
    return this.editControl.val()
      ? parseFloat(this.editControl.val() || 0, 10)
      : undefined;
  },
});

jsGrid.fields.decimal = jsGrid.DecimalField = DecimalField;

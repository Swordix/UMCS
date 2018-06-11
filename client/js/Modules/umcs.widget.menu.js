var menu = new BootstrapMenu('.w', {
  fetchElementData: function(w) {
    return w;
  },
   actionsGroups: [
    ['deleteObj'],
    ['Help']
  ],
  actions: { deleteObj: {
      name: 'Delete',
      iconClass: 'fa-remove',
      classNames: 'action-danger',
      onClick: function(w) {
        toastr.warning('Delete item: ' + (w[0].name).toUpperCase() +' ?<br />(click here to remove)', 'Warning!', { 
            onclick: function () { 
                var wdg = document.getElementById(w[0].id);
                    instance.removeAllEndpoints(wdg);
                    $(wdg).effect(  "fade" , function() {
                            remove_cells(w[0].id);
                            $(this).remove();
                    });     
            }
        });
      }
    }, HelpObj: {
      name: 'Help',
      iconClass: 'fa-question',
      onClick: function(id) {
        console.log(id);
      }
  }}
});
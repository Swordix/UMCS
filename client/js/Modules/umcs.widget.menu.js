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

                    var request = ajax({
                      method: 'get',
                      url: '/DELETE_WIDGET',
                      data: (JSON.stringify([{id: wdg.id}]))
                    });

                    request.then(function (response) {
                      if (response=='ok'){
                        $('.w').each(function(i,elem) {
                          var wdg_ = document.getElementById(elem.id);
                          for (var i = 0; i < wdg_.in_net.length; i++) {
                              if (wdg_.in_net[i]==wdg.id) wdg_.in_net[i] = null;
                          }
                        });

                        instance.removeAllEndpoints(wdg);
                        $(wdg).effect(  "fade" , function() {
                                remove_cells(w[0].id);
                                $(this).remove();
                        })
                      }else{
                        toastr.error(response);
                      }
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

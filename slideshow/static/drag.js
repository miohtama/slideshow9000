$(document).ready(function() {

            $('#newschool .dragme')
                .attr('draggable', 'true')
                .bind('dragstart', function(ev) {
                    var dt = ev.originalEvent.dataTransfer;
                    dt.setData("Text", "Dropped in zone!");
                    return true;
                })
                .bind('dragend', function(ev) {
                    return false;
                });

            $('#newschool .drophere')
                .bind('dragenter', function(ev) {
                    $(ev.target).addClass('dragover');
                    return false;
                })
                .bind('dragleave', function(ev) {
                    $(ev.target).removeClass('dragover');
                    return false;
                })
                .bind('dragover', function(ev) {
                    return false;
                })
                .bind('drop', function(ev) {
                    var dt = ev.originalEvent.dataTransfer;
                    alert(dt.getData('Text'));
                    return false;
                });
});
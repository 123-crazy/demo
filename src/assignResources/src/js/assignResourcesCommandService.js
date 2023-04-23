/**
 * Simple Alert service for sample command Handlers
 *
 * @module js/assignResourcesCommandService
 */
import eventBus from 'js/eventBus';
/**
 * Dummy alert.
 * @param {String} text - text to display
 */
export let alert = function (scheduleUid, ctx, dataStatus) {
    if (ctx.selected.type == 'ScheduleTask') {
        if (!ctx.selected.props.fnd0ParentTask.dbValue == "") {
            dataStatus.i18n.messageError = "请选择顶行操作";
            return;
        }
    }
    // eslint-disable-next-line no-undef
    $.ajax({
        url: "/tcsoaservice/project/assign",
        data: {
            "scheduleTaskuid": scheduleUid
        },
        type: 'POST',
        dataType: 'json',
        beforeSend: function() {
            // show progress bar or spinner
            eventBus.publish( 'progress.start' );
        },
        success: function (json) {
            
        },
        error: function (json) {
            console.error(json);
            alert(json.responseJSON.message);
        },
        complete: function(json) {
            // hide progress bar or spinner
            eventBus.publish( 'progress.end' );
            if (json.status == 200) {
                console.log("------------------------------");
                eventBus.publish( 'clickInfoEvent' );
            } else {
                dataStatus.i18n.messageError = json.message
            }
        }
    });
};

export default {
    alert: alert
};

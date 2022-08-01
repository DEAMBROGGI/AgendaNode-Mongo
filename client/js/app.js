

class EventManager {
    constructor() {
        this.urlBase = "/api"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }
  

    sessionError() {
        alert('Usuario no ha iniciado sesión') 
        window.location.href = 'http://localhost:8082/index.html'
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
            if (response == "logout") {
                this.sessionError() 
            } else {
                this.inicializarCalendario(response) 
            }
        })
    }

    eliminarEvento(evento) { 
        let eventId = evento._id 
        $.post('/api/delete/' + eventId, { id: eventId }, (response) => { 
            if (response == "logout") { 
                this.sessionError() 
            } else {
                $('.calendario').fullCalendar('removeEvents', eventId); 
                alert(response)
            }
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault() 
            let

                start = $('#start_date').val(), 
                title = $('#titulo').val(), 
                end = '',
                start_hour = '',
                end_hour = '';

            if (!$('#allDay').is(':checked')) { 
                if ($('#start_hour').val() == "" || $('#end_hour').val() == "" || $('#end_date').val() == "") {
                    alert("Complete los campos obligatorios para el evento") 
                    return 
                }
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour 
                end = end + 'T' + end_hour 
            }
            let url = this.urlBase + "/new" 
            if (title != "" && start != "") { 
                let ev = {
                    title: title,
                    start: start,
                    end: end
                }

                $.post(url, ev, (response) => {
                    
                    if (response != "logout") {
                        
                        var newEvent = {
                            _id: response._id, 
                            title: title, 
                            start: start, 
                            end: end 
                        }
                       $('.calendario').fullCalendar('renderEvent', newEvent, true) 
                     
                        alert("Evento guardado.") 
                        
                    }
                    else {
                        this.sessionError()
                    }
                })

            } else {
                alert("Complete los campos obligatorios para el evento") 
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function () {
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            } else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        var d = new Date();
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), 
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event, jsEvent) => {
                $('.delete').find('img').attr('src', "../img/trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event, jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                    this.eliminarEvento(event)
                }
                $('.delete').find('img').attr('src', "../img/trash.png");
            }
        })
    }

    actualizarEvento(evento) {

        if (evento.end === null) { 
            var start = moment(evento.start).format('YYYY-MM-DD'), 
                url = '/api/update/' + evento._id + '&' + start + '&' + start 
        } else {
            var start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'), 
                end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'), 
                url = '/api/update/' + evento._id + '&' + start + '&' + end 
        }

        var data = { 
            id: evento._id, 
            start: start, 
            end: end 
        }
        $.post(url, data, (response) => { 
            if (response == "logout") {
                this.sessionError() 
            } else {
                alert(response) 
            }
        })
    }

    cerrarSesion() {
        var url = "/api/logout", 
            data = ""; 
        $.post(url, data, (response) => {
            if (response == "logout") {
                window.location.href = "http://localhost:8082/index.html" 
            } else {
                alert("Error inesperado al cerrar sesión") 
            }
        })
    }


}

const Manager = new EventManager()

$('.logout-container').on('click', function () {
    Manager.cerrarSesion() 
})

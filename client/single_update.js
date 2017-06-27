var space = window.location.pathname;
var pieces = space.split('/');
var id = pieces[2];

$.ajax({
    method: 'GET',
    url: '/api/chirps/' + id
}).then(function(chirp) {
    $('#chirp-message').val(chirp.message);
}, function(err) {
    console.log(err);
});

$('#update-button').click(function() {
    var payload = {
        message: $('#chirp-message').val()
    }
    $.ajax({
        method: 'PUT',
        url: '/api/chirps/' + id,
        contentType: 'application/json',
        data: JSON.stringify(payload)
    }).then(function() {
        window.history.back();
    }, function(err) {
        console.log(err);
    })
});
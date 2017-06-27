var space = window.location.pathname;
var pieces = space.split('/');
var id = pieces[2];

$.ajax({
    method: 'GET',
    url: '/api/chirps/' + id
}).then(function(chirp) {
    singleChirpDiv(chirp);
});

$('#delete-btn').click(function() {
    if(confirm('Are you sure you want to delete this chirp?')) {
        deleteChirp(id);
    }
});

function singleChirpDiv(chirp) {
    var $chirpDiv = $('<div class="chirp"></div>');
    var $message = $('<p></p>');
    var $user = $('<h4></h4>');
    var $timestamp = $('<h5></h5>');
    var $buttonBlock = $('<div class="button-block"></div>');
    var $editButton = $('<button class="delete-button fancy-button">Update</button>');
    $editButton.click(function() {
        window.location.pathname = '/chirps/' + id + '/update';
    })
    
    $message.text(chirp.message);
    $user.text(chirp.userName);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());

    $buttonBlock.appendTo($editButton);
    $message.appendTo($chirpDiv);
    $user.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $editButton.appendTo($chirpDiv);
    $chirpDiv.appendTo('#singles-wrapper');
}

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE',
        url: '/api/chirps/' + id
    }).then(function() {
        window.location.replace('/chirps');
    }, function(err) {
        console.log(err);
    });
}
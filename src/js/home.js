document.querySelector('#signupButton').addEventListener('click', (e) => {
    const email = document.querySelector('#emailField').value
    const password = document.querySelector('#passwordField').value;
    const messageElem = document.querySelector('#messageField');

    fetch('/signup', {
        method: 'POST', body: JSON.stringify({ email, password }), headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then((result) => {
        document.querySelector('#passwordField').value = '';
        messageElem.innerHTML = result.msg;
    });
});

document.querySelector('#loginButton').addEventListener('click', (e) => {
    const email = document.querySelector('#emailField').value
    const password = document.querySelector('#passwordField').value;
    const messageElem = document.querySelector('#messageField');

    fetch('/login', {
        method: 'POST', body: JSON.stringify({ email, password }), headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then((result) => {
        messageElem.innerHTML = result.msg;
        if(result.msg === '') {
            window.location.href = '/app';
        }
    });
});

if(document.cookie.match(new RegExp('(^| )TOKEN=.{1,}([^;]+)'))) {
    window.location.href = '/app';
}
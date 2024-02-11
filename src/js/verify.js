document.querySelector('#verifyButton').addEventListener('click', (e) => {
    const email = document.querySelector('#emailField').value
    const password = document.querySelector('#passwordField').value;
    const code = document.querySelector('#codeField').value;
    const messageElem = document.querySelector('#messageField');

    fetch('/verify', {
        method: 'POST', body: JSON.stringify({ email, password, code }), headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then((result) => {
        document.querySelector('#passwordField').value = '';
        document.querySelector('#codeField').value = '';
        messageElem.innerHTML = result.msg;
    });
});
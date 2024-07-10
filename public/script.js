document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard.html';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('registerBtn').addEventListener('click', function() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            document.querySelector('.container').style.display = 'block';
            document.getElementById('registerContainer').style.display = 'none';
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

module.exports.login = (username, password) => {
    let users = [
        {
            username: "username1",
            password: "password1"
        },
        {
            username: "username2",
            password: "password2"
        }
    ];
    for (i=0; i < 2; i++) {
        if (users[i].username === username) {
            if (users[i].password === password) {
                return "Authenticated"
            }
        }
    }
    return "Denied";
};

module.exports.isPrime = (num) => {
    for(let i = 2; i < num; i++)
        if(num % i === 0) return "Not Prime";
    return "Prime";
};
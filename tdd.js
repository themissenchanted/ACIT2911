module.exports.login = (username, password) => {
    let users = [
        {
            username: "username",
            password: "password"
        },
        {
            username: "username1",
            password: "password1"
        }
    ];
    for (i=0; i < users.length; i++) {
        if (users[i].username === username) {
            if (users[i].password === password) {
                return "Authenticated"
            } else {
                return "Denied"}
        } else {
            return "Denied"
        }
    }
};

module.exports.isPrime = (num) => {
    for(let i = 2; i < num; i++)
        if(num % i === 0) return "Not Prime";
    return "Prime";
};
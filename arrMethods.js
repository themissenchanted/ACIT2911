module.exports.arrSum = (arr) => {
    return arr.reduce(function(a,b){
        return a + b;
    }, 0);
};

module.exports.arrayRemove = (arr, value) => {
    return arr.filter(function(ele){
        return ele != value;
    });
};

module.exports.arrRandom = (arr) => {
    const item = [];
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomItem = arr[randomIndex];
    var discount = +(Math.round((randomItem.price * 0.25) + "e+2")  + "e-2");
    randomItem.price -= +(Math.round((discount) + "e+2")  + "e-2");
    item.push(randomItem);
    return item;
};
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
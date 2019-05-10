module.exports.arrSum = (arr) => {
    return arr.reduce(function(a,b){
        return a + b
    }, 0);
};
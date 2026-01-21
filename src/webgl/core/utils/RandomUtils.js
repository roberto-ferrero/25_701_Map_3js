class RandomUtils{
    constructor (obj){
        ////console.log("(static CONSTRUCTORA)!")
    }

    static randRangeFloat(low, high) {
        // Returns a random floating-point number between two numbers.
        return Math.random()*(high-low)+low;
    }

    static randRangeInt(low, high) {
        // Returns a random integer between two numbers.
        return Math.floor(Math.random()*(high-low+1)+low);
    }
}
export default RandomUtils
class NumberUtils{
    constructor (obj){
        ////console.log("(NumberUtils.CONSTRUCTORA)!")
    }

    static clamp(num, min, max) {
        //Constrain a value to lie between two further values
        return Math.min(Math.max(num, min), max)
    }

    static lerp (start, end, amt) {
        return (1-amt)*start+amt*end
    }

    static map01Mod(value, start, end){
        // Dado un segmento min-max, y un valor dentro de ese segmento, devuelve un valor 0->1 en función de su posición relativa en ese segmento.
        const range = end-start
        let result = (value-start)/range
        result = NumberUtils.clamp(result, 0, 1)
        return result
    }
    static mapProgress(start, end, progress){
        // Sobnre una progresión de 0 a 1, se marca un inicio y un final dentro de ese ramgo 0-1.
        // Por debajo del inicio da 0. Por encima de 1.
        // En medio el valor progrees devuelv la posicion 0-1 dentro de ese rang inicial-final.
        if(progress < start){
            return 0
        }else if(progress > end){
            return 1
        }else{
            return (progress-start)/(end-start)
        }
    }


}
export default NumberUtils
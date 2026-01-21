
const EventEmitter = require('events');
class EasedOutValue{
    constructor (_value, _factor, _threshold, _updateEmitter, _eventName){
        // OPTIMEZED FOR PERFORMANCE AND LOW GC: 20251210
        // NEEDS WebGLApp update emitter to work properly adding delta time in the update
        ////console.log("(EasedOutValue.CONSTRUCTORA): "+_value)
        this.value = _value
        this.factor = _factor
        this.threshold = _threshold || 0.05
        this.updateEmitter = _updateEmitter // Instancia de EventEmitter
        //--
        //--
        this.active = false
        this.value_wanted = this.value
        this.factor_overrided = this.threshold
        //--
        this.alarmCounter = 0
        this.factorAlarms = []
        //--
        this.emitter = new EventEmitter()
        //--
        if(this.updateEmitter){
            this.updateEmitter.on(_eventName, (ctx)=>{
                this.update(ctx.delta)
            })
        }
    }
    resetValue(_value){
        this.value = _value
        this.value_wanted = this.value
    }
    add_factorAlarm(obj){
        const alarmItem = {}
        this.alarmCounter++
        alarmItem.id = "alarm_"+this.alarmCounter
        alarmItem.factor = obj.factor
        alarmItem.refValue = obj.refValue
        alarmItem.eventName = obj.eventName || "onAlarm"
        alarmItem.emitted = false
        this.factorAlarms.push(alarmItem)
    }
    set(newValue, newFactor = this.factor){
        ////console.log("(EasedOutValue.set): "+newValue +"  ("+this.value+")")
        if(newValue != this.value){
            this.factor_overrided = newFactor
            this.active = true
            if(newFactor == 1){
                this.value = newValue
            }
            this.value_wanted = newValue
        }else{
            this.active = false
        }
    }
    update(dt = 0.016){
        // UPDATE: Accept dt (default to 1/60 roughly 0.016 if undefined for safety)
        if(this.active){
            const dif = this.value_wanted - this.value
            // MATH FIX:
            // Calculate a ratio based on a target of 60 FPS
            const fpsRef = 60;
            const timeRatio = dt * fpsRef;
            // Adjust the factor exponentially to maintain consistent speed
            // If dt is high (lag/low fps), factor increases. If dt is low (120fps), factor decreases.
            const adjustedFactor = 1 - Math.pow(1 - this.factor_overrided, timeRatio);
            
            if(Math.abs(dif) <= this.threshold){
                //console.log("*1:"+dif )
                //console.log("this.value_wanted:"+this.value_wanted )
                //console.log("this.value:"+this.value )
                this.active = false
                this.factor_overrided = this.factor
                this.value = this.value_wanted
                this.emitter.emit("onFinish")
            }else{
                ////console.log("*2:"+dif)
                this.active = true
                this.value = this.value+(dif*adjustedFactor)
                this._check_factorAlarms()
            }
            ////console.log("this.value: "+this.value+"/"+this.value_wanted)
            return this.value
        }
    }
    get(){
        return this.value
    }
    //------------------------------
    _check_factorAlarms(){
        // OPTIMIZACIÓN 1: Salida rápida.
        // Si no hay alarmas, no hacemos nada. 0 asignaciones de memoria.
        if (this.factorAlarms.length === 0) return;

        // OPTIMIZACIÓN 2: Iterar al revés para poder eliminar elementos (splice)
        // sin romper los índices del bucle y sin crear arrays nuevos (alarmsAux).
        for(let i = this.factorAlarms.length - 1; i >= 0; i--){
            const alarmItem = this.factorAlarms[i]
            
            if(!alarmItem.emitted){
                const range = this.value_wanted - alarmItem.refValue
                const filteredValue = this.value - alarmItem.refValue
                
                // Evitar división por cero si range es 0 (seguridad)
                const filteredFactor = range !== 0 ? filteredValue / range : (filteredValue >= 0 ? 1 : 0);

                if(filteredFactor >= alarmItem.factor){
                    alarmItem.emitted = true
                    this.emitter.emit(alarmItem.eventName)
                    
                    // Eliminamos la alarma disparada del array original
                    this.factorAlarms.splice(i, 1)
                }
            }
        }
    }
}
export default EasedOutValue
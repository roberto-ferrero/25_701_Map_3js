
const EventEmitter = require('events');
import EasedOutValue from './EasedOutValue';

class EasedOutV3{
    constructor (_v3, _factor, _threshold, _updateEmitter, _eventName){
        ////console.log("(EasedOutV3.CONSTRUCTORA): "+_value)
        this.v3 = _v3
        this.value_x = new EasedOutValue(_v3.x, _factor, _threshold, _updateEmitter, _eventName)
        this.value_y = new EasedOutValue(_v3.y, _factor, _threshold, _updateEmitter, _eventName)
        this.value_z = new EasedOutValue(_v3.z, _factor, _threshold, _updateEmitter, _eventName)
        this.factor = _factor
        this.threshold = _threshold || 0.05
        this.updateEmitter = _updateEmitter // Instancia de EventEmitter
        //--
        //--
        this.active = false
        this.value_x_wanted = this.value
        this.value_y_wanted = this.value
        this.value_z_wanted = this.value
        this.factor_overrided = this.threshold
        //--
        this.alarmCounter = 0
        this.factorAlarms = []
        //--
        this.emitter = new EventEmitter()
        //--
        if(this.updateEmitter){
            this.updateEmitter.on(_eventName, ()=>{
                this.update()
            })
        }
    }
    resetValue(_v3){
        this.v3 = _v3
        this.value_x_wanted = this._v3.x
        this.value_y_wanted = this._v3.y
        this.value_z_wanted = this._v3.z
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
        ////console.log("(EasedOutV3.set): "+newValue +"  ("+this.value+")")
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
    update(){
        if(this.active){
            const dif = this.value_wanted - this.value
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
                this.value = this.value+(dif*this.factor_overrided)
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
        const alarmsAux = []
        for(let i=0; i<this.factorAlarms.length; i++){
            const alarmItem = this.factorAlarms[i]
            if(!alarmItem.emitted){
                const range = this.value_wanted-alarmItem.refValue
                const filteredValue = this.value-alarmItem.refValue
                const filteredFactor = filteredValue/range
                //console.log("---");
                //console.log("from: "+alarmItem.refValue+" to "+this.value_wanted);
                //console.log("range: "+range);
                //console.log("this.value: "+this.value);
                //console.log("filteredValue: "+filteredValue);
                //console.log("filteredFactor: "+filteredFactor);
                if(filteredFactor >= alarmItem.factor){
                    //console.log("!!");
                    alarmItem.emitted = true
                    this.emitter.emit(alarmItem.eventName)
                }else{
                    alarmsAux.push(alarmItem)
                }
            }
        }
        this.factorAlarms = alarmsAux
    }
}
export default EasedOutV3
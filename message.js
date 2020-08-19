const moment=require("moment")

const formatMessage=(name,msg)=>{
    return {
        name,
        time:moment().format('h:mm:a'),
        msg
    }
}

module.exports=formatMessage
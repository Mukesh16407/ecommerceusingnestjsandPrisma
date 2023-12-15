type LogLevel ='log' | 'error' | 'warn' | 'debug' | 'verbose';

enum Environment {
    Local='local',
    E2e ='e2e',
    Production='production'
}

export const loggerConfig =():LogLevel[]=>{
   switch(process.env.NODE_ENV as Environment){
    case Environment.Local:
    case Environment.E2e:
        return ['verbose', 'debug','log','warn','error'];
    case Environment.Production:
      default:
        return ['log','warn','error']
   }  
}

export const loggerWinstonConfig =():string=>{
    switch(process.env.NODE_ENV as Environment){
        case Environment.Local:
        case Environment.E2e:
            return 'debug'
        case Environment.Production:
          default:
           return 'info'
       }   
}
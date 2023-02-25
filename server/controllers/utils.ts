export function clone <T=any> (whatToClone : T) : T {
    return JSON.parse(JSON.stringify(whatToClone));
} 
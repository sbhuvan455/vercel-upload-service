export const generateRandomId = () => {
    let id = "";
    
    const availableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    
    for(let i = 0; i < 5; i++){
        const char = availableChars[Math.floor((Math.random())*(availableChars.length))];
        id += char;
    }

    return id;
}
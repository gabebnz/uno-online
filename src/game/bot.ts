
const botNames = [
    'Gabe',
    'Zac',
    'Josh',
    'Liam',
    'Albert',
    'Nick',
    'Bhumik',
    'Dylan',
    'Chris',
    'Andrew',
    'Cody',
    'Enrique',
    'Jared',
    'Thom',
    'Jonny',
    'Ed',
    'Colin',
    'Phil',
    'Milly',
]

const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const prepareBotArray = (arrayIn: string[]) => {
    let array = [...arrayIn]


    for(let i = 0; i < array.length; i++){
        array[i] = `BOT ${array[i]}`
    }
    
    shuffleArray(array)
    return array;
}

export const getBotNames = (): string[] => {
    return prepareBotArray(botNames);
}
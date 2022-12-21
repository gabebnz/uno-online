
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

const prepareBotArray = (arrayIn: string[]) => {
    let array = [...arrayIn]

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = 'BOT ', temp;
    }

    return array;
}

export const getBotNames = (): string[] => {
    return prepareBotArray(botNames);
}
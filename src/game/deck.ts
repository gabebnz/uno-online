

export type Card = {
    type: string; // number, action, wild
    color: string; // red, blue, green, yellow, wild
    value?: string; // 0-9, +2, reverse, skip, wild, +4
    playedBy?: number; // player index of who played this card, for animations

    rotation?: number;
    offsetX?:number;
    offsetY?:number;
}

const cardRotations = [5, 15, 35, 50, 75, 100, 120, 145, 170, 185, 200, 215, 230, 250, 270, 290, 310, 330, 345, 350, 360]

export const getShuffledDeck = (): Card[] => {
    // Could be better to not do this compute every time
    // is possible to load cards from json file

    const deck: Card[] = [];
    const colors = ['red', 'blue', 'green', 'yellow'];

    for (let i = 0; i < colors.length; i++) {
        // Generate single of these type for each suit
        deck.push({type: 'number', color: colors[i], value: '0'});
        deck.push({type: 'wild', color:'wild', value: 'wild'})
        deck.push({type: 'wild', color:'wild', value: '+4'})

        // Generate 2 of these types for each suit
        for(let s = 0; s < 2; s++){
            for(let n = 1; n <= 9; n++){
                deck.push({type: 'number', color: colors[i], value: n.toString()})
            }

            deck.push({type: 'action', color: colors[i], value: '+2'})
            deck.push({type: 'action', color: colors[i], value: 'skip'})
            deck.push({type: 'action', color: colors[i], value: 'reverse'})
        }
    }

    const shuffleArray = (array: Card[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const addRotations = (array: Card[]) => {
        for (let i = 0; i < array.length; i++) {
            array[i].rotation = cardRotations[Math.floor(Math.random() * cardRotations.length)]
            array[i].offsetX = Math.floor(Math.random() * 150) - 75
            array[i].offsetY = Math.floor(Math.random() * 150) - 75
        }
    }
      
    shuffleArray(deck)
    addRotations(deck)
    return deck;
}

export const cardToString = (card: Card): string => {
    // TODO: Implement this function

    // This is so we can get the string representation of a card
    // for the images
    return "not done - from deck.ts"
}


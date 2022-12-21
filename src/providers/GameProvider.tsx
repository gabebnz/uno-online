import React, { createContext, useEffect, useState } from 'react';

export interface Game {

}

interface GameProviderProps {
    children?: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = (props) => {
    

    return(
        <>
            {props.children}
        </>
    )
}
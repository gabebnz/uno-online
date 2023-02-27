import React, { useContext, useEffect } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Styles from './Help.module.css';

type Props = {
	title?: string,
}

export default function Game({ title } : Props ) {
	const redirect = useNavigate();


	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
		<div className={Styles.HelpWrapper}>
			<h1>Help / About</h1>

			<h2>About UNO</h2>
			<p>
				UNO is a multi-player card game in which the objective is to be the first player to get rid of all the cards in their hand. <br/><br/>
				Each player is dealt 7 cards and players take turn drawing cards from the deck.  If a player has a card in their hand matching the card in the discard pile, they can play that card 
				(helping to reduce the total cards in their hand).<br/><br/>  
				If the player doesn't have a matching card in their hand, they must draw another card from the deck to add to their hand (this is done automatically in uno online), which increases the total number of cards they need to get rid of to win.  
				When a player has only one card left in their hand, they must yell "UNO!," but if an opposing player notices before the original player has a chance to say "UNO," the original player must draw two cards. <br/><br/>  
				<a href='https://www.unorules.com/' target="_blank">Full rules</a>
			</p>
			
			
			<h2>Multiplayer</h2>
			<p>
				To play UNO online, you can create a game and share the lobby code or url with your friends. The lobby leader can choose to start the game if there are 2 or more players (max of 4).<br/>
				The game will automatically be filled with bots if the lobby is not full. <br/><br/>
			</p>

			<a className={Styles.GitButton} href='https://github.com/gabrielbelcher/uno-online' target="_blank">
				<AiFillGithub/>
			</a>
		</div>
	)
}
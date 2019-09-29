import React, {Component} from 'react';
import './Card.css';
import ReactCardFlip from 'react-card-flip';
import { QRCode } from "react-qr-svg";

class Card extends Component {
    constructor(){
        super();
        this.state = {
            isFlipped: false
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
      }
    
    render(){
        let {card} = this.props;
        return (
            <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical" className='card'>
                <div className='product-image' key="front" onClick={this.handleClick}>
                    <img src={card.img}></img>
                </div>
        
                <div className='qr' key="back" id="back" onClick={this.handleClick}>
                    <QRCode value={card.href}/>
                </div>
            </ReactCardFlip>
          );
    }
}

export default Card;

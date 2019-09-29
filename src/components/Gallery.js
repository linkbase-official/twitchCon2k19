import React, { Component } from 'react';
import Card from './Card.js';

import './Gallery.css'
class Gallery extends Component {
    constructor() {
        super();

        this.state = {
            expaned: false,
            cards: []
        }
        this.handleClick = this.handleClick.bind(this);
        this.getProducts = this.getProducts.bind(this);
    }
    componentDidMount() {
        window.Twitch.ext.onAuthorized((auth) => {
            console.log('The JWT that will be passed to the EBS is', auth.token);
            console.log('The channel ID is', auth.channelId);
            this.getChannels(auth.channelId);
        });
    }
    getChannels(channelId) {
        fetch('https://api.airtable.com/v0/apptcVgm2Qw2hUIWU/User?maxRecords=3&view=Grid%20view', {
            headers: {
                Authorization: "Bearer keyGsjks4OkZO7RHi",
                "Content-Type": "application/json"
            },
            method: "GET",
        })
            .then(response => response.json())
            .then((data) => {
                let channelList = data.records;
                let foundChannel = false;
                channelList.forEach( ({ fields, id }, iteration) => {
                    if (fields && fields.channel_id && fields.channel_id === channelId) {
                        console.log("Channel" + '\nID-' + fields.channel_id);
                        foundChannel = true;
                        this.getProducts(id);
                    }
                    if (iteration === channelList.length - 1 && !foundChannel) {
                        console.error("Could Not Find Matching User")
                    }
                })
            })
    }
    getProducts(channel_id) {
        console.log("channel id is", channel_id);
        fetch("https://api.airtable.com/v0/apptcVgm2Qw2hUIWU/Products?maxRecords=3&view=Grid%20view", {
            headers: {
                Authorization: "Bearer keyGsjks4OkZO7RHi",
                "Content-Type": "application/json"
            },
            method: "GET",
        })
            .then(response => response.json())
            .then((data) => {
                console.log("Success Retrieved Products", data);
                let productList = data.records;
                let cardList = [];
                productList.forEach(({ fields, id }, iteration) => {
                    if (fields && fields.channel_id && fields.channel_id[0] === channel_id) {
                        let { url, description, img_url, price, title } = fields;
                        console.log("Found Matching Product", fields.channel_id[0], url, description, img_url)
                        // addProductBoxToDom({ url, description, img_url, title, price, id });
                        cardList.push({
                            href: url,
                            img: img_url,
                            detail: description
                        })
                    }
                    if (productList.length - 1 === iteration) {
                        this.setState({
                            cards: cardList
                        })
                    }
                })
            })
            .catch((error) => {
                console.log("error", error);
            })
    }
    handleClick() {
        console.log("handling expansion");
        this.setState({ expanded: !this.state.expanded })
    }
    render() {
        let cards = this.state.cards;
        let thumbnail = cards[0] && cards[0] || { href: '', detail: '', img: '' };
        if (this.state.expanded) {
            return (
                <div className="Gallery scene">
                    <i className='fa fa-arrow-left close' onClick={this.handleClick} />
                    {cards.map((card, id) => {
                        return <Card key={id} card={card} />
                    })}
                </div>
            );
        } else {
            return (
                <div className="Gallery" onClick={this.handleClick}>
                    <Card key={0} card={thumbnail} thumbnail={true} />
                </div>
            )
        }

    }
}

export default Gallery;

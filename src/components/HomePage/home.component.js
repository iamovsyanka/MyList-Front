import React, {Component} from "react";
import "./style.css"
import sample from '../../static/home.mp4';

export default class Home extends Component {
    render() {
        return(
            <div className="home">
                <h3>To do list:<br/>&#9745; Sleep</h3>
                <video className='videoTag' autoPlay loop muted>
                    <source src={sample} type='video/mp4' />
                </video>
            </div>
        );
    }

}

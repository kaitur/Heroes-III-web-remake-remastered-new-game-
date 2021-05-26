import React from 'react';
import "./Tactic.css";

export default class Tactic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
          }
        this.canvasWidth_ = 0;
        this.canvasHeight_ = 0;
        let sideCoef = document.documentElement.clientWidth / document.documentElement.clientHeight;
        if (sideCoef > 1) {
            this.canvasHeight_ = document.documentElement.clientHeight;
            this.canvasWidth_ = this.canvasHeight_ * 4 / 3;
        }
        else {
            this.canvasWidth_ = document.documentElement.clientWidth;
            this.canvasHeight_ = this.canvasWidth_ * 3 / 4;
        }

        this.canvasNewCoordX = (document.documentElement.clientWidth - this.canvasWidth_) / 2;
        this.canvasNewCoordY = (document.documentElement.clientHeight - this.canvasHeight_) / 2;

    }
    componentDidMount() {
        this.setState({
            canvasSize: { canvasWidth: this.canvasWidth_, canvasHeight: this.canvasHeight_ }
        })
        let newCanvasWidth = this.canvasWidth_ + this.canvasNewCoordX;
        let newCanvasHeight = this.canvasHeight_ + this.canvasNewCoordY;

        this.canBack.width = newCanvasWidth;
        this.canBack.height = newCanvasHeight;
        let ctx = this.canBack.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);

        this.canGrid.width = newCanvasWidth;
        this.canGrid.height = newCanvasHeight;
        ctx = this.canGrid.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);

        this.canFill.width = newCanvasWidth;
        this.canFill.height = newCanvasHeight;
        ctx = this.canFill.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);

        this.canMove.width = newCanvasWidth;
        this.canMove.height = newCanvasHeight;
        ctx = this.canMove.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);

        this.canSel.width = newCanvasWidth;
        this.canSel.height = newCanvasHeight;
        ctx = this.canSel.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);

        this.canObj.width = newCanvasWidth;
        this.canObj.height = newCanvasHeight;
        ctx = this.canObj.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);

        this.canInt.width = newCanvasWidth;
        this.canInt.height = newCanvasHeight;
        ctx = this.canInt.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);

        this.canWin.width = newCanvasWidth;
        this.canWin.height = newCanvasHeight;
        ctx = this.canWin.getContext("2d");
        ctx.translate(this.canvasNewCoordX, this.canvasNewCoordY);


        let img = new Image();
        img.src = "battle background/CmBkDes.png";
        img.onload = () => { this.drawBackground(img, this.canBack) };
    }

    drawBackground(img, canvasID) {
        const ctx = canvasID.getContext("2d");
        ctx.drawImage(img, 0, 0, this.canBack.width, this.canBack.height);
    }

    render() {
        return (
            <div>
                <canvas ref={canBack => this.canBack = canBack}> </canvas>
                <canvas ref={canGrid => this.canGrid = canGrid}> </canvas>
                <canvas ref={canFill => this.canFill = canFill} onMouseMove={this.handleMouseMove} onClick={this.handleClick}> </canvas>
                <canvas ref={canMove => this.canMove = canMove} onMouseMove={this.handleMouseMove} onClick={this.handleClick}> </canvas>
                <canvas ref={canSel => this.canSel = canSel}> </canvas>
                <canvas ref={canObj => this.canObj = canObj}> </canvas>
                <canvas ref={canInt => this.canInt = canInt}> </canvas>
                <canvas ref={canWin => this.canWin = canWin}> </canvas>
            </div>
        )
    }
}
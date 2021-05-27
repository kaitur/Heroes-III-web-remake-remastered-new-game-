import React from 'react';
import "./Tactic.css";

export default class Tactic extends React.Component {

    constructor(props) {
        super(props);
        this.canWinHandleMouseMove = this.canWinHandleMouseMove.bind(this);
        this.canWinHandleMouseClick = this.canWinHandleMouseClick.bind(this);
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

        this.canvasX = (document.documentElement.clientWidth - this.canvasWidth_) / 2;
        this.canvasY = (document.documentElement.clientHeight - this.canvasHeight_) / 2;
        this.canvasWidth = this.canvasWidth_ + this.canvasX;
        this.canvasHeight = this.canvasHeight_ + this.canvasY;

        this.gridColor = "#90FF84";
        this.ySize = 1.1;
        this.gridWidth = 15;
        this.gridHeight = 11;
        this.hexWidth = 74;
        this.hexHeight = 2 * Math.sqrt(3) / 3 * this.hexWidth * this.ySize;
        this.gridX = (this.canvasWidth_ - 15.5 * this.hexWidth) / 2 + this.hexWidth / 2;
        this.gridY = -this.hexHeight / 4 + this.canvasHeight_ * 0.14;

        this.currHex = this.Point(0, 0);
    }

    componentDidMount() {
        this.setState({
            canvasSize: { canvasWidth: this.canvasWidth_, canvasHeight: this.canvasHeight_ }
        })

        this.canBack.width = this.canvasWidth;
        this.canBack.height = this.canvasHeight;
        let ctx = this.canBack.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        this.canGrid.width = this.canvasWidth;
        this.canGrid.height = this.canvasHeight;
        ctx = this.canGrid.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        this.canFill.width = this.canvasWidth;
        this.canFill.height = this.canvasHeight;
        ctx = this.canFill.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        this.canMove.width = this.canvasWidth;
        this.canMove.height = this.canvasHeight;
        ctx = this.canMove.getContext("2d");
        ctx.translate(this.anvasNewCoordX, this.canvasY);

        this.canSel.width = this.canvasWidth;
        this.canSel.height = this.canvasHeight;
        ctx = this.canSel.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        this.canObj.width = this.canvasWidth;
        this.canObj.height = this.canvasHeight;
        ctx = this.canObj.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        this.canInt.width = this.canvasWidth;
        this.canInt.height = this.canvasHeight;
        ctx = this.canInt.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        this.canWin.width = this.canvasWidth;
        this.canWin.height = this.canvasHeight;
        ctx = this.canWin.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        let img = new Image();
        //img.src = "battle background/CmBkDes.png";
        img.src = "battle background/backCheck.png";
        img.onload = () => { this.drawImageCan(img, this.canBack) };

        this.drawGrid(this.canGrid);
    }

    drawGrid(canvasID) {
        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                this.drawHex(canvasID, this.Point(j, i), "red");
                this.drawHex(canvasID, this.Point(j, i), this.gridColor);
            }
        }
    }

    drawHex(canvasID, index, color) {
        let coord = this.indexToPixel(index);

        let start = this.Point(coord.x, coord.y - (this.hexHeight / 2));
        let end = this.Point(coord.x - this.hexWidth / 2, coord.y - (this.hexHeight / 4));
        this.drawLineCan(canvasID, start, end, color, 2);

        start = end;
        end = this.Point(coord.x - this.hexWidth / 2, coord.y + (this.hexHeight / 4));
        this.drawLineCan(canvasID, start, end, color, 2);

        start = end;
        end = this.Point(coord.x, coord.y + (this.hexHeight / 2));
        this.drawLineCan(canvasID, start, end, color, 2);

        start = end;
        end = this.Point(coord.x + this.hexWidth / 2, coord.y + (this.hexHeight / 4));
        this.drawLineCan(canvasID, start, end, color, 2);

        start = end;
        end = this.Point(coord.x + this.hexWidth / 2, coord.y - (this.hexHeight / 4));
        this.drawLineCan(canvasID, start, end, color, 2);

        start = end;
        end = this.Point(coord.x, coord.y - (this.hexHeight / 2));
        this.drawLineCan(canvasID, start, end, color, 2);
    }

    drawLineCan(canvasID, start, end, color, lineWidth) {
        const ctx = canvasID.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(start.x, start.y);
        ctx.strokeStyle = color;
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    drawImageCan(img, canvasID) {
        const ctx = canvasID.getContext("2d");
        ctx.drawImage(img, 0, 0, this.canvasWidth_, this.canvasHeight_);
    }

    Point(x, y) {
        return { x: x, y: y }
    }

    indexToPixel(i) {
        return this.Point(
            this.gridX + i.x * this.hexWidth + (i.y + 1) % 2 * this.hexWidth / 2,
            this.gridY + i.y * this.hexHeight * 3 / 4 + this.hexHeight * 3 / 4
        );
    }

    pixelToIndex(p) {
        return this.Point(
            Math.floor((p.x) / this.hexWidth),
            Math.floor((p.pageY) / this.hexHeight)
        );
    }

    Distance(p1, p2) {
        return Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2));
    }

    MouseIndex(mouse) {
        mouse.x -= this.gridX + this.canvasX - this.hexWidth / 2;
        mouse.y -= this.gridY + this.canvasY + this.hexHeight / 4;
        let base = this.Point(0, 0);
        base.y = Math.floor(mouse.y / (this.hexHeight * 3 / 4));
        base.x = Math.floor((mouse.x - (((base.y + 1) % 2) * (this.hexWidth / 2))) / this.hexWidth);

        let px;
        let py1;
        let py2;

        mouse.x += this.gridX - this.hexWidth / 2;
        mouse.y += this.gridY + this.hexHeight / 4;
        if (mouse.x > this.indexToPixel(base).x) {
            px = this.Point(base.x + 1, base.y);
        }
        else {
            px = this.Point(base.x - 1, base.y);
        }
        if (mouse.y > this.indexToPixel(base).y) {
            py1 = this.Point(base.x, base.y + 1);
            py2 = this.Point(base.x + 1, base.y + 1);
        }
        else {
            py1 = this.Point(base.x, base.y - 1);
            py2 = this.Point(base.x + 1, base.y - 1);
        }
        if ((base.y + 1) % 2 == 0) {
            py1.x--;
            py2.x--;
        }

        //this.drawGrid(this.canGrid);
        //this.drawHex(this.canGrid, base, "blue");
        //this.drawHex(this.canGrid, px, "red");
        //this.drawHex(this.canGrid, py1, "red");
        //this.drawHex(this.canGrid, py2, "red");

        let result = base;
        if (this.Distance(this.indexToPixel(px), mouse) < this.Distance(this.indexToPixel(result), mouse))
            result = px;
        if (this.Distance(this.indexToPixel(py1), mouse) < this.Distance(this.indexToPixel(result), mouse))
            result = py1;
        if (this.Distance(this.indexToPixel(py2), mouse) < this.Distance(this.indexToPixel(result), mouse))
            result = py2;
        //return this.Point(0, 0);
        return result;
    }

    canWinHandleMouseMove(e) {
        if (true) {
            let newHex = this.MouseIndex(this.Point(e.pageX, e.pageY));
            if (this.currHex !== this.newHex && newHex.y >= 0 && newHex.y < this.gridHeight && newHex.x >= 0 && newHex.x < this.gridWidth)
            {
                this.drawHex(this.canGrid, this.currHex, this.gridColor);
                this.currHex = newHex;
                this.drawHex(this.canGrid, this.currHex, "red");
            }
        }
        else {
            this.canIntHandleMouseMove(e);
            this.canGridHandleMouseMove(e);
        }
    }

    canIntHandleMouseMove(e) {

    }

    canGridHandleMouseMove(e) {

    }

    canWinHandleMouseClick(e) {
        if (false) {
            
        }
        else {
            this.canIntHandleMouseClick(e);
            this.canGridHandleMouseClick(e);
        }
    }

    canIntHandleMouseClick(e) {

    }

    canGridHandleMouseClick(e) {

    }

    render() {
        return (
            <div>
                <canvas ref={canBack => this.canBack = canBack}> </canvas>
                <canvas ref={canGrid => this.canGrid = canGrid}> </canvas>
                <canvas ref={canFill => this.canFill = canFill}> </canvas>
                <canvas ref={canMove => this.canMove = canMove}> </canvas>
                <canvas ref={canSel => this.canSel = canSel}> </canvas>
                <canvas ref={canObj => this.canObj = canObj}> </canvas>
                <canvas ref={canInt => this.canInt = canInt}> </canvas>
                <canvas ref={canWin => this.canWin = canWin} onMouseMove={this.canWinHandleMouseMove} onClick={this.canWinHandleMouseClick}> </canvas>
            </div>
        )
    }
}
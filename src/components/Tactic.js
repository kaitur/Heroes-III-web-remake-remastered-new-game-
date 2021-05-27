import React from 'react';
import "./Tactic.css";

class Objects {
    constructor(speed_, color_) {
        this.speed = speed_;
        this.color = color_;
    }
}

export default class Tactic extends React.Component {

    constructor(props) {
        super(props);
        this.canWinHandleMouseMove = this.canWinHandleMouseMove.bind(this);
        this.canWinHandleMouseClick = this.canWinHandleMouseClick.bind(this);
        this.state = {

        }
        this.canvasWidth_ = 0;
        this.canvasHeight_ = 0;
        let sideCoef = window.innerWidth / window.innerHeight;
        if (sideCoef > 1) {
            this.canvasHeight_ = window.innerHeight;
            this.canvasWidth_ = this.canvasHeight_ * 4 / 3;
        }
        else {
            this.canvasWidth_ = window.innerWidth;
            this.canvasHeight_ = this.canvasWidth_ * 3 / 4;
        }

        this.canvasX = (window.innerWidth - this.canvasWidth_) / 2;
        this.canvasY = (window.innerHeight - this.canvasHeight_) / 2;
        this.canvasWidth = this.canvasWidth_ + this.canvasX;
        this.canvasHeight = this.canvasHeight_ + this.canvasY;

        this.gridColor = "#90FF84";
        this.ySize = 1.1;
        this.gridWidth = 15;
        this.gridHeight = 11;
        this.hexWidth = this.canvasWidth_ / 18.15;
        this.hexHeight = 2 * Math.sqrt(3) / 3 * this.hexWidth * this.ySize;
        this.gridX = (this.canvasWidth_ - 15.5 * this.hexWidth) / 2 + this.hexWidth / 2;
        this.gridY = -this.hexHeight / 4 + this.canvasHeight_ * 0.14;

        this.currHex = this.Point(0, 0);
        this.objects = [];
        for (let i = 0; i < 15; i++)
            this.objects[i] = [];
        this.objects[0][9] = new Objects(5, "red");
        this.objects[2][1] = new Objects(5, "yellow");
        this.objects[5][4] = new Objects(5, "blue");
        this.objects[3][1] = new Objects(5, "lime");
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

        this.DI(this.canBack, "battle background/CmBkDes.png", 0, 0, this.canvasWidth_, this.canvasHeight_);
        this.DI(this.canInt, "https://i.ibb.co/Y7rBY7W/Frame.png", 0, 0, this.canvasWidth_, this.canvasHeight_);

        this.drawGrid(this.canGrid);
        this.drawObjects(this.canObj);
    }

    DI(canvasID, image, x, y, width, height) {
        let img = new Image();
        img.src = image;
        img.onload = () => { this.drawImageCan(canvasID, img, x, y, width, height) };
    }

    drawImageCan(canvasID, img, x ,y, width, height) {
        const ctx = canvasID.getContext("2d");
        ctx.drawImage(img, x, y, width, height);
    }

    drawGrid(canvasID) {
        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                this.drawHex(canvasID, this.Point(j, i), this.gridColor);
            }
        }
    }

    drawObjects(canvasID) {
        this.clearCan(this.canObj);
        for (let i = 0; i < 15; i++)
            for (let j = 0; j < 11; j++)
                if (this.objects[i][j])
                    this.drawFillHex(canvasID, this.Point(i, j), this.objects[i][j].color);
    }

    drawHex(canvasID, index, color) {
        let coord = this.indexToPixel(index);
        let points = [];

        points[0] = this.Point(coord.x, coord.y - (this.hexHeight / 2));
        points[1] = this.Point(coord.x - this.hexWidth / 2, coord.y - (this.hexHeight / 4));
        points[2] = this.Point(coord.x - this.hexWidth / 2, coord.y + (this.hexHeight / 4));
        points[3] = this.Point(coord.x, coord.y + (this.hexHeight / 2));
        points[4] = this.Point(coord.x + this.hexWidth / 2, coord.y + (this.hexHeight / 4));
        points[5] = this.Point(coord.x + this.hexWidth / 2, coord.y - (this.hexHeight / 4));
        points[6] = this.Point(coord.x, coord.y - (this.hexHeight / 2));

        for (let i = 0; i < 6; i++)
            this.drawLineCan(canvasID, points[i], points[i + 1], color, 2);
    }

    drawFillHex(canvasID, index, color) {
        const ctx = canvasID.getContext("2d");

        let coord = this.indexToPixel(index);
        let points = [];

        points[0] = this.Point(coord.x, coord.y - (this.hexHeight / 2));
        points[1] = this.Point(coord.x - this.hexWidth / 2, coord.y - (this.hexHeight / 4));
        points[2] = this.Point(coord.x - this.hexWidth / 2, coord.y + (this.hexHeight / 4));
        points[3] = this.Point(coord.x, coord.y + (this.hexHeight / 2));
        points[4] = this.Point(coord.x + this.hexWidth / 2, coord.y + (this.hexHeight / 4));
        points[5] = this.Point(coord.x + this.hexWidth / 2, coord.y - (this.hexHeight / 4));
        points[6] = this.Point(coord.x, coord.y - (this.hexHeight / 2));

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i <= 6; i++)
            ctx.lineTo(points[i].x, points[i].y);

        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
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

    clearCan(canvasID) {
        const ctx = canvasID.getContext("2d");
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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

    distance(p1, p2) {
        return Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2));
    }

    mouseIndex(mouse) {
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
        if ((base.y + 1) % 2 === 0) {
            py1.x--;
            py2.x--;
        }

        //this.drawGrid(this.canGrid);
        //this.drawHex(this.canGrid, base, "blue");
        //this.drawHex(this.canGrid, px, "red");
        //this.drawHex(this.canGrid, py1, "red");
        //this.drawHex(this.canGrid, py2, "red");

        let result = base;
        if (this.distance(this.indexToPixel(px), mouse) < this.distance(this.indexToPixel(result), mouse))
            result = px;
        if (this.distance(this.indexToPixel(py1), mouse) < this.distance(this.indexToPixel(result), mouse))
            result = py1;
        if (this.distance(this.indexToPixel(py2), mouse) < this.distance(this.indexToPixel(result), mouse))
            result = py2;
        //return this.Point(0, 0);
        return result;
    }

    canWinHandleMouseMove(e) {
        if (false) {

        }
        else {
            this.canIntHandleMouseMove(e);
            this.gridHandleMouseMove(e);
        }
    }

    canIntHandleMouseMove(e) {

    }

    gridHandleMouseMove(e) {
        let newHex = this.mouseIndex(this.Point(e.pageX, e.pageY));
        if (this.currHex !== this.newHex) {
            this.clearCan(this.canSel);
            this.currHex = newHex;
            if (newHex.y >= 0 && newHex.y < this.gridHeight && newHex.x >= 0 && newHex.x < this.gridWidth) {
                this.drawFillHex(this.canSel, this.currHex, "black");
            }
        }
    }

    canWinHandleMouseClick(e) {
        if (false) {

        }
        else {
            this.canIntHandleMouseClick(e);
            this.gridHandleMouseClick(e);
        }
    }

    canIntHandleMouseClick(e) {

    }

    gridHandleMouseClick(e) {
        if (this.currHex.y >= 0 && this.currHex.y < this.gridHeight && this.currHex.x >= 0 && this.currHex.x < this.gridWidth)
            this.objects[this.currHex.x][this.currHex.y] = new Objects(1, "white");
        this.drawObjects(this.canObj);
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
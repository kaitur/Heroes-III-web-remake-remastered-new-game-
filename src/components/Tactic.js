import React from 'react';
import "./Tactic.css";

class Objects {
    constructor(x, y, speed_, image, double_, flying_, playerId_) {
        this.speed = speed_;
        this.imageLink = image;
        this.doubleCell = double_;
        this.canMove = [];
        this.flying = flying_;
        this.playerId = playerId_;
        //this.canMove[0] = { x: x - 1, y: y + 0 };
        //this.canMove[1] = { x: x - 1, y: y + 1 };
    }
}

export default class Tactic extends React.Component {

    constructor(props) {
        super(props);
        this.canWinHandleMouseClick = this.canWinHandleMouseClick.bind(this);
        this.canWinHandleMouseMove = this.canWinHandleMouseMove.bind(this);
        this.canWinHandleMouseDown = this.canWinHandleMouseDown.bind(this);
        this.canWinHandleMouseUp = this.canWinHandleMouseUp.bind(this);
        this.handleServerMessage = this.handleServerMessage.bind(this);

        this.buttonComputer = false;
        this.buttonSurrender = false;
        this.buttonRetreat = false;
        this.buttonAutoFight = false;
        this.buttonConsoleUp = false;
        this.buttonConsoleDown = false;
        this.buttonSpellBook = false;
        this.buttonWait = false;
        this.buttonHoldPosition = false;

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
        /*this.objects[3][4] = new Objects(3, 4, 3, "https://i.ibb.co/j8qr53X/pess.png", false);
        this.objects[4][9] = new Objects(4, 9, 5, "https://i.ibb.co/smx7dvv/Archer.png", false);
        this.objects[11][7] = new Objects(11, 7, 3, "https://i.ibb.co/zV0VBTQ/Champion.png", true);*/

        this.window = false;
        this.unit = this.canvasHeight_ / 600;

        let scheme = document.location.protocol === "https:" ? "wss" : "ws";
        let connectionUrl = scheme + "://10.0.0.81:5000/ws";
        console.log(document.location.hostname);
        this.socket = new WebSocket(connectionUrl);
        this.socket.onmessage = this.handleServerMessage;

        this.currObj = this.Point(0, 0);

        this.firstLoadReady = false;
        this.turn = false;
    }

    componentDidMount() {
        this.setState({
            canvasSize: { canvasWidth: this.canvasWidth_, canvasHeight: this.canvasHeight_ }
        })

        this.canTemp.width = this.canvasWidth;
        this.canTemp.height = this.canvasHeight;
        let ctx = this.canTemp.getContext("2d");
        ctx.translate(this.canvasX, this.canvasY);

        this.canBack.width = this.canvasWidth;
        this.canBack.height = this.canvasHeight;
        ctx = this.canBack.getContext("2d");
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
        this.DI(this.canInt, "https://i.ibb.co/kGK4GmT/game-Frame.png", 0, 0, this.canvasWidth_, this.canvasHeight_);

        this.drawGrid(this.canGrid);
        this.drawObjects(this.canObj);

        let cursor = "https://i.ibb.co/R47FfMb/Cursor-Default.png";
        this.changeCursor(cursor);
    }

    changeCursor(link) {
        document.body.style.cursor = "url(" + link + "), auto";
    }

    DI(canvasID, image, x, y, width, height) {
        let img = new Image();
        img.src = image;
        img.onload = () => { this.drawImageCan(canvasID, img, x, y, width, height) };
    }

    drawImageCan(canvasID, img, x, y, width, height) {
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
        this.clearCan(this.canFill);
        /*let canvas_ = document.createElement('canvas');
        canvas_.width = this.canvasWidth_;
        canvas_.height = this.canvasHeight_;*/
        for (let i = 0; i < 15; i++)
            for (let j = 0; j < 11; j++) {
                if (this.objects[i][j]) {
                    console.log("chuhnyaaaa");
                    console.log(this.currObj);
                    console.log(this.Point(i, j));
                    console.log(this.currObj.x == i && this.currObj.y == j);
                    if (this.currObj.x == i && this.currObj.y == j)
                        for (let x = 0; this.objects[i][j].canMove[x]; x++) {
                            this.drawFillHex(this.canFill, this.objects[i][j].canMove[x], "black");
                            console.log(this.objects[i][j]);
                            console.log(this.objects[i][j].canMove[x]);
                        }

                    let img = new Image();
                    img.src = this.objects[i][j].imageLink;
                    let coord = this.indexToPixel(this.Point(i, j));
                    coord.x -= this.hexWidth / 2;
                    coord.y -= this.hexHeight;
                    let size = this.Point(this.hexWidth * 1.25, this.hexHeight * 1.25);
                    if (this.objects[i][j].doubleCell)
                        size.x *= 2;
                    img.onload = () => { this.drawImageCan(canvasID, img, coord.x, coord.y, size.x, size.y) };

                    //const ctx = this.canObj.getContext("2d");
                    //ctx.drawImage(this.canTemp, 0, 0);
                    this.drawFillHex(canvasID, this.Point(i, j), "blue");
                    if (this.objects[i][j].doubleCell)
                        this.drawFillHex(canvasID, this.Point(i + 1, j), "blue");
                }
            }
        //this.clearCan(this.canTemp);
        //console.log("cleared");
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

        let base2;

        mouse.x += this.gridX - this.hexWidth / 2;
        mouse.y += this.gridY + this.hexHeight / 4;
        if (mouse.x > this.indexToPixel(base).x)
            if (mouse.y > this.indexToPixel(base).y)
                base2 = this.Point(base.x + 1, base.y + 1);
            else
                base2 = this.Point(base.x + 1, base.y - 1);
        else
            if (mouse.y > this.indexToPixel(base).y)
                base2 = this.Point(base.x, base.y + 1);
            else
                base2 = this.Point(base.x, base.y - 1);
        if ((base.y + 1) % 2 === 0)
            base2.x--;

        if (this.distance(this.indexToPixel(base), mouse) < this.distance(this.indexToPixel(base2), mouse))
            return base;
        return base2;
    }

    canWinHandleMouseMove(e) {
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(638) && e.pageX < this.canvasX + this.units(688)) {
            let cursor = "https://i.ibb.co/562q352/Cursor-Spell-Book-3.png";
            this.changeCursor(cursor);
        }
        else {
            let cursor = "https://i.ibb.co/R47FfMb/Cursor-Default.png";
            this.changeCursor(cursor);
            if (!this.window) {
                //this.canIntHandleMouseMove(e);
                this.gridHandleMouseMove(e);
            }
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
        if (newHex.y >= 0 && newHex.y < this.gridHeight && newHex.x >= 0 && newHex.x < this.gridWidth && (this.objects[this.currHex.x][this.currHex.y] || this.currHex.x > 0 && this.objects[this.currHex.x - 1][this.currHex.y] && this.objects[this.currHex.x - 1][this.currHex.y].doubleCell)) {
            let cursor = "https://i.ibb.co/562q352/Cursor-Spell-Book-3.png";
            this.changeCursor(cursor);
        }
        else {
            let cursor = "https://i.ibb.co/R47FfMb/Cursor-Default.png";
            this.changeCursor(cursor);
        }
    }

    units(u) {
        return this.unit * u;
    }

    canWinHandleMouseClick(e) {
        this.canIntHandleMouseClick(e);
    }

    canWinHandleMouseDown(e) {
        if (false) {

        }
        else {
            if (!this.window) {
                this.canIntHandleMouseDown(e);
            }
        }
    }

    canWinHandleMouseUp(e) {
        if (false) {

        }
        else {
            if (!this.window) {
                this.gridHandleMouseClick(e);
                this.canIntHandleMouseUp(e);
            }
        }
    }

    canIntHandleMouseClick(e) {

    }

    canIntHandleMouseDown(e) {
        //Button-SpellBook
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(638) && e.pageX < this.canvasX + this.units(688)) {
            this.DI(this.canInt, "https://i.ibb.co/crrjW6L/Button-Spell-Book.png", this.units(645), this.units(560), this.units(47), this.units(37));
            this.buttonSpellBook = true;
        }
        //Button-Wait
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(690) && e.pageX < this.canvasX + this.units(740)) {
            this.DI(this.canInt, "https://i.ibb.co/kSTDkRg/Button-Wait.png", this.units(697), this.units(562), this.units(45), this.units(33));
            this.buttonWait = false;
        }

        //Button-HoldPosition
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(742) && e.pageX < this.canvasX + this.units(792)) {
            this.DI(this.canInt, "https://i.ibb.co/zmwnXpk/Button-Hold-Position.png", this.units(747), this.units(561), this.units(45), this.units(35));
            this.buttonHoldPosition = false;
        }

        //Button-AutoFight
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(157) && e.pageX < this.canvasX + this.units(206)) {
            this.DI(this.canInt, "https://i.ibb.co/NYg5Ddg/Button-Auto-Fight.png", this.units(160), this.units(562), this.units(45), this.units(34));
            this.buttonAutoFight = false;
        }

        //Button-Retreat
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(105) && e.pageX < this.canvasX + this.units(155)) {
            this.DI(this.canInt, "https://i.ibb.co/QDbcgds/Button-Retreat.png", this.units(109), this.units(562), this.units(45), this.units(34));
            this.buttonRetreat = true;
        }

        //Button-Surrender
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(57) && e.pageX < this.canvasX + this.units(104)) {
            this.DI(this.canInt, "https://i.ibb.co/jgNgvRD/Button-Surrender.png", this.units(58), this.units(562), this.units(46), this.units(34));
            this.buttonSurrender = false;
        }

        //Button-Computer
        if (e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(6) && e.pageX < this.canvasX + this.units(54)) {
            this.DI(this.canInt, "https://i.ibb.co/6YvBSM4/Button-Computer.png", this.units(7), this.units(562), this.units(46), this.units(34));
            this.buttonComputer = true;
        }
    }

    canIntHandleMouseUp(e) {
        if (this.buttonSpellBook && e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(638) && e.pageX < this.canvasX + this.units(688)) {
            if (this.window) {
                this.clearCan(this.canWin);
            }
            else {
                this.DI(this.canWin, "https://i.ibb.co/F4fJWZ2/Spellbook.png", (this.canvasWidth_ * (1 / 2)) * (1 / 2), ((this.canvasHeight_ * (2 / 3)) * (1 / 2)) / 2, this.canvasWidth_ * (1 / 2), this.canvasHeight_ * (2 / 3));
            }
            this.window = !this.window;
        }

        if (this.buttonComputer && e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(6) && e.pageX < this.canvasX + this.units(54)) {
            if (this.window) {
                this.clearCan(this.canWin);
            }
            else {
                this.DI(this.canWin, "https://i.ibb.co/QXKbPFF/window-Computer.png", (this.canvasWidth_ * (1 / 2)) * (1 / 2), ((this.canvasHeight_ * (2 / 3)) * (1 / 2)) / 2, this.canvasWidth_ * (1 / 2), this.canvasHeight_ * (2 / 3));
            }
            this.window = !this.window;
        }

        if (this.buttonRetreat && e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(105) && e.pageX < this.canvasX + this.units(155)) {
            if (this.window) {
                this.clearCan(this.canWin);
            }
            else {
                this.DI(this.canWin, "https://i.ibb.co/vzYt0Mb/windows-Retreat.png", (this.canvasWidth_ * (1 / 3)), (this.canvasHeight_ * 1 / 3), 415, 207);
            }
            this.window = !this.window;
        }

        if (this.buttonWait && e.pageY > this.canvasY + this.units(556) && e.pageY < this.canvasY + this.units(600) && e.pageX > this.canvasX + this.units(690) && e.pageX < this.canvasX + this.units(740)) {
            this.socket.send(JSON.stringify({ conType: 'Wait' }));
        }

        this.buttonComputer = false;
        this.buttonSurrender = false;
        this.buttonRetreat = false;
        this.buttonAutoFight = false;
        this.buttonConsoleUp = false;
        this.buttonConsoleDown = false;
        this.buttonSpellBook = false;
        this.buttonWait = false;
        this.buttonHoldPosition = false;

        this.clearCan(this.canInt);
        this.DI(this.canInt, "https://i.ibb.co/kGK4GmT/game-Frame.png", 0, 0, this.canvasWidth_, this.canvasHeight_);
    }

    gridHandleMouseClick(e) {
        //if (this.turn == 0) {

        if (this.turn && this.currHex.y >= 0 && this.currHex.y < this.gridHeight && this.currHex.x >= 0 && this.currHex.x < this.gridWidth) {
            let p = this.Point(this.currHex.x, this.currHex.y);
            console.log("loh <p");
            console.log(p);
            this.socket.send(JSON.stringify(p));
            // }
        }
    }

    handleServerMessage(e) {
        console.log("loh");
        let con = JSON.parse(e.data);
        console.log(con.conType);
        switch (con.conType) {
            case "Move": {
                this.objects[con.point.x][con.point.y] = this.objects[this.currObj.x][this.currObj.y];
                this.objects[this.currObj.x][this.currObj.y] = null;
                this.currObj.x = con.point.x;
                this.currObj.y = con.point.y;
                this.drawObjects(this.canObj);
                //this.turn = !this.turn;
                console.log("move get");
                break;
            }
            case "InitialState": {
                this.turn = con.turn == 0 ? true : false;
                this.firstLoadReady = true;
                console.log(this.objects);
                this.objects = con.Base;
                console.log(con.Base);
                console.log(this.objects);
                this.drawObjects(this.canObj);
                break;
            }
            case "Turn": {
                this.turn = con.isHoding;
                this.currObj = con.activeSquad;
                console.log(this.currObj);
                break;
            }
        }


    }

    render() {
        return (
            <div>
                <canvas ref={canTemp => this.canTemp = canTemp}> </canvas>
                <canvas ref={canBack => this.canBack = canBack}> </canvas>
                <canvas ref={canGrid => this.canGrid = canGrid}> </canvas>
                <canvas ref={canFill => this.canFill = canFill}> </canvas>
                <canvas ref={canMove => this.canMove = canMove}> </canvas>
                <canvas ref={canSel => this.canSel = canSel}> </canvas>
                <canvas ref={canObj => this.canObj = canObj}> </canvas>
                <canvas ref={canInt => this.canInt = canInt}> </canvas>
                <canvas ref={canWin => this.canWin = canWin} onMouseMove={this.canWinHandleMouseMove} onClick={this.canWinHandleMouseClick} onMouseDown={this.canWinHandleMouseDown} onMouseUp={this.canWinHandleMouseUp}> </canvas>
            </div>
        )
    }
}
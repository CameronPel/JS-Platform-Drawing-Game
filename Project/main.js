//BASE ENGINE INSPIRED BY AND MODIFIED FROM https://github.com/frankarendpoth/frankarendpoth.github.io/blob/master/content/pop-vlog/javascript/2017/009-control/control.js
//https://www.kirupa.com/html5/getting_mouse_click_position.htm

let finalSeconds = 0;
let widthScore = 0;
let keyActivated = false;
let frameCount = 0;
let secondCount = 0;
let playSpace, controller;
let levelObjects = [];
let clickCounter = 0;
let gravity = 1.5;
let gameStarted = false;
let currentLevel = 1;
let restarting = false;
let levelTransition = false;
canvas = document.getElementById("screen");
playSpace = canvas.getContext('2d');
/***********************************************PLAYER CLASS*************************************************** */
class Player
{
    constructor(x, y)
    {
        this.playerColor = "#FF0000";
        this.padding = 10;
        this.width = 10;
        this.height = 50;
        this.xPos = x;
        this.xVelocity = 0;
        this.yPos = y;
        this.yVelocity = 0;
        this.movementSpeed = 0.5;
        this.jumping = true;
        this.aboveNothing = false;
        this.sumWidth = 0;
        this.maxWidth = 200;
        //COLLISION
        this.rightCollide = false;
        this.leftCollide = false;
        this.upCollide = false;
        this.downCollide = false;
    }

    update()
    {
        //CHECK FOR COLLSIION
        this.collision()
        //RIGHT
        if(controller.right && !this.rightCollide)
        {
            this.xVelocity += this.movementSpeed;
        }
        //LEFT
        if(controller.left && !this.leftCollide)
        {   
            this.xVelocity -= this.movementSpeed;
        }
        //UP
        if(controller.up && !this.upCollide && !this.jumping)
        {
            this.yVelocity -= 50;
            this.jumping = true;
        }
        //GRAVITY
        if(!this.downCollide)
        {
            this.yVelocity += gravity;
        }
        this.xPos += this.xVelocity;
        this.yPos += this.yVelocity;
        this.xVelocity *= 0.9;// friction
        this.yVelocity *= 0.9;// friction
        //CHANGE X AND Y
        this.draw()
    }

    collision()
    {
        //After a week and a half or so, collision detection finally works. it may not be the best solution but i dont care anymore   
        for(let i of levelObjects)
        {
            //UP
            if(this.xPos < i.xPos + i.width && this.xPos + this.width > i.xPos && this.yPos + this.padding < i.yPos + i.height && this.yPos + this.height > i.yPos)
            {
                this.yVelocity += -10000;
                this.upCollide = true
                break;
            }
            else
            {
                this.upCollide = false;
            }
        }
        for(let i of levelObjects)
        {
            //DOWN
            if(this.xPos < i.xPos + i.width && this.xPos + this.width > i.xPos && this.yPos < i.yPos + i.height && this.yPos + this.height + gravity + this.padding + 5 > i.yPos)
            {
                if(i.endFlag == true && keyActivated)
                {
                    currentLevel++;
                    levelTransition = true;
                }
                else
                {
                    if(i.isKey == true)
                    {
                        keyActivated = true;
                    }
                    this.downCollide = true;
                    this.yVelocity = 0;
                    this.jumping = false;
                    this.aboveNothing = false;
                    break;
                }
            }
            else
            {
                this.downCollide = false;
                this.aboveNothing = true;
            }
        }
        for(let i of levelObjects)
        {
            //LEFT
            if(this.xPos - this.padding < i.xPos + i.width && this.xPos + this.width > i.xPos && this.yPos < i.yPos + i.height && this.yPos + this.height > i.yPos)
            {
                if(i.endFlag == true && keyActivated)
                {
                    currentLevel++;
                    levelTransition = true;
                }
                else
                {
                    if(i.isKey == true)
                    {
                        keyActivated = true;
                    }
                    this.leftCollide = true;
                    this.xVelocity = 0;
                    break;
                }
            }
            else
            {
                this.leftCollide = false;
            }            
        }
        for(let i of levelObjects)
        {
            //RIGHT
            if(this.xPos < i.xPos + i.width && this.xPos + this.width + this.padding > i.xPos && this.yPos < i.yPos + i.height && this.yPos + this.height > i.yPos)
            {
                if(i.endFlag == true && keyActivated)
                {
                    currentLevel++;
                    levelTransition = true;
                }
                else
                {
                    if(i.isKey == true)
                    {
                        keyActivated = true;
                    }
                    this.rightCollide = true;
                    this.xVelocity = 0;
                    break;
                }
            }
            else
            {
                this.rightCollide = false;
            }
        }
    }

    draw()
    {
        playSpace.fillText(plyr.sumWidth + "/" + plyr.maxWidth, 10, 60);
        playSpace.fillRect(this.xPos, this.yPos, this.width, this.height);
    }
}
/*************************************************************************************************************** */
                                                        //
/*********************************************CONTROLLER******************************************************** */
//EVENT HANDLERS DON'T SEEM TO WORK WELL WITH CLASSES SO THE CONTROLLER IS AN OBJECT.
controller = 
{
    toXPos: 0,
    toYPos: 0,
    toWidth: 0,
    toHeight: 0,
    movement: function(event)
    {
        //KEYDOWN == TRUE, KEYUP == FALSE;
        var keyState = (event.type == "keydown")?true:false
        switch(event.keyCode)
        {
            case 65: //A
                controller.left = keyState;
                break;
            case 68: //D
                controller.right = keyState;
                break;
            case 87: //W
                controller.up = keyState;
                break;
            case 82: //R
                restarting = true;
                break;
            case 13: //ENTER
                gameStarted = true;
                levelTransition = true;
                break; 
        }
    },
    clickup: function(event)
    {
        
        //0 MEANS FIRST CLICK TO START THE PLATFORM, 1 MEANS SECOND CLICK TO FINISH IT OFF.
        if(plyr.aboveNothing)
        {
            console.log("click two")
            clickCounter--;
            toWidth = Math.abs(event.clientX - toXPos);
            toHeight = Math.abs(event.clientY - toYPos);
            
            if(toWidth < 15)
            {
                toWidth = 15;
            }
            if(plyr.sumWidth + toWidth > plyr.maxWidth)
            {
                toWidth = plyr.maxWidth - plyr.sumWidth
            }
            if(plyr.sumWidth < plyr.maxWidth)
            {
                plyr.sumWidth += toWidth;
                widthScore += toWidth;
                plat = new Platform(toXPos, toYPos, 50, toWidth);
                levelObjects.push(plat);
            }
        }
    },
    clickdown: function(event)
    {
        
        //0 MEANS FIRST CLICK TO START THE PLATFORM, 1 MEANS SECOND CLICK TO FINISH IT OFF.
        if(plyr.aboveNothing)
        {
            console.log("click one")
            clickCounter++;
            toXPos = event.clientX;
            toYPos = event.clientY;
            console.log(toXPos)
        }
    }
}
/******************************************************************************************************************** */
                                                        //
/***************************************************PLATFORM CLASS*************************************************** */
class Platform
{
    constructor(x, y, h, w, flag = false, key = false)
    {
        //BASIC INFO
        this.xPos = x;
        this.yPos = y;
        this.height= h;
        this.width = w;
        this.endFlag = flag;
        this.isKey = key
        this.flagColorOn = "#0000FF";
        this.flagColorOff = "#00008b";
        this.standardColor = "#000000";
        this.keyColorGet = "#ffff00";
        this.keyColorGot = "#9b870c";
    }
    draw()
    {
        playSpace.beginPath();
        playSpace.fillRect(this.xPos, this.yPos, this.width, this.height);
        playSpace.closePath();
    }
    //PLATFORMS MIGHT MOVE?
    update()
    {
        this.draw();
    }
}
/********************************************************************************************************************** */
                                                        //
/****************************************************MENU************************************************************ */
function menu()
{
    playSpace.font = "30px Arial";
    playSpace.fillText("A and D move left and right. W jumps. Enter restarts a level", 100, 200, 1000);
    playSpace.fillText("Draw platform when in the air using left mouse click.", 100, 300, 1000)
    playSpace.fillText("Get to the blue square to move on to the next level.", 100, 400, 1000)
    playSpace.fillText("If there is a yellow square, jump on it to activate the blue square.", 100, 500, 1000)
    playSpace.fillText("The corners and underside of platforms will get you stuck so be careful.", 100, 600, 1000)
    playSpace.fillText("Press Enter To Start", 1350, 700, 1000);
}
/********************************************************************************************************************** */
                                                        //
/****************************************************LEVELS************************************************************ */
function buildLevel()
{
    switch(currentLevel)
    {
        case 1:
            keyActivated = true;
            levelObjects = [];
            plyr = new Player(100, 100);
            l1p1 = new Platform(0, 300, 500, 300); 
            l1p2 = new Platform(500, 300, 500, 300); 
            l1p3 = new Platform(1000, 300, 500, 300);
            l1p4 = new Platform(1500, 500, 50, 50, true);

            levelObjects.push(l1p1);
            levelObjects.push(l1p2);
            levelObjects.push(l1p3);
            levelObjects.push(l1p4);
            break;
        case 2:
            keyActivated = true;
            levelObjects = [];
            plyr = new Player(100, 100);
            l2p1 = new Platform(0, 300, 500, 300);
            l2p2 = new Platform(650, 300, 500, 300);
            l2p3 = new Platform(1300, 500, 50, 50, true);

            levelObjects.push(l2p1);
            levelObjects.push(l2p2);
            levelObjects.push(l2p3);
            break;
        case 3:
            keyActivated = true;
            levelObjects = [];
            plyr = new Player(100, 100);
            plyr.maxWidth = 800;
            l3p1 = new Platform(0, 300, 500, 300);
            l3p2 = new Platform(500, 0, 500, 300);
            l3p3 = new Platform(1000, 500, 550, 300);
            l3p4 = new Platform(1700, 500, 50, 50, true);

            levelObjects.push(l3p1);
            levelObjects.push(l3p2);
            levelObjects.push(l3p3);
            levelObjects.push(l3p4);

            break;
        case 4:
            keyActivated = true;
            levelObjects = [];
            plyr = new Player(100, 100);
            l4p1 = new Platform(0, 300, 50, 300);
            l4p2 = new Platform(0, 500, 50, 300);
            l4p3 = new Platform(50, 400, 50, 50, true);

            levelObjects.push(l4p1);
            levelObjects.push(l4p2);
            levelObjects.push(l4p3);
            break;
        case 5:
            keyActivated = true;
            levelObjects = [];
            plyr = new Player(100, 450);
            plyr.maxWidth = 800;
            l5p1 = new Platform(0, 600, 50, 300);
            l5p2 = new Platform(1500, 300, 50, 50, true);

            levelObjects.push(l5p1);
            levelObjects.push(l5p2);
            break;
        case 6:
            keyActivated = false;
            levelObjects = [];
            plyr = new Player(100, 100);
            l6p1 = new Platform(0, 300, 500, 300);
            l6p2 = new Platform(600, 600, 100, 100, false, true);
            l6p3 = new Platform(1000, 400, 50, 50, true);

            levelObjects.push(l6p1);
            levelObjects.push(l6p2);
            levelObjects.push(l6p3);
            break;
        case 7:
            keyActivated = false;
            levelObjects = [];
            plyr = new Player(850, 300);
            plyr.maxWidth = 400;
            l7p1 = new Platform(700, 350, 100, 300);
            l7p2 = new Platform(100, 350, 50, 50, false, true);
            l7p3 = new Platform(1600, 350, 50, 50, true);

            levelObjects.push(l7p1);
            levelObjects.push(l7p2);
            levelObjects.push(l7p3);
            break;
        case 8:
            keyActivated = false;
            levelObjects = [];
            plyr = new Player(850, 700);
            plyr.maxWidth = 400;
            l8p1 = new Platform(125, 0, 1000, 500);
            l8p2 = new Platform(1000, 100, 1000, 500);
            l8p3 = new Platform(800, 750, 100, 100);
            l8p4 = new Platform(725, 750, 50, 50, true);
            l8p5 = new Platform(1600, 600, 50, 50, false, true);

            levelObjects.push(l8p1);
            levelObjects.push(l8p2);
            levelObjects.push(l8p3);
            levelObjects.push(l8p4);
            levelObjects.push(l8p5);
            break;
        case 9:
            keyActivated = false;
            levelObjects = [];
            plyr = new Player(850, 400);
            plyr.maxWidth = 1000;
            l9p1 = new Platform(125, 500, 50, 1500);
            l9p2 = new Platform(125, 300, 50, 1500);
            l9p3 = new Platform(825, 750, 50, 50, false, true);
            l9p4 = new Platform(825, 100, 50, 50, true);

            levelObjects.push(l9p1);
            levelObjects.push(l9p2);
            levelObjects.push(l9p3);
            levelObjects.push(l9p4);
            break;
        case 10:
            keyActivated = false;
            levelObjects = [];
            plyr = new Player(100, 100);
            plyr.maxWidth = 600;
            l10p1 = new Platform(400, 0, 300, 75);
            l10p2 = new Platform(400, 450, 400, 75);
            l10p3 = new Platform(600, 0, 350, 75);
            l10p4 = new Platform(600, 500, 400, 75);
            l10p5 = new Platform(800, 0, 100, 75);
            l10p6 = new Platform(800, 300, 600, 75);
            l10p7 = new Platform(200, 100, 50, 50, true);
            l10p8 = new Platform(1400, 600, 50, 50, false, true);
            l10p9 = new Platform(50, 750, 75, 250);

            levelObjects.push(l10p1);
            levelObjects.push(l10p2);
            levelObjects.push(l10p3);
            levelObjects.push(l10p4);
            levelObjects.push(l10p5);
            levelObjects.push(l10p6);
            levelObjects.push(l10p7);
            levelObjects.push(l10p8);
            levelObjects.push(l10p9);
            break;
        case 11:
            finalSeconds = secondCount;
            gameStarted = false;
            break;
    }
}
function updateLevel()
{
    playSpace.fillText(plyr.sumWidth + "/" + plyr.maxWidth, 10, 60);
    playSpace.fillText(secondCount, 1600, 60);
    playSpace.fillStyle = plyr.playerColor
    plyr.update();
    for(i of levelObjects)
    {
        if(i.endFlag)
        {
            if(keyActivated)
            {
                playSpace.fillStyle = i.flagColorOn;
            }
            else
            {
                playSpace.fillStyle = i.flagColorOff;
            }
        }
        else if(i.isKey)
        {
            if(keyActivated)
            {
                playSpace.fillStyle = i.keyColorGot;
            }
            else
            {
                playSpace.fillStyle = i.keyColorGet;
            }
        }
        else
        {
            playSpace.fillStyle = i.standardColor;
        }
        i.update();
    }
}
/********************************************************************************************************************** */
                                                        //
/***************************************************ANIMATION********************************************************** */
function animate() 
{
    requestAnimationFrame(animate);
    frameCount++;
    if(frameCount == 60)
    {
        secondCount++;
        frameCount = 0;
    }
    playSpace.clearRect(0, 0, canvas.width, canvas.height); 
    console.log(keyActivated)
    if(!gameStarted)
    {
        if(currentLevel == 11)
        {
            finalScore = widthScore + finalSeconds;
            playSpace.font = "50px Arial";
            playSpace.fillText("Final Time: " + finalSeconds, 600, 100, 1000);
            playSpace.fillText("Platform Amount Drawn: " + widthScore, 600, 400, 1000);
            playSpace.fillText("Overall Score: " + finalScore, 600, 600, 1000);
            playSpace.fillText("Lower is better so try again to get a better score!", 600, 700, 1000);
        }
        else
        {
            levelTransition = true;
            menu();
        }
    }
    if(levelTransition)
    {
        buildLevel();
        levelTransition = false;
    }
    if(gameStarted)
    {
        updateLevel();
    }
}
animate();
/********************************************************************************************************************** */
                                                        //
/************************************************EVENT HANDLERS******************************************************** */
document.addEventListener("keyup", controller.movement)
document.addEventListener("keydown", controller.movement)
document.addEventListener("mousedown", controller.clickdown)
document.addEventListener("mouseup", controller.clickup)
/********************************************************************************************************************** */

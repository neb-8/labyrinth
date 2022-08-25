//images:
const piecesImg = document.createElement('img');
piecesImg.src = 'media/pieces.png';

const p1Img = document.createElement('img');
const p2Img = document.createElement('img');
p2Img.src = 'media/p2.png';
p1Img.src = 'media/p1.png';

const w0 = document.createElement('img');
const w1 = document.createElement('img');
const w2 = document.createElement('img');
const w3 = document.createElement('img');
const b0 = document.createElement('img');
const b1 = document.createElement('img');
const b2 = document.createElement('img');
const b3 = document.createElement('img');
w0.src = 'media/pieces/w0.png';
w1.src = 'media/pieces/w1.png';
w2.src = 'media/pieces/w2.png';
w3.src = 'media/pieces/w3.png';
b0.src = 'media/pieces/b0.png';
b1.src = 'media/pieces/b1.png';
b2.src = 'media/pieces/b2.png';
b3.src = 'media/pieces/b3.png';

//classes:
class piece{
    constructor(n,color){
        this.color = color;
        this.type = n;
        this.count = 2;
    }
}

//declarations:
const table = new Array(4);
for(let i=0;i<table.length;i++){
    table[i] = new Array(4);
}

const infobtn = document.getElementById('infobtn');
infobtn.addEventListener('click',function(){
    document.getElementById('information').classList.toggle('hidden');
});

const startbtn = document.getElementById('startbtn');
startbtn.addEventListener('click',run);

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let cd = canvas.width;

canvas.addEventListener('click',place);

let rows = document.querySelector('table').getElementsByTagName('tr');

let player1;
let player2;

let p1Pieces = [];
let p2Pieces = [];

let activePiece = {}; //kézben lévő figura

let activePlayer;

for(let i=0;i<4;i++){
    rows[i+2].cells[0].addEventListener('click',select);
    rows[i+2].cells[1].addEventListener('click',select);
}

const messages = document.getElementById('messages');

document.getElementById('playAgainbtn').addEventListener('click',function(){
    document.getElementById('start').classList.remove('hidden');
    document.getElementById('finish').classList.add('hidden');
});

//functions:
function setup(){
    givePieces();
    activePiece = {};
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            table[i][j] = {};
            //table[sor][oszlop]
        }
    }
    activePlayer = 'w';
    for(let i=0;i<6;i++){
        rows[i].cells[0].classList.remove('active');
        rows[i].cells[1].classList.remove('active');
        rows[i].cells[0].classList.toggle('active');
    }
}

function drawData(){
    rows[0].cells[0].innerHTML = '<img src="media/p1.png" height="60px" alt="player1"></img>';
    rows[0].cells[1].innerHTML = '<img src="media/p2.png" height="60px" alt="player2"></img>';
    rows[1].cells[0].innerText = player1;
    rows[1].cells[1].innerText = player2;
    for(let i=0;i<4;i++){
        rows[i+2].cells[0].innerHTML = `<img src="media/pieces/w${i}.png" height="60px" alt="white piece ${i}">count: ${p1Pieces[i].count}</img>`;
        rows[i+2].cells[1].innerHTML = `<img src="media/pieces/b${i}.png" height="60px" alt="black piece ${i}">count: ${p2Pieces[i].count}</img>`;
        //rows[i+2].cells[0].innerHTML += `count: ${p1Pieces[i].count}`;
        //rows[i+2].cells[1].innerHTML += `count: ${p2Pieces[i].count}`;
    }
    
}

function drawCanvas(){
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if((i<2&&j<2)||(i>=2&&j>=2)){
                context.fillStyle = '#BB6898';
            }else{
                context.fillStyle = '#F2B36C';
            }
            context.fillRect(j*(cd/4)+5,i*(cd/4)+5,(cd/4)-10,(cd/4)-10);
            if(Object.keys(table[i][j]).length!=0){
                switch(table[i][j].type){
                    case 0:
                        if(table[i][j].color=='w'){
                            context.drawImage(w0,j*(400/4),i*(400/4),(400/4),(400/4));
                        }else{
                            context.drawImage(b0,j*(400/4),i*(400/4),(400/4),(400/4));
                        }
                        break;
                    case 1:
                        if(table[i][j].color=='w'){
                            context.drawImage(w1,j*(400/4),i*(400/4),(400/4),(400/4));
                        }else{
                            context.drawImage(b1,j*(400/4),i*(400/4),(400/4),(400/4));
                        }
                        break;
                    case 2:
                        if(table[i][j].color=='w'){
                            context.drawImage(w2,j*(400/4),i*(400/4),(400/4),(400/4));
                        }else{
                            context.drawImage(b2,j*(400/4),i*(400/4),(400/4),(400/4));
                        }
                        break;
                    case 3:
                        if(table[i][j].color=='w'){
                            context.drawImage(w3,j*(400/4),i*(400/4),(400/4),(400/4));
                        }else{
                            context.drawImage(b3,j*(400/4),i*(400/4),(400/4),(400/4));
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    //context.stroke();
}

function check(y,x){
    //return true;
    //leellenőrzi hogy le lehet e rakni az activePiece-t a kiválasztott helyre
    //talán egybe lesz vonva a place()-szel
    if(Object.keys(table[y][x]).length!=0){
        return false;
    }
    for(let i=0;i<4;i++){
        if(table[y][i].type==activePiece.type){
            return false;
        }
        if(table[i][x].type==activePiece.type){
            return false;
        }
    }
    //table[sor][oszlop]
    let qy = Math.floor(y/2)*2;
    let qx = Math.floor(x/2)*2;
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if(i==qx&&j==qy){
                if(table[j][i].type==activePiece.type ||
                   table[j+1][i].type==activePiece.type ||
                   table[j][i+1].type==activePiece.type ||
                   table[j+1][i+1].type==activePiece.type){
                    return false;
                }
            }
        }
    }
    return true;
}

function place(e){
    //kattintásra hívódik meg
    //lerakja az activePiece-t
    messages.innerText = '';
    
    if(Object.keys(activePiece).length==0){
        console.log('nincs kiválasztott figura!');
        messages.innerText = 'nincs kiválasztott figura!';
        return;
    }
    //lerakás ide

    if(visualViewport.width<400){
        cd = visualViewport.width;
    }
    let mouseX = Math.floor((e.layerX)/(cd/4));
    let mouseY = Math.floor((e.layerY)/(cd/4));
    if(!check(mouseY,mouseX)){
        console.log('ide nem tudsz rakni!');
        messages.innerText = 'ide nem tudsz rakni!';
        if(activePiece.color=='w'){
            p1Pieces[activePiece.type].count++;
        }else{
            p2Pieces[activePiece.type].count++;
        }
        activePiece = {};
        drawData();
        return;
    }
    table[mouseY][mouseX] = activePiece;
    drawCanvas();
    if(won(mouseY,mouseX)){
        console.log(activePlayer,'nyert!');
        //endscreen display
        document.getElementById('finish').classList.remove('hidden');
        document.getElementById('winner').innerText = `${(activePlayer=='w') ? player1 : player2} nyert`;
        switchActivePlayer();
        run();
        return;
    }
    switchActivePlayer();
    activePiece = {};
    drawData();
    //...
}

function select(e){
    let id = e.target.id;
    if(e.target.id==""){
        id = e.target.parentNode.id
    }
    if(activePlayer!=id[0]){
        console.log('a másik játékos köre van!');
        messages.innerText = 'a másik játékos köre van';
        return;
    }
    if(Object.keys(activePiece).length!=0){
        console.log('van kiválasztott figura!');
        messages.innerText = 'már van kiválasztott figura';
        return;
    }
    if(id[0]=='w'){
        if(p1Pieces[id[1]].count>0){
            activePiece = p1Pieces[id[1]];
            p1Pieces[id[1]].count--;
        }else{
            console.log('nincs már ilyen figura!');
            messages.innerText = 'nincs már ilyen figura';
            activePiece = {};
        }
    }else{
        if(p2Pieces[id[1]].count>0){
            activePiece = p2Pieces[id[1]];
            p2Pieces[id[1]].count--;
        }else{
            console.log('nincs már ilyen figura!');
            messages.innerText = 'nincs már ilyen figura';
            activePiece = {};
        }
    }
    drawData();
}

function switchActivePlayer(){
    for(let i=0;i<6;i++){
        rows[i].cells[0].classList.toggle('active');
        rows[i].cells[1].classList.toggle('active');
    }
    switch(activePlayer){
        case 'w':
            activePlayer = 'b';
            break;
        case 'b':
            activePlayer = 'w';
            break;
        default:
            break;
    }
    return;
}

function won(y,x){
    let row=0,col=0,sqr=0;
    for(let i=0;i<4;i++){
        if(table[y][i].type!=activePiece.type&&Object.keys(table[y][i]).length!=0){
            col++;
        }
        if(table[i][x].type!=activePiece.type&&Object.keys(table[i][x]).length!=0){
            row++;
        }
    }
    //table[sor][oszlop]
    let qy = Math.floor(y/2)*2;
    let qx = Math.floor(x/2)*2;
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if(i==qx&&j==qy){
                if(table[j][i].type!=activePiece.type&&Object.keys(table[j][i]).length!=0){
                    sqr++;
                }
                if(table[j+1][i].type!=activePiece.type&&Object.keys(table[j+1][i]).length!=0){
                    sqr++;
                }
                if(table[j][i+1].type!=activePiece.type&&Object.keys(table[j][i+1]).length!=0){
                    sqr++;
                }
                if(table[j+1][i+1].type!=activePiece.type&&Object.keys(table[j+1][i+1]).length!=0){
                    sqr++;
                }
            }
        }
    }
    return (row==3||col==3||sqr==3);
}

function givePieces(){
    p1Pieces = []
    p2Pieces = []
    for(let i=0;i<4;i++){
        p1Pieces.push(new piece(i,"w"));
        p2Pieces.push(new piece(i,"b"));
    }
    return ;
}

//function calls:
function run(){
    document.getElementById('start').classList.add('hidden');
    player1 = document.getElementById('jatekos1').value;
    player2 = document.getElementById('jatekos2').value;
    if(player1.trim()==""){
        player1 = "1. játékos";
    }
    if(player2.trim()==""){
        player2 = "2. játékos";
    }
    setup();
    drawCanvas();
    drawData();
}
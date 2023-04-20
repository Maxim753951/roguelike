class Game {

    init()
    {
        window.onload = Start;
    }

}



window.addEventListener("keydown", function (e) { KeyDown(e); });



function Start()
{
    timer = setInterval(Update, 1000 / 60); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
    CreateMap();
    DrawMap();
    CreateObjects();
}

function Stop()
{
    clearInterval(timer); //Остановка обновления
}



class Cell
{
    constructor(tile, property, x, y, w, h, health, damage)
    {

        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.property = property;

        this.tile = tile;

        this.health = health;
        this.damage = damage;
    }

    interactions = false;

    Move(v, d, id)
    {
        this.interactions = false;

        if(v == "x") //Перемещение по оси X
        {
            if (map[this.y][this.x+d] == 1)
            {
                for(var i = 0; i < enemy.length; i++)
                {
                    if (this.y == objects[enemy[i]].y && this.x+d == objects[enemy[i]].x) {
                        this.interactions = true;
                    }
                }

                if (this.y == objects[player].y && this.x+d == objects[player].x)
                {
                    this.interactions = true;
                }

                if (this.interactions == false)
                {
                    this.x += d; //Смещение
                    objects[id+1].x += d;
                }
            }
        }
        else //Перемещение по оси Y
        {
            if (map[this.y+d][this.x] == 1)
            {
                for(var i = 0; i < enemy.length; i++)
                {
                    if (this.y+d == objects[enemy[i]].y && this.x == objects[enemy[i]].x) {
                        this.interactions = true;
                    }
                }

                if (this.y+d == objects[player].y && this.x == objects[player].x)
                {
                    this.interactions = true;
                }

                if (this.interactions == false)
                {
                    this.y += d; //Смещение
                    objects[id+1].y += d;
                }
            }
        }

    }

    Hit()
    {
        if (this.property == 'tileP')
        {

            for(var i = 0; i < enemy.length; i++)
            {
                if ((this.y+1 == objects[enemy[i]].y && this.x == objects[enemy[i]].x) ||
                    (this.y-1 == objects[enemy[i]].y && this.x == objects[enemy[i]].x) ||
                    (this.y == objects[enemy[i]].y && this.x+1 == objects[enemy[i]].x) ||
                    (this.y == objects[enemy[i]].y && this.x-1 == objects[enemy[i]].x))
                {
                    objects[enemy[i]].health -= this.damage;
                    objects[enemy[i]+1].w = objects[enemy[i]].health;
                    if (objects[enemy[i]].health <= 0)
                    {
                        objects[enemy[i]+1].health -= 1;
                    }
                }
            }
        }
        else
        {
            if ((this.y+1 == objects[player].y && this.x == objects[player].x) ||
                (this.y-1 == objects[player].y && this.x == objects[player].x) ||
                (this.y == objects[player].y && this.x+1 == objects[player].x) ||
                (this.y == objects[player].y && this.x-1 == objects[player].x))
            {
                objects[player].health -= this.damage;
                objects[player+1].w = objects[player].health;
                if (objects[player].health <= 0)
                {
                    objects[player+1].health -= 1;
                }
            }
        }
    }

    Buff()
    {
        for(var i = 0; i < heal.length; i++)
        {
            if ((this.y+1 == objects[heal[i]].y && this.x == objects[heal[i]].x) ||
                (this.y-1 == objects[heal[i]].y && this.x == objects[heal[i]].x) ||
                (this.y == objects[heal[i]].y && this.x+1 == objects[heal[i]].x) ||
                (this.y == objects[heal[i]].y && this.x-1 == objects[heal[i]].x))
            {
                this.health += objects[heal[i]].damage;
                objects[heal[i]].health -= 1;
                objects[player+1].w = this.health;
            }
        }

        for(var i = 0; i < sword.length; i++)
        {
            if ((this.y+1 == objects[sword[i]].y && this.x == objects[sword[i]].x) ||
                (this.y-1 == objects[sword[i]].y && this.x == objects[sword[i]].x) ||
                (this.y == objects[sword[i]].y && this.x+1 == objects[sword[i]].x) ||
                (this.y == objects[sword[i]].y && this.x-1 == objects[sword[i]].x))
            {
                this.damage += objects[sword[i]].damage;
                objects[sword[i]].health -= 1;
            }
        }
    }
}



let map = [
    /*
    [1,1,0,0,1],
    [1,0,0,0,0],
    [0,0,1,1,0],
    [0,0,0,1,0],
    [0,1,0,1,0]
    */
];


let tileW = 50; // ширина клетки пола
let tileH = 50; // высота клетки пола


let objects =
    [
        //new Human(document.createElement('div'),'tileP', 5, 5)
    ];


let player = 0; //номер объекта, которым управляет игрок
//let playerHP = 1;

let id = 2;

let enemy = [];
//let enemyHP = [];

let sword = [];

let heal = [];


let vector;
let distance;

let elements;

function Update() //Обновление игры
{
    if(RandomInteger(0, 10000) > 9850)
    {
        for(var i = 0; i < enemy.length; i++)
        {
            vector = getRandom2Number(['x', 'y']);
            distance = getRandom2Number([-1, 1]);

            objects[enemy[i]].Move(vector, distance, enemy[i]);
        }
    }

    if(RandomInteger(0, 10000) > 9700)
    {
        for(var i = 0; i < enemy.length; i++)
        {
            objects[enemy[i]].Hit();
        }
    }

    for(var i = 0; i < objects.length; i++)
    {
        if (objects[i].health <= 0)
        {
            if (objects[i].property == 'tileP')
            {
                objects[player].tile.remove();
                elements = document.getElementsByClassName('healthP');
                elements[0].remove();
                Stop();
            }
            objects[i].tile.remove();
            objects.splice(i, 1);
            Reorganization();
        }
    }

    Draw();
}

function Draw() //Работа с графикой
{
    for(var i = 0; i < objects.length; i++)
    {
        objects[i].tile.className = objects[i].property;
        objects[i].tile.style.left = String(objects[i].x * tileW) + 'px';
        objects[i].tile.style.top = String(objects[i].y * tileH) + 'px';
        objects[i].tile.style.width = String(objects[i].w) + 'px';
        objects[i].tile.style.height = String(objects[i].h) + 'px'
        field.append(objects[i].tile);
    }

}



function Reorganization()
{
    id = 2;

    enemy = [];
    sword = [];
    heal = [];

    for(var i = 2; i < objects.length; i++)
    {
        if (objects[i].property == 'tileE')
        {
            enemy.push(i);
        }
        if (objects[i].property == 'tileHP')
        {
            heal.push(i);
        }
        if (objects[i].property == 'tileSW')
        {
            sword.push(i);
        }
    }
}



function KeyDown(e)
{
    switch(e.keyCode)
    {
        case 65: //Влево
            objects[player].Move("x", -1, player);
            break;

        case 68: //Вправо
            objects[player].Move("x", 1, player);
            break;

        case 87: //Вверх
            objects[player].Move("y", -1, player);
            break;

        case 83: //Вниз
            objects[player].Move("y", 1, player);
            break;

        case 32: //Удар
            objects[player].Hit();
            break;

        case 69: //Взаимодействие
            objects[player].Buff();
            break;

        case 27: //Esc
            if(timer == null)
            {
                Start();
            }
            else
            {
                Stop();
            }
            break;
    }
}



function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandom2Number(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function RandomInteger(min, max)
{
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}



function CreateMap() {
    let element = document.getElementById('field');
    let style = window.getComputedStyle(element);
    let property = style.getPropertyValue('width');
    let w = property.replace(/\D/g, "");
    property = style.getPropertyValue('height');
    let h = property.replace(/\D/g, "");

    let colvW = Math.floor(w / tileW);
    let colvH = Math.floor(h / tileH);

    for (var i = 0; i < colvH; i++) {
        map[i] = new Array(colvW);
        for (var j = 0; j < map[i].length; j++) {
                map[i][j] = 0;
        }
    }

    let colvRum = getRandomNumber(3, 6); // 5-10 комнат

    let rumW = 0;
    let rumH = 0;

    let x1 = 0;
    let y1 = 0;

    let prohodErr = 0;
    let ver = false;
    let gor = false;

    for (var colv = 0; colv < colvRum; colv++) {

        rumW = getRandomNumber(3, 6); // 3-8 ширина комнаты
        rumH = getRandomNumber(3, 6); // 3-8 длина комнаты

        x1 = getRandomNumber(1, colvW-rumW);
        y1 = getRandomNumber(1, colvH-rumH);

        prohodErr = 0; // автоматическое задание необходимого числа проходов

        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                if (((i >= y1) && (i < y1+rumH)) && ((j >= x1) && (j < x1+rumW)))
                {
                    if (colv == getRandomNumber(0, rumW * rumH + 1) || prohodErr == rumH*rumW - 2)
                    {
                        if ((getRandomNumber(0, 2) == 0 && gor == true ) || ver == false) //вертикаль
                        {
                            ver = true;
                            for (var z = 0; z < map.length; z++)
                            {
                                map[z][j] = 1;
                            }
                        }
                        else // горизонталь
                        {
                            gor = true;
                            for (var z = 0; z < map[i].length; z++)
                            {
                                map[i][z] = 1;
                            }
                        }

                    }
                    else
                    {
                        prohodErr++;
                    }
                    map[i][j] = 1;
                }
            }
        }
    }
}

function DrawMap() //Работа с графикой
{
    let wall = document.createElement('div');
    wall.className = "tileW";
    wall.style.width = "100%"; // ширина стены от общего поля
    wall.style.height = "100%"; // высота стены от общего поля
    field.prepend(wall);

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] == 1)
            {
                let tile = document.createElement('div');
                tile.className = "tile";
                tile.style.left = String(j * tileW) + 'px';
                tile.style.top = String(i * tileH) + 'px';
                field.append(tile);
            }

        }
    }

}

function CreateObjects()
{
    let statusP = false;

    let colvE = 5; // количество врагов
    let colvHP = 5; // количество хилок
    let colvSW = 5; // количество бустов
    let rand = 0;

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] == 1 && statusP == false)
            {
                statusP = true;
                objects.push(new Cell(document.createElement('div'), 'tileP', j, i, 50, 50, 50, 20));
                objects.push(new Cell(document.createElement('div'), 'healthP', j, i, 50, 3, 1, 0));


            }
            else if(map[i][j] == 1 && getRandomNumber(0, 6) == 1)
            {
                rand = getRandomNumber(1, 4)
                if (rand == 1 && colvE > 0)
                {
                    objects.push(new Cell(document.createElement('div'), 'tileE', j, i, 50, 50, 50, 10));
                    enemy.push(id);
                    //id++;
                    objects.push(new Cell(document.createElement('div'), 'healthE', j, i, 50, 3, 1, 0));
                    //enemyHP.push(id);
                    //id++;
                    id += 2;
                    colvE--;
                }
                if (rand == 2 && colvHP > 0)
                {
                    objects.push(new Cell(document.createElement('div'), 'tileHP', j, i, 50, 50, 1, 25));
                    heal.push(id);
                    id++;
                    colvHP--;
                }
                if (rand == 3 && colvSW > 0)
                {
                    objects.push(new Cell(document.createElement('div'), 'tileSW', j, i, 50, 50, 1, 5));
                    sword.push(id);
                    id++;
                    colvSW--;
                }
            }
        }
    }

}
$(function () {
    var maxSpeed = 15;
    var computerSpeed = 8;

    //BALLS    
    var ballCounter = 0;
    var BallSpeedList = [];
    function BallSpeed() {
        this.x = 0;
        this.y = 0;
    };

    var balls = [];
    function Ball() {
        this.x = 0;
        this.y = 0;
        this.width = 15;
        this.height = 15;
        this.element = undefined;
        this.top = function () { return this.y; };
        this.left = function () { return this.x; };
        this.right = function () { return this.width + this.x; };
        this.bottom = function () { return this.y + this.height; };
        this.centerY = function () { return this.y + (this.height / 2); };
        this.centerX = function () { return this.x + (this.width / 2); };
    };
    
    function CreateBall(x,y){
        $('body').append('<div id="ball'+ballCounter+'" style="width:15px; height:15px; background-color:blue; position:absolute"></div>');
        var ball = new Ball();   
        ball.x=x;
        ball.y=y;    
        if(x==undefined)
        ball.y = ($(window).height() / 2);
        if(y==undefined)
        ball.x = ($(window).width() / 2);
        ball.element = $("#ball"+ballCounter);
        balls.push(ball);
        var ballSpeed = new BallSpeed();
        ballSpeed.x = ((Math.random()*2)-1)*5;
        ballSpeed.y = ((Math.random()*2)-1)*5;
        BallSpeedList.push(ballSpeed);
        ballCounter++;
    }
    
    function removeBall(index) {
        balls[index].element.remove();
        balls.splice(index, 1);
        BallSpeedList.splice(index, 1);
    };

    //PONG BARS
    var pongBar1 = {
        x: 0,
        y: ($(window).height() / 2),
        width: 40,
        height: 200,
        element: undefined,
        top: function () { return this.y; },
        left: function () { return this.x; },
        right: function () { return this.width + this.x; },
        bottom: function () { return this.y + this.height; }
    };

    var pongBar2 = {
        x: 0,
        y: ($(window).height() / 2),
        width: 40,
        height: 200,
        element: undefined,
        top: function () { return this.y; },
        left: function () { return this.x; },
        right: function () { return this.width + this.x; },
        bottom: function () { return this.y + this.height; }
    };

    //MOUSE
    var PrevMouseSpeed = {
        y: 0
    };
    function getMousePosition() {
        $(document).one("mousemove", function (event) {
            var oldY = $("#pongBar1").offset().top;
            var newY = event.pageY;
            PrevMouseSpeed.y = oldY - newY;
            pongBar1.y = newY;
        });
    }

    //SCORE
    var score = {
        player1: 0,
        player2: 0
    };


    //ITEMS    
    var itemCounter = 0;
    var items = [];
    function createRandomItem() {
        $('body').append('<span id="item' + itemCounter + '" style="width:40px; height:40px; background-color:red; position:absolute"></span>');
        var randx = Math.random() * $(window).width();
        var randy = Math.random() * $(window).height();
        var randType = Math.round(Math.random() * 4.5);
        var color = "red";
        switch(randType)
        {
            case 1:
            color = "green";
            break;
            case 2:
            color = "yellow";
            break;
            case 3:
            color = "brown";
            break;
            case 4:
            color = "orange";
            break;
        }
        
        $("#item"+itemCounter).offset({ top: randy, left: randx });        
        $("#item"+itemCounter).css('background-color',color);
        return {
            x: randx,
            y: randy,
            width: 40,
            height: 40,
            element:$("#item"+itemCounter++),
            type: randType,
            centerY : function () { return this.y + (this.height / 2); },
            centerX : function () { return this.x + (this.width / 2); },
            lifeTime : 1000
        };
    }
    
    function removeItem(index) {
        items[index].element.remove();
        items.splice(index, 1);
    };
    

    function reset() {      
        balls = new Array();
        BallSpeedList = new Array();
        CreateBall();
    };

    //PARTICLES
    var maxParticles = 10;
    var particleCounter = 0;
    var particles = [];

    function Particle() {
        this.x = 0;
        this.y = 0;
        this.width = 4;
        this.height = 4;
        this.element = undefined;
        this.top = function () { return this.y; };
        this.left = function () { return this.x; };
        this.right = function () { return this.width + this.x; };
        this.bottom = function () { return this.y + this.height; };
        this.lifeTime = 50;
        this.speedX = 0;
        this.speedY = 0;
    };

    function createParticles(ball, collision) {
        $('body').append('<span id="particle' + particleCounter + '" style="width:4px; height:4px; background-color:blue; position:absolute"></span>');
        var particle = new Particle();
        particle.element = $("#particle" + particleCounter);
        particle.lifeTime = (Math.random() * 10) + 40;
        if (collision == "top") {
            particle.y = ball.y;
            particle.x = ball.centerX();
            particle.speedX = Math.random() * 2 - 1;
            particle.speedY = (Math.random() * 2);
        }
        if (collision == "bottom") {
            particle.y = ball.bottom();
            particle.x = ball.centerX();
            particle.speedX = Math.random() * 2 - 1;
            particle.speedY = (Math.random() * 2) * -1;
        }
        if (collision == "left") {
            particle.x = ball.left();
            particle.y = ball.centerY();
            particle.speedX = Math.random() * 2;
            particle.speedY = Math.random() * 2 - 1;
        }
        if (collision == "right") {
            particle.x = ball.right();
            particle.y = ball.centerY();
            particle.speedX = (Math.random() * 2) * -1;
            particle.speedY = Math.random() * 2 - 1;
        }

        particles.push(particle);
        particleCounter++;
    };

    function createExplosion(ball, collisionSide) {
        for (j = 0; j < maxParticles; j++) {
            createParticles(ball, collisionSide);
        }
    }

    function removeParticle(index) {
        particles[index].element.remove();
        particles.splice(index, 1);

    };

    function createElements() {
        //create dynamic divs      
        $('body').append('<div id="pongBar1" style="width:40px; height:200px; background-color:black; position:absolute"></div>');
        $('body').append('<div id="pongBar2" style="width:40px; height:200px; background-color:black; position:absolute"></div>');
        $('body').append('<span id="score1" style="font-size:72pt; background-color:white; position:absolute; top:0px; left:' + (($(window).width() / 2) - 200) + 'px"></span>');
        $('body').append('<span id="score2" style="font-size:72pt; background-color:white; position:absolute; top:0px; left:' + (($(window).width() / 2) + 200) + 'px"></span>');
        $("#pongBar1").offset({ top: ($(window).height() / 2) });
        $("#pongBar2").offset({ top: ($(window).height() / 2), left: ($(window).width() - $("#pongBar2").width()) });
        pongBar1.element = $("#pongBar1");
        pongBar2.element = $("#pongBar2");
        pongBar2.x = ($(window).width() - pongBar2.width);
    };

    function redraw() {
        $("#score1").text(score.player1);
        $("#score2").text(score.player2);
        $("#score1").offset({ left: (($(window).width() / 4)) });
        $("#score2").offset({ left: (($(window).width() / 4) * 3) });
        //add speed        
        pongBar1.element.offset({ top: pongBar1.y, left: pongBar1.x });
        pongBar2.element.offset({ top: pongBar2.y, left: pongBar2.x });
        
    };

    function drawBall(ball) {
        ball.element.offset({ top: ball.y, left: ball.x });
        ball.element.width(ball.width);
        ball.element.height(ball.height);
    };

    //CLEAR ALL
    var run = true;
    function clearAll() {
        run = false;
        $("#pongBar1").remove();
        $("#pongBar2").remove();
        $("#score1").remove();
        $("#score2").remove();
        for (var i = 0; i < balls.length; i++) {
            balls[i].element.remove();
        }
    };

    function update() {

        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            var BallSpeed = BallSpeedList[i];
            //restrict maxspeed
            if (BallSpeed.x > maxSpeed)
                BallSpeed.x = maxSpeed;
            if (BallSpeed.y > maxSpeed)
                BallSpeed.y = maxSpeed;
            // get new position
            ball.x += BallSpeed.x;
            ball.y += BallSpeed.y;
            var j = 0;
            //Colision TOP
            if (ball.top() <= 0) {
                BallSpeed.y = (-BallSpeed.y);
                ball.y = 0;
                createExplosion(ball, "top");
            }
            //Colision BOTTOM
            if (ball.bottom() >= $(window).height()) {
                BallSpeed.y = (-BallSpeed.y);
                ball.y = $(window).height() - ball.height;
                createExplosion(ball, "bottom");
            }
            //Colision LEFT
            if (ball.left() <= 0) {                
                BallSpeed.x *= -1
                //update score
                score.player2++;
                $("#score2").text(score.player2);
                createExplosion(ball, "left");
                removeBall(i);
                if(balls.length==0)
                    reset(); 
            }
            //Colision RIGHT
            if (ball.right() >= $(window).width()) {
                // reset();
                BallSpeed.x *= -1
                score.player1++;                
                $("#score1").text(score.player1);
                removeBall(i);
                if(balls.length==0)
                    reset();            
                if (computerSpeed < 20)
                    computerSpeed++;
                createExplosion(ball, "right");
            }

            if (ball.left() <= pongBar1.right() && ball.left() >= pongBar1.left() &&
            ball.bottom() >= pongBar1.top() && ball.top() <= pongBar1.bottom()) {
                BallSpeed.y -= (PrevMouseSpeed.y);
                BallSpeed.x = (-BallSpeed.x);
                ball.x = pongBar1.right();
            }

            if ((ball.right()) >= pongBar2.left() && (ball.right()) <= pongBar2.right() &&
            ball.bottom() >= pongBar2.top() && ball.top() <= pongBar2.bottom()) {
                BallSpeed.y -= (PrevMouseSpeed.y);
                BallSpeed.x = (-BallSpeed.x);
                ball.x = pongBar2.left() - ball.width;
            }

            var midPoint = (pongBar2.top() + (pongBar2.height / 2));

            if (ball.x > ($(window).width() / 2) && BallSpeed.x > 0) {
                if ((midPoint - ball.y) > computerSpeed)
                    pongBar2.y -= computerSpeed;
                if ((midPoint - ball.y) < 0)
                    pongBar2.y += computerSpeed;
            }
            //        else {
            //                                          
            //            var midWindow = ($(window).height() / 2);
            //            if ((midPoint - midWindow) > computerSpeed)
            //                pongBar2.y -= computerSpeed;
            //            if ((midPoint - midWindow) < 0)
            //                pongBar2.y += computerSpeed;
            //        }

            pongBar1.x = 0;
            pongBar2.x = ($(window).width() - pongBar2.width);

            //PONG BAR COLLISION BOTTOM
            //Colision BOTTOM
            if (pongBar1.bottom() >= $(window).height()) {
                pongBar1.y = $(window).height() - pongBar1.height;
            }
            if (pongBar2.bottom() >= $(window).height()) {
                pongBar2.y = $(window).height() - pongBar2.height;
            }

            //ITEMS
            //create random item
            if((Math.random()*500)<1)
            {
                items.push(createRandomItem());
            }
    
            //BALL COLLISION ITEMS      
            for(var l=0; l<items.length; l++)
            {
                var item = items[l];
                if(Math.abs(ball.centerX()-item.centerX())<=((ball.width/2)+(item.width/2))&&
                    Math.abs(ball.centerY()-item.centerY())<=((ball.height/2)+(item.height/2)))
                    {
                            switch(item.type)
                            {
                                case 1:
                                    CreateBall();
                                break;
                                
                                case 2:
                                    ball.width*=2;
                                    ball.height*=2;
                                break;
                                
                                case 3:
                                    BallSpeed.x*=3;
                                    BallSpeed.y*=3;
                                break;    
                                case 4:
                                    ball.width*=.5;
                                    ball.height*=.5;
                                    BallSpeed.x*=2;
                                    BallSpeed.y*=2;                                 
                                break;
                            }
                            removeItem(l);
                    }                                                                                       
            }
            //     
            drawBall(ball);
        }
        //items
        for(var l=0; l<items.length; l++)
        {
            var item = items[l];                
            item.lifeTime--;
            if(item.lifeTime<0)
            removeItem(l);
        }
        //particles
        for (i = 0; i < particles.length; i++) {
            particles[i].element.offset({ top: particles[i].y, left: particles[i].x });
            particles[i].x += particles[i].speedX;
            particles[i].y += particles[i].speedY;
            particles[i].lifeTime--;
            if (particles[i].lifeTime < 0) {
                removeParticle(i);
            }
        }
    };

    document.onkeydown = function (e) {
        if (e == null) { // ie 
            keycode = event.keyCode;
        } else { // mozilla 
            keycode = e.which;
        }
        if (keycode == 27) {
            clearAll();
        }
    };

    $(function () {
        createElements();
        reset();
        $('body').css({ cursor: 'none' });
        setInterval(function () {
            if (run) {
                getMousePosition();
                update();
                redraw();
            }
        }, 20);

    });
});



// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize game
const game = new Phaser.Game(config);

// Game variables
let player;
let ball;
let bricks;
let gameStarted = false;
let score = 0;
let scoreText;

function preload() {
    // No assets to preload for this simple version
}

function create() {
    // Create player paddle
    player = this.add.rectangle(400, 550, 100, 20, 0x00ff00);
    this.physics.add.existing(player, true);

    // Create ball
    ball = this.add.circle(400, 530, 10, 0xff0000);
    this.physics.add.existing(ball);
    ball.body.setCollideWorldBounds(true);
    ball.body.setBounce(1, 1);

    // Create bricks
    bricks = this.add.group();
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            const brick = this.add.rectangle(80 + j * 90, 60 + i * 30, 80, 20, 0x0000ff);
            this.physics.add.existing(brick, true);
            bricks.add(brick);
        }
    }

    // Add score text
    scoreText = this.add.text(650, 16, 'Score: 0', { 
        fontSize: '32px', 
        color: '#fff' 
    });

    // Add collision handlers
    this.physics.add.collider(ball, player);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);

    // Setup keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Player movement
    if (this.cursors.left.isDown && player.x > 50) {
        player.x -= 7;
    }
    if (this.cursors.right.isDown && player.x < 750) {
        player.x += 7;
    }

    // Start game on spacebar
    if (!gameStarted && this.cursors.space.isDown) {
        gameStarted = true;
        ball.body.setVelocity(-200, -200);
    }

    // Keep ball on paddle before game starts
    if (!gameStarted) {
        ball.x = player.x;
    }

    // Reset ball if it falls below paddle
    if (ball.y > 600) {
        resetBall();
    }
}

function hitBrick(ball, brick) {
    brick.destroy();
    score += 100;
    scoreText.setText('Score: ' + score);
}

function resetBall() {
    gameStarted = false;
    ball.setPosition(400, 530);
    ball.body.setVelocity(0, 0);
}
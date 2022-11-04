import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Phaser from 'phaser';
import { from } from 'rxjs';

class MainScene extends Phaser.Scene {
  private score = 0;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stepSize = 16;
  private blockLeftInput = false;
  private blockRightInput = false;
  private unblockLeftInputTimer!: Phaser.Time.TimerEvent;
  private unblockRightInputTimer!: Phaser.Time.TimerEvent;
  private unblockDelay = 100;
  private pointerStartX = 0;
  private pointerCurrentX = 0;
  private shapes: any;

  private border!: Phaser.GameObjects.Rectangle;
  private fundament!: Phaser.Physics.Matter.Sprite;
  private blocks!: Phaser.GameObjects.Group;
  private activeBlock?: Phaser.Physics.Matter.Sprite;

  constructor() {
    super({ key: 'main' });
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.shapes = this.cache.json.get('shapes');

    this.unblockLeftInputTimer = this.time.delayedCall(100, this.unblockLeftInput);
    this.unblockRightInputTimer = this.time.delayedCall(100, this.unblockRightInput);

    this.time.delayedCall(60000, () => {
      sessionStorage.setItem('score', this.score.toString());
      this.matter.pause();
      this.game.events.emit('shutdown');
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.pointerStartX = pointer.x;
      this.pointerCurrentX = pointer.x;
    });

    this.border = new Phaser.GameObjects.Rectangle(this, 400, 300, 800, 600);

    this.fundament = this.matter.add.sprite(400, 550, 'brick', undefined, { shape: this.shapes['brick'] } as Phaser.Types.Physics.Matter.MatterBodyConfig )
      .setDisplaySize(200, 100);
    this.fundament.setStatic(true);

    this.blocks = this.add.group();

    this.spawnBlock();

    this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      this.onCollision(event.pairs[0]);
    });
  }

  preload() {
    this.load.image('box', '/assets/images/box.webp');
    this.load.image('brick', '/assets/images/brick.jpg');
    this.load.image('l-left-yellow', 'assets/images/l-left-yellow.png');
    this.load.json('shapes', 'assets/collision-shapes.json');
  }

  override update() {
    this.handleUserInput();
    this.handleBlockOutOfBounds();
  }

  private handleBlockOutOfBounds() {
    if (this.activeBlock == null) {
      return;
    }

    const border = Phaser.Geom.Rectangle.Inflate(
      Phaser.Geom.Rectangle.Clone(this.border.geom),
      50,
      50);

    this.blocks.children.getArray().forEach(block => {
      if (!Phaser.Geom.Rectangle.ContainsRect(border, (block as Phaser.GameObjects.Sprite).getBounds())) {
        block.destroy();
        this.blocks.remove(block);

        if (block === this.activeBlock) {
          this.spawnBlock();
        }
      }
    });
  }

  private spawnBlock() {
    this.activeBlock = this.matter.add.sprite(
      Phaser.Math.Between(25, 775), 25,
      'l-left-yellow',
      undefined,
      { shape: this.shapes['l-left'] } as Phaser.Types.Physics.Matter.MatterBodyConfig);
    this.activeBlock.setScale(0.1, 0.1);

    this.blocks.add(this.activeBlock);

    this.activeBlock.setVelocityY(5);
    this.activeBlock.setFrictionAir(0);
    this.activeBlock.setIgnoreGravity(true);
  }

  private handleUserInput() {
    this.handleTouch();
    this.handleKeyboard();
  }

  private handleTouch() {
    if (this.activeBlock) {
      if (this.input.activePointer.isDown) {
        this.pointerCurrentX = this.input.activePointer.x;
        const xDiff = this.pointerCurrentX - this.pointerStartX;
        if (Math.abs(xDiff) > this.stepSize) {
          const remainder = xDiff % this.stepSize;
          const nrOfMoves = Math.floor(Math.abs(xDiff) / this.stepSize);
          if (xDiff > 0) {
            this.pointerStartX = this.pointerCurrentX - remainder + (nrOfMoves - 1) * this.stepSize;
            this.moveRightTouch(nrOfMoves);
          } else {
            this.pointerStartX = this.pointerCurrentX - remainder - (nrOfMoves - 1) * this.stepSize;
            this.moveLeftTouch(nrOfMoves);
          }
        }
      }
    }
  }

  private handleKeyboard() {
    if (this.activeBlock) {
      if (this.cursors.left.isDown)
      {
        if (this.canMoveLeft()) {
          this.moveLeftKeyboard();
        } else {
        }
      }
      else if (this.cursors.right.isDown)
      {
        if (this.canMoveRight()) {
          this.moveRightKeyboard();
        } else {
        }
      }

      if (this.cursors.left.isUp) {
        this.blockLeftInput = false;
      }
      if (this.cursors.right.isUp) {
        this.blockRightInput = false;
      }
    }
  }

  private canMoveLeft() {
    return !this.blockLeftInput && this.activeBlock!.getBounds().left - this.stepSize > 0;
  }

  private canMoveRight() {
    return !this.blockRightInput && this.activeBlock!.getBounds().right + this.stepSize < this.cameras.main.width
  }

  private moveLeftKeyboard() {
    if (this.activeBlock) {
      this.blockLeftInput = true;
      this.unblockLeftInputTimer.reset({
        delay: this.unblockDelay,
        callback: () => this.unblockLeftInput(),
      });
      this.time.addEvent(this.unblockLeftInputTimer);

      this.activeBlock.setX(this.activeBlock.x - this.stepSize);
    }
  }

  private moveRightKeyboard() {
    if (this.activeBlock) {
      this.blockRightInput = true;
      this.unblockRightInputTimer.reset({
        delay: this.unblockDelay,
        callback: () => this.unblockRightInput(),
      });
      this.time.addEvent(this.unblockRightInputTimer);
      this.activeBlock.setX(this.activeBlock.x + this.stepSize);
    }
  }

  private moveRightTouch(nrOfMoves = 1) {
    if (this.activeBlock) {
      for (let index = 0; index < nrOfMoves; index++) {
        if (this.canMoveRight()) {
          this.activeBlock!.setX(this.activeBlock.x + this.stepSize);
        }
      }
    }
  }

  private moveLeftTouch(nrOfMoves = 1) {
    if (this.activeBlock) {
      for (let index = 0; index < nrOfMoves; index++) {
        if (this.canMoveLeft()) {
          this.activeBlock!.setX(this.activeBlock.x - this.stepSize);
        }
      }
    }
  }

  private unblockLeftInput() {
    this.blockLeftInput = false;
  }
  private unblockRightInput() {
    this.blockRightInput = false;
  }

  private onCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData) {
    if (data.bodyA.parent !== this.activeBlock?.body && data.bodyB.parent !== this.activeBlock?.body) {
      return;
    }

    this.activeBlock?.setIgnoreGravity(false);

    this.spawnBlock();
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor(private readonly router: Router) {
    this.config = {
      type: Phaser.AUTO,
      height: 1600,
      width: 896,
      scene: [ MainScene ],
      parent: 'gameContainer',
      physics: {
        default: 'matter',
        matter: {
            debug: true
        },
      },
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
    this.phaserGame.events.once('shutdown', () => this.handleGameOver())
  }

  ngOnDestroy() {
    this.phaserGame.destroy(true);
  }

  private handleGameOver() {
    from(this.router.navigate(['/game-over'])).subscribe();
  }
}

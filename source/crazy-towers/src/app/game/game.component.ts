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

  private border!: Phaser.GameObjects.Rectangle;
  private fundament!: Phaser.Physics.Matter.Image;
  private blocks!: Phaser.GameObjects.Group;
  private activeBlock?: Phaser.Physics.Matter.Sprite;

  constructor() {
    super({ key: 'main' });
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

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

    this.fundament = this.matter.add.image(400, 550, 'brick')
      .setDisplaySize(200, 100);

    this.fundament.setStatic(true);

    this.blocks = this.add.group();

    this.spawnBlock();
  }

  preload() {
    console.log('preload method');
    this.load.image('box', '/assets/images/box.webp');
    this.load.image('brick', '/assets/images/brick.jpg');
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

    const blocksToRemove: Phaser.GameObjects.GameObject[] = [];
    this.blocks.children.getArray().forEach(block => {
      if (!Phaser.Geom.Rectangle.ContainsRect(border, (block as Phaser.GameObjects.Sprite).getBounds())) {
        block.destroy();
        blocksToRemove.push(block);

        if (block === this.activeBlock) {
          this.spawnBlock();
        }
      }
    });

    blocksToRemove.forEach(block => this.blocks.remove(block));
  }

  private spawnBlock() {
    this.activeBlock = this.matter.add.sprite(Phaser.Math.Between(25, 775), 25, 'box')
      .setDisplaySize(50, 50);

    this.blocks.add(this.activeBlock);

    this.activeBlock.setVelocityY(5);
    this.activeBlock.setFrictionAir(0);
    this.activeBlock.setIgnoreGravity(true);

    this.activeBlock.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.onCollision(data));
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
        const currentCenter = new Phaser.Math.Vector2();
        this.activeBlock.getCenter(currentCenter);
        if (this.canMoveLeft(currentCenter)) {
          this.moveLeftKeyboard(currentCenter);
        }
      }
      else if (this.cursors.right.isDown)
      {
        const currentCenter = new Phaser.Math.Vector2();
        this.activeBlock.getCenter(currentCenter);
        if (this.canMoveRight(currentCenter)) {
          this.moveRightKeyboard(currentCenter);
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

  private canMoveLeft(currentCenter: Phaser.Math.Vector2) {
    return !this.blockLeftInput && currentCenter.x > this.activeBlock!.width / 2;
  }

  private canMoveRight(currentCenter: Phaser.Math.Vector2) {
    return !this.blockRightInput && currentCenter.x + this.activeBlock!.width / 2 < this.cameras.main.width
  }

  private moveLeftKeyboard(currentCenter: Phaser.Math.Vector2) {
    this.blockLeftInput = true;
    this.unblockLeftInputTimer.reset({
      delay: this.unblockDelay,
      callback: () => this.unblockLeftInput(),
    });
    this.time.addEvent(this.unblockLeftInputTimer);

    this.activeBlock!.setPosition(currentCenter.x - this.stepSize, currentCenter.y);
  }

  private moveRightKeyboard(currentCenter: Phaser.Math.Vector2) {
    this.blockRightInput = true;
    this.unblockRightInputTimer.reset({
      delay: this.unblockDelay,
      callback: () => this.unblockRightInput(),
    });
    this.time.addEvent(this.unblockRightInputTimer);

    this.activeBlock!.setPosition(currentCenter.x + this.stepSize, currentCenter.y);
  }

  private moveRightTouch(nrOfMoves = 1) {
    for (let index = 0; index < nrOfMoves; index++) {
      const currentCenter = new Phaser.Math.Vector2();
      this.activeBlock!.getCenter(currentCenter);
      if (this.canMoveRight(currentCenter)) {
        this.activeBlock!.setPosition(currentCenter.x + this.stepSize, currentCenter.y);
      }
    }
  }

  private moveLeftTouch(nrOfMoves = 1) {
    for (let index = 0; index < nrOfMoves; index++) {
      const currentCenter = new Phaser.Math.Vector2();
      this.activeBlock!.getCenter(currentCenter);
      if (this.canMoveLeft(currentCenter)) {
        this.activeBlock!.setPosition(currentCenter.x - this.stepSize, currentCenter.y);
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
    if (data.bodyA !== this.activeBlock?.body && data.bodyB !== this.activeBlock?.body) {
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

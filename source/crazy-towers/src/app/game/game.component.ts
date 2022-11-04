import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

class MainScene extends Phaser.Scene {

  private activeBlock: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stepSize = 16;
  private blockLeftInput = false;
  private blockRightInput = false;
  private unblockLeftInputTimer!: Phaser.Time.TimerEvent;
  private unblockRightInputTimer!: Phaser.Time.TimerEvent;
  private unblockDelay = 100;
  private pointerStartX = 0;
  private pointerCurrentX = 0;

  constructor() {
    super({ key: 'main' });
  }
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.activeBlock = this.physics.add.image(400, 50, 'block');
    this.activeBlock.body.setAllowGravity(false);

    this.unblockLeftInputTimer = this.time.delayedCall(100, this.unblockLeftInput);
    this.unblockRightInputTimer = this.time.delayedCall(100, this.unblockRightInput);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.pointerStartX = pointer.x;
      this.pointerCurrentX = pointer.x;
    });
  }

  preload() {
    this.load.image('block', 'assets/placeholderBlock.png');
  }
  override update() {
    this.handleUserInput();
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
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 1600,
      width: 896,
      scene: [ MainScene ],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 }
        }
      },
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

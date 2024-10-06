export type State = 'IDLE' | 'MOVING' | 'DIGGING' | 'COMPLETED' | 'STANDING_UP' | 'SITTING_DOWN' | 'STANDING_DIG' | 'SITTING_DIG';

interface StateCaptcha {
  currentState: State;
  clickCount: number;
  maxClicks: number;
  isNearCoin: boolean;
  transition: (event: string) => void;
  reset: () => void;
}

const stateCaptcha: StateCaptcha = {
  currentState: 'IDLE',
  clickCount: 0,
  maxClicks: 3,
  isNearCoin: false,

  transition(event) {
    switch (this.currentState) {
      case 'IDLE':
        if (event === 'clickPlace' || !this.isNearCoin) {
          this.currentState = 'SITTING_DOWN';
          console.log(this.isNearCoin, event);
        } else if (this.isNearCoin) {
          this.currentState = 'SITTING_DIG';
        }
        break;
      case 'SITTING_DIG':
        if (event === 'animationEnd') {
          this.currentState = 'DIGGING';
          setTimeout(() => {
            if (this.clickCount < this.maxClicks - 1) {
              this.clickCount++;
              this.currentState = 'STANDING_DIG';
            } else {
              this.currentState = 'COMPLETED';
            }
          }, 1000);
        }
        break;
      case 'STANDING_DIG':
        if (event === 'animationEnd') {
          this.currentState = 'IDLE';
        }
        break;
      case 'SITTING_DOWN':
        if (event === 'animationEnd') {
          this.currentState = 'MOVING';
        }
        break;
      case 'MOVING':
        if (event === 'reachCoin') {
          this.currentState = 'STANDING_UP';
        }
        break;
      case 'STANDING_UP': // Состояние для анимации с четверенек в стоя
        if (event === 'animationEnd') {
          this.currentState = 'IDLE';
        }
        break;
      case 'COMPLETED':
        console.log('Монета откопана! Игра завершена.');
        break;
      default:
        break;
    }
  },
  reset() {
    this.currentState = 'IDLE';
    this.clickCount = 0;
    this.isNearCoin = false;
  },
};

export default stateCaptcha;

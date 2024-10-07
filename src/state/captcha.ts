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
        } else if (this.isNearCoin) {
          this.currentState = 'SITTING_DIG';
        }
        break;
      case 'SITTING_DIG':
        if (event === 'animationEnd') {
          this.currentState = 'DIGGING';
        }
        break;
      case 'DIGGING':
        if (event === 'animationEndDig') {
          this.clickCount++;
          this.currentState = 'STANDING_DIG';
        } else if (event === 'animationEndDig') {
          this.currentState = 'COMPLETED';
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
      case 'STANDING_UP':
        if (event === 'animationEnd') {
          this.currentState = 'IDLE';
        }
        break;
      case 'COMPLETED':
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

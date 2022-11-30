import { parseStringDurationInMilli } from '@airlabs-bonus/utils';

/* TODO: Is this going to be needed */
abstract class IBonusProvider {
  bonusRate!: number;
  currency!: string;

  abstract getBonusAmount(flightDuration: string): number;
}

enum BONUS_TYPE {
  DANGER = 'DANGER',
}

export class BonusService {
  constructor(private readonly bonusProvider: IBonusProvider) {}

  getBonusAmount(flightDuration: string) {
    return this.bonusProvider.getBonusAmount(flightDuration);
  }
}

export class DangerBonusService implements IBonusProvider {
  bonusRate: number;
  currency: string;

  constructor() {
    this.currency = 'EUR';
    this.bonusRate = 25.5;
  }

  getBonusAmount(flightDuration: string) {
    const flightDurationInMilliseconds = parseStringDurationInMilli(flightDuration);

    const bonusAmount = (flightDurationInMilliseconds / 3600000) * this.bonusRate;

    return Math.floor(bonusAmount);
  }
}

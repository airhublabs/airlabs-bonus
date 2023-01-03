/* eslint-disable @typescript-eslint/no-unused-vars */
interface Bonuses {
  emp: { contract: 'full' | 'half'; empType: 'employed' | 'contractor' };
  bonsues: { code: string }[];
}

interface BonusMap {
  code: string;
  price: number;
  contractType: Bonuses['emp']['contract'] | 'any';
  empType: Bonuses['emp']['empType'] | 'any';
}

const bonuses: Bonuses = {
  emp: {
    contract: 'full',
    empType: 'employed',
  },
  bonsues: [{ code: 'VNO' }, { code: 'JFK' }, { code: 'JFK' }, { code: 'JFK' }],
};

const BONUS_MAP: BonusMap[] = [
  {
    code: 'VNO',
    contractType: 'full',
    empType: 'employed',
    price: 5,
  },
  {
    code: 'JFK',
    contractType: 'full',
    empType: 'any',
    price: 2000,
  },
  {
    code: 'VNO',
    contractType: 'any',
    empType: 'any',
    price: 10,
  },
  {
    code: 'JFK',
    contractType: 'any',
    empType: 'any',
    price: 20,
  },
  {
    code: 'JFK',
    contractType: 'full',
    empType: 'employed',
    price: 5,
  },
];

interface CalculateSaleryParams {
  bonuses: Bonuses['bonsues'];
  map: BonusMap[];
  emp: Bonuses['emp'];
}

const sortBonusMap = () => {
  const bonusMapCopy = [...BONUS_MAP];

  return bonusMapCopy.sort((a, z) => {
    const aEntries = Object.entries(a);
    const zEntries = Object.entries(z);

    const aRanking = aEntries.reduce((acc, [k, v]) => {
      if (v === 'any') acc--;

      return acc;
    }, 0);
    const zRanking = zEntries.reduce((acc, [k, v]) => {
      if (v === 'any') acc--;

      return acc;
    }, 0);

    return zRanking - aRanking;
  });
};

const findCritera = (bonus: Omit<BonusMap, 'price'>) => {
  const sortedMap = sortBonusMap();

  const foundCritera = sortedMap.find((critera) => {
    const matchingCode = critera.code === bonus.code;
    const matchingCritera =
      critera.contractType === 'any' || critera.contractType === bonus.contractType;
    const matchingEmpType = critera.empType === 'any' || critera.empType === bonus.empType;

    if (matchingCode && matchingCritera && matchingEmpType) return critera;
  });

  return foundCritera;
};

const calculateSalery = (params: CalculateSaleryParams) => {
  const { bonuses, emp, map } = params;

  return bonuses.reduce((acc, bonus) => {
    const critera = findCritera({
      code: bonus.code,
      contractType: emp.contract,
      empType: emp.empType,
    });

    if (critera) acc += critera.price;

    return acc;
  }, 0);
};

const result = calculateSalery({
  bonuses: bonuses['bonsues'],
  emp: bonuses['emp'],
  map: BONUS_MAP,
});

interface IBonusMap {
  employementStatus: 'employed' | 'any';
  contractType: 'any' | 'standard';
  position: 'cabin' | 'flight';
  qualShortCode: 'any' | string;
  rankShortCode: 'any' | string;
  crewHomeBase: 'any' | string;
  alpha3Code: string | 'any';
  rate: number;
}

interface PayCalculatorServiceParams {
  employee: {
    employementStatus: 'employed' | 'any';
    contractType: 'any' | 'standard';
    position: 'cabin' | 'flight';
  };
  bonuses: { code: string }[];
  bonusMap: IBonusMap[];
}

class PayCalculatorService {
  constructor(private readonly params: PayCalculatorServiceParams) {
    this.params.bonusMap = this.sortBonusMap(this.params.bonusMap);
  }

  private sortBonusMap(map: IBonusMap[]) {
    const bonusMapCopy = [...this.params.bonusMap];

    return bonusMapCopy.sort((a, z) => {
      const aEntries = Object.entries(a);
      const zEntries = Object.entries(z);

      const aRanking = aEntries.reduce((acc, [k, v]) => {
        if (v === 'any') acc--;

        return acc;
      }, 0);
      const zRanking = zEntries.reduce((acc, [k, v]) => {
        if (v === 'any') acc--;

        return acc;
      }, 0);

      return zRanking - aRanking;
    });
  }

  private isMatchingCritera(params: { condtion: string; checking: string }) {
    return params.checking === params.condtion || params.checking === 'any';
  }

  private findBonusMap(params: Omit<IBonusMap, 'rate'>) {
    const foundCritera = this.params.bonusMap.find((critera) => {
      const matchingContractType = this.isMatchingCritera({
        checking: critera.contractType,
        condtion: params.contractType,
      });
      const matchingPosition = this.isMatchingCritera({
        checking: critera.position,
        condtion: params.position,
      });
      const matchingQualShortCode = this.isMatchingCritera({
        checking: critera.qualShortCode,
        condtion: params.qualShortCode,
      });
      const matchingRankShortCode = this.isMatchingCritera({
        checking: critera.rankShortCode,
        condtion: params.rankShortCode,
      });

      if (
        matchingContractType &&
        matchingPosition &&
        matchingQualShortCode &&
        matchingRankShortCode
      )
        return critera;

      return undefined;
    });

    return foundCritera;
  }

  public calculateSalery() {
    const { bonuses, employee, bonusMap } = this.params;

    return bonuses.reduce((acc: any, bonus: any) => {
      // if (critera) acc += critera.price;

      return acc;
    }, 0);
  }
}

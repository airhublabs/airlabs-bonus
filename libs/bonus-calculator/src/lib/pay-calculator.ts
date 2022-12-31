/*
Critera:

- Contract type
- Location
- Emp Type
*/

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
    contractType: 'any',
    empType: 'any',
    price: 10,
  },
  {
    code: 'JFK',
    contractType: 'full',
    empType: 'any',
    price: 2000,
  },
  {
    code: 'VNO',
    contractType: 'full',
    empType: 'employed',
    price: 5,
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
    const aContract = a.contractType !== 'any' ? -1 : 1;
    const zContract = z.contractType !== 'any' ? -1 : 1;

    const aEmpType = a.empType !== 'any' ? -1 : 1;
    const zEmpType = z.empType !== 'any' ? -1 : 1;

    return aContract - zContract + (aEmpType - zEmpType);

    return 0;
  });
};

const findCritera = (bonus: Omit<BonusMap, 'price'>) => {
  const sortedMap = sortBonusMap();

  const foundCritera = sortedMap.find(critera => {
    const matchingCode = critera.code === bonus.code;
    const matchingCritera = critera.contractType === 'any' || critera.contractType === bonus.contractType;
    const matchingEmpType = critera.empType === 'any' || critera.empType === bonus.empType;

    if (matchingCode && matchingCritera && matchingEmpType) return critera;
  });

  return foundCritera;
};

const calculateSalery = (params: CalculateSaleryParams) => {
  const { bonuses, emp, map } = params;

  return bonuses.reduce((acc, bonus) => {
    const critera = findCritera({ code: bonus.code, contractType: emp.contract, empType: emp.empType });

    if (critera) acc += critera.price;

    return acc;
  }, 0);
};

const result = calculateSalery({ bonuses: bonuses['bonsues'], emp: bonuses['emp'], map: BONUS_MAP });

console.log(result);

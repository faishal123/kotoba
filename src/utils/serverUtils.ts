import {
  basicNumberUnits,
  biggestNumberAllowed,
  chouUnit,
  hyakuUnit,
  jyuuUnit,
  keiUnit,
  manUnit,
  numberUnits,
  okuUnit,
  senUnit,
  UnitType,
} from "@/constant/numberUnits";

export const randomizeArray = <T>(array: T[]): T[] => {
  return array.sort(() => 0.5 - Math.random());
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type TranslatedNumberToJapanese = {
  number: bigint;
  kanji: string;
  kana: string;
};

export const translateNumberToJapanese = (
  numParam: string
): TranslatedNumberToJapanese | undefined => {
  const keiNumber = BigInt(keiUnit?.number);
  const chouNumber = BigInt(chouUnit?.number);
  const okuNumber = BigInt(okuUnit?.number);
  const manNumber = BigInt(manUnit?.number);
  const senNumber = BigInt(senUnit?.number);
  const hyakuNumber = BigInt(hyakuUnit?.number);
  const jyuuNumber = BigInt(jyuuUnit?.number);

  const num = BigInt(
    numParam.includes(".") ? numParam.replaceAll(".", "") : numParam
  );

  if (num > biggestNumberAllowed) {
    throw new Error(
      `Number exceeds the biggest number allowed which is ${biggestNumberAllowed}`
    );
  }

  const getComponent = ({
    component,
    unit,
    max4Digits,
  }: {
    component: bigint;
    unit?: UnitType;
    max4Digits?: boolean;
  }) => {
    if (component <= 0n) {
      return undefined;
    }

    let componentFixed: string | bigint = `${component}`;
    if (max4Digits && componentFixed) {
      componentFixed = componentFixed.slice(
        componentFixed.length - 4,
        componentFixed.length
      );
    }
    componentFixed = BigInt(componentFixed);

    const specialSpelling = numberUnits.find(
      (n) =>
        !n.isUnit &&
        n.number === `${componentFixed * BigInt(unit?.number || "1")}`
    );
    if (specialSpelling) {
      return { ...specialSpelling, number: componentFixed };
    }

    if (max4Digits) {
      const recursivelyTranslatedComponent = translateNumberToJapanese(
        `${componentFixed}`
      );
      return {
        number: componentFixed,
        kanji: `${recursivelyTranslatedComponent?.kanji}${unit?.kanji || ""}`,
        kana: `${recursivelyTranslatedComponent?.kana}${unit?.kana || ""}`,
      };
    }

    const componentBasicUnit = basicNumberUnits[`${componentFixed}`];
    const componentKanji = `${componentBasicUnit?.kanji}${unit?.kanji || ""}`;
    const componentKana = `${componentBasicUnit?.kana}${unit?.kana || ""}`;
    return {
      number: componentFixed,
      kanji: componentKanji,
      kana: componentKana,
    };
  };

  let keiComponent;
  if (num >= keiNumber) {
    keiComponent = getComponent({
      component: num / keiNumber,
      unit: keiUnit,
      max4Digits: true,
    });
  }

  let chouComponent;
  if (num >= chouNumber) {
    chouComponent = getComponent({
      component: num / chouNumber,
      unit: chouUnit,
      max4Digits: true,
    });
  }

  let okuComponent;
  if (num >= okuNumber) {
    okuComponent = getComponent({
      component: num / okuNumber,
      unit: okuUnit,
      max4Digits: true,
    });
  }

  let manComponent;
  if (num >= manNumber) {
    manComponent = getComponent({
      component: num / manNumber,
      unit: manUnit,
      max4Digits: true,
    });
  }

  let senComponent;
  if (num >= senNumber) {
    senComponent = getComponent({
      component: (num % (senNumber * 10n)) / senNumber,
      unit: senUnit,
    });
  }

  let hyakuComponent;
  if (num >= hyakuNumber) {
    hyakuComponent = getComponent({
      component: (num % (hyakuNumber * 10n)) / hyakuNumber,
      unit: hyakuUnit,
    });
  }

  let jyuuComponent;
  if (num >= jyuuNumber) {
    jyuuComponent = getComponent({
      component: (num % (jyuuNumber * 10n)) / jyuuNumber,
      unit: jyuuUnit,
    });
  }

  let ichiComponent;
  if (num >= 1) {
    ichiComponent = getComponent({ component: num % 10n });
  }

  return [
    keiComponent,
    chouComponent,
    okuComponent,
    manComponent,
    senComponent,
    hyakuComponent,
    jyuuComponent,
    ichiComponent,
  ].reduce<TranslatedNumberToJapanese>(
    (a, c) => {
      if (!c) {
        return {
          ...a,
          number: BigInt(`${a?.number || 0}0`),
        };
      }
      const currentNumber = c?.number;
      const currentKanji = c?.kanji;
      const currentKana = c?.kana;

      return {
        ...a,
        number: BigInt(`${a?.number ?? ""}${currentNumber ?? ""}`),
        kanji: `${a?.kanji ?? ""}${currentKanji ?? ""}`,
        kana: `${a?.kana ?? ""}${currentKana ?? ""}`,
      };
    },
    { number: 0n, kanji: "", kana: "" }
  );
};

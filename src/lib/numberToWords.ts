// Convert numbers to French words for FCFA amounts
export function numberToFrenchWords(num: number): string {
  if (num === 0) return "zéro";

  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

  function convertLessThanThousand(n: number): string {
    if (n === 0) return "";
    
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    const ten = Math.floor(remainder / 10);
    const unit = remainder % 10;
    
    let result = "";
    
    if (hundred > 0) {
      if (hundred === 1) {
        result = "cent";
      } else {
        result = units[hundred] + " cent";
      }
      if (remainder > 0) {
        result += " ";
      } else if (hundred > 1) {
        result += "s";
      }
    }
    
    if (remainder >= 10 && remainder < 20) {
      result += teens[remainder - 10];
    } else {
      if (ten === 7 || ten === 9) {
        const adjustedTen = ten === 7 ? 6 : 8;
        result += tens[adjustedTen];
        if (unit > 0 || ten === 7) {
          result += "-";
          const adjustedUnit = ten === 7 ? 10 + unit : 10 + unit;
          if (adjustedUnit < 20) {
            result += teens[adjustedUnit - 10];
          }
        }
      } else {
        if (ten > 0) {
          result += tens[ten];
          if (unit === 1 && ten === 8) {
            result += "-";
          } else if (unit > 0) {
            result += "-";
          }
        }
        if (unit > 0) {
          if (unit === 1 && ten === 8) {
            result += "un";
          } else {
            result += units[unit];
          }
        }
        if (ten === 8 && unit === 0) {
          result += "s";
        }
      }
    }
    
    return result;
  }

  const billion = Math.floor(num / 1000000000);
  const million = Math.floor((num % 1000000000) / 1000000);
  const thousand = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;

  let words = "";

  if (billion > 0) {
    if (billion === 1) {
      words += "un milliard";
    } else {
      words += convertLessThanThousand(billion) + " milliards";
    }
  }

  if (million > 0) {
    if (words) words += " ";
    if (million === 1) {
      words += "un million";
    } else {
      words += convertLessThanThousand(million) + " millions";
    }
  }

  if (thousand > 0) {
    if (words) words += " ";
    if (thousand === 1) {
      words += "mille";
    } else {
      words += convertLessThanThousand(thousand) + " mille";
    }
  }

  if (remainder > 0) {
    if (words) words += " ";
    words += convertLessThanThousand(remainder);
  }

  return words;
}

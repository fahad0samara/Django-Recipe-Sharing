// Unit conversion utility
export const cookingConverter = {
  // Volume conversions
  volume: {
    tbspToMl: (tbsp) => tbsp * 14.787,
    cupsToMl: (cups) => cups * 236.588,
    mlToCups: (ml) => ml / 236.588,
    mlToTbsp: (ml) => ml / 14.787,
    literToMl: (l) => l * 1000,
    mlToLiter: (ml) => ml / 1000,
    flozToMl: (floz) => floz * 29.5735,
    mlToFloz: (ml) => ml / 29.5735,
    pintToMl: (pint) => pint * 473.176,
    mlToPint: (ml) => ml / 473.176,
    quartToMl: (quart) => quart * 946.353,
    mlToQuart: (ml) => ml / 946.353,
    gallonToMl: (gallon) => gallon * 3785.41,
    mlToGallon: (ml) => ml / 3785.41
  },

  // Weight conversions
  weight: {
    ozToGrams: (oz) => oz * 28.3495,
    lbsToGrams: (lbs) => lbs * 453.592,
    gramsToOz: (g) => g / 28.3495,
    gramsToLbs: (g) => g / 453.592,
    kgToGrams: (kg) => kg * 1000,
    gramsToKg: (g) => g / 1000,
    stoneToGrams: (stone) => stone * 6350.29,
    gramsToStone: (g) => g / 6350.29
  },

  // Temperature conversions
  temperature: {
    fToC: (f) => (f - 32) * 5/9,
    cToF: (c) => (c * 9/5) + 32,
    cToK: (c) => c + 273.15,
    kToC: (k) => k - 273.15,
    fToK: (f) => (f - 32) * 5/9 + 273.15,
    kToF: (k) => (k - 273.15) * 9/5 + 32
  },

  // Common cooking conversions
  cooking: {
    stickOfButterToGrams: (sticks) => sticks * 113.4,
    gramsToStickOfButter: (g) => g / 113.4,
    cupOfFlourToGrams: (cups) => cups * 120,
    gramsToCupOfFlour: (g) => g / 120,
    cupOfSugarToGrams: (cups) => cups * 200,
    gramsToCupOfSugar: (g) => g / 200,
    cupOfRiceToGrams: (cups) => cups * 185,
    gramsToCupOfRice: (g) => g / 185
  },

  // Convert between any supported units
  convert(value, fromUnit, toUnit) {
    // Normalize units to ml for volume and grams for weight
    const normalizers = {
      // Volume
      'tbsp': (v) => this.volume.tbspToMl(v),
      'cup': (v) => this.volume.cupsToMl(v),
      'ml': (v) => v,
      'l': (v) => this.volume.literToMl(v),
      'floz': (v) => this.volume.flozToMl(v),
      'pint': (v) => this.volume.pintToMl(v),
      'quart': (v) => this.volume.quartToMl(v),
      'gallon': (v) => this.volume.gallonToMl(v),
      
      // Weight
      'oz': (v) => this.weight.ozToGrams(v),
      'lb': (v) => this.weight.lbsToGrams(v),
      'g': (v) => v,
      'kg': (v) => this.weight.kgToGrams(v),
      'stone': (v) => this.weight.stoneToGrams(v)
    };

    const denormalizers = {
      // Volume
      'tbsp': (v) => this.volume.mlToTbsp(v),
      'cup': (v) => this.volume.mlToCups(v),
      'ml': (v) => v,
      'l': (v) => this.volume.mlToLiter(v),
      'floz': (v) => this.volume.mlToFloz(v),
      'pint': (v) => this.volume.mlToPint(v),
      'quart': (v) => this.volume.mlToQuart(v),
      'gallon': (v) => this.volume.mlToGallon(v),
      
      // Weight
      'oz': (v) => this.weight.gramsToOz(v),
      'lb': (v) => this.weight.gramsToLbs(v),
      'g': (v) => v,
      'kg': (v) => this.weight.gramsToKg(v),
      'stone': (v) => this.weight.gramsToStone(v)
    };

    if (normalizers[fromUnit] && denormalizers[toUnit]) {
      const normalized = normalizers[fromUnit](value);
      return denormalizers[toUnit](normalized);
    }

    throw new Error('Unsupported unit conversion');
  }
};
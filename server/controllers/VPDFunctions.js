// Výpočet SVP (nasycený tlak vodní páry)
function calculateSVP(tempC) {
  return 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

// Výpočet VPD (Vapor Pressure Deficit)
function calculateVPD(tempC, rh) {
  const svp = calculateSVP(tempC);
  const vpd = svp * (1 - rh / 100);
  return Math.round(vpd * 100) / 100;
}

// Výpočet Leaf VPD (Leaf Vapor Pressure Deficit)
function calculateLeafVPD(airTempC, leafTempC, rh) {
  const svpAir = calculateSVP(airTempC);
  const svpLeaf = calculateSVP(leafTempC);
  const leafVPD = svpLeaf - svpAir * (rh / 100);
  return Math.round(leafVPD * 100) / 100;
}

// Výpočet RH pro požadovaný Leaf VPD
function calculateRHForLeafVPD(airTempC, targetVPD, leafTempC) {
  const svpAir = calculateSVP(airTempC);
  const svpLeaf = calculateSVP(leafTempC);
  const rh = ((svpLeaf - targetVPD) / svpAir) * 100;
  return Math.round(rh * 100) / 100;
}

// Výpočet RH pro požadovaný VPD
function calculateRHForVPD(tempC, targetVPD, leafTempC) {
  const svpLeaf = calculateSVP(leafTempC);
  const rh = 100 * (1 - targetVPD / svpLeaf);
  return Math.round(rh * 100) / 100;
}

// Export funkcí, aby je bylo možné použít v jiných souborech
module.exports = {
  calculateSVP,
  calculateVPD,
  calculateLeafVPD,
  calculateRHForLeafVPD,
  calculateRHForVPD,
};

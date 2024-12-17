import * as React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

// Funkce pro interpolaci barvy mezi zelenou, žlutou a červenou s flexibilním rozsahem
const getColorForValue = (value: number, optimalValue: number, minValue: number, maxValue: number) => {
  let red = 0;
  let green = 0;
  let blue = 0;

  // Procentuální hodnota v rámci rozsahu
  const percentage = (value - minValue) / (maxValue - minValue);

  if (value < optimalValue) {
    // Interpolace mezi zelenou a žlutou pro hodnoty menší než optimální
    green = Math.floor(percentage * 255); // Zelená roste, když se hodnota blíží optimální
    red = Math.floor(((optimalValue - value) / (optimalValue - minValue)) * 255); // Červená roste, když je hodnota menší než optimální
    blue = 0; // Modrá zůstává nulová
  } else {
    // Interpolace mezi žlutou a červenou pro hodnoty větší než optimální
    red = Math.floor(((value - optimalValue) / (maxValue - optimalValue)) * 255); // Červená roste, když hodnota roste
    green = Math.floor(((maxValue - value) / (maxValue - optimalValue)) * 255); // Zelená klesá, když hodnota roste
    blue = 0; // Modrá zůstává nulová
  }

  return `rgb(${red}, ${green}, ${blue})`; // Vytvoří barvu s RGB hodnotami
};

// const settings = {
//   width: 200,
//   height: 200,
//   value: 1000, // Můžete změnit tuto hodnotu pro testování
//   optimalValue: 1000, // Můžete změnit tuto hodnotu pro testování
//   minValue: 400, // Můžete změnit minimální hodnotu
//   maxValue: 1600, // Můžete změnit maximální hodnotu
// };
interface ArcDesignProps {
  value: number;
  min: number;
  max: number;
  opt: number;
  name: string;
}
export default function ArcDesign({ value, min, max, opt, name }: ArcDesignProps) {
  const settings = {
    width: 200,
    height: 200,
    value: value, // Můžete změnit tuto hodnotu pro testování
    optimalValue: opt, // Můžete změnit tuto hodnotu pro testování
    minValue: min, // Můžete změnit minimální hodnotu
    maxValue: max, // Můžete změnit maximální hodnotu
  };

  // Přepočítáme hodnotu do procenta v rámci rozsahu a omezíme ji mezi 0 a 100
  let percentage = ((settings.value - settings.minValue) / (settings.maxValue - settings.minValue)) * 100;
  if (percentage < 0) percentage = 0; // Pokud je hodnota menší než minimum, nastavíme ji na 0
  if (percentage > 100) percentage = 100; // Pokud je hodnota větší než maximum, nastavíme ji na 100

  // Dynamicky získáme barvu pro jméno
  const nameColor = getColorForValue(settings.value, settings.optimalValue, settings.minValue, settings.maxValue);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Gauge
        {...settings}
        value={percentage} // Představujeme hodnotu jako procento z rozsahu, omezené mezi 0 a 100
        cornerRadius="50%"
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 40,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: getColorForValue(settings.value, settings.optimalValue, settings.minValue, settings.maxValue), // Barva podle hodnoty
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
      <p className="text-lg font-semibold text-gray-700 mt-2">
        <span className="text-gray-500">{name}: </span>
        <span style={{ color: nameColor }}>{value != null ? value.toFixed(2) : 'N/A'}</span>
      </p>
    </div>
  );
}

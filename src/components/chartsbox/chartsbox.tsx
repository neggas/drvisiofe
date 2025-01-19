"use client";
import React from "react";
import { LineChart, Line, Tooltip, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, LabelList, Label, Dot, AreaChart, Area } from "recharts";
import { DynamicHtmlTag } from "../ui";
import { generateGraphRanges, getGrafDate } from "@/utility";

// Define the translation mapping for the names
// Define the available translation keys
type TranslationKey = "Height (cm)" | "Weight (kg)" | "BMI Zone 1" | "BMI Zone 2" | "BMI Zone 3";

const translations: Record<TranslationKey, string> = {
  "Height (cm)": "Hauteur (cm)",
  "Weight (kg)": "Poids (kg)",
  "BMI Zone 1": "Zone IMC 1",
  "BMI Zone 2": "Zone IMC 2",
  "BMI Zone 3": "Zone IMC 3",
};

// Function to translate to French with a fallback for unknown names
const translateToFrench = (name: string): string => {
  // Check if the name is a valid TranslationKey and return the translated value, else return the original name
  return translations[name as TranslationKey] || name;
};

interface ChartDataItem {
  name: string;
  value: number;
}

interface BMIChartDataItem extends ChartDataItem {
  color: string;
}

interface ChartBoxProps {
  chartType: string;
  title: string;
  chartData: ChartDataItem[] | BMIChartDataItem[];
  isSuccess: boolean;
  bottomText?: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <DynamicHtmlTag type="div" className="custom-tooltip">
        <DynamicHtmlTag type="p" className="label">
          {`${translateToFrench(payload[0].payload.name as TranslationKey)} : ${payload[0].value}`}
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    );
  }
  return null;
};
const generateBMIResults = () => {
  const bmiResults = [];

  for (let height = 130; height <= 210; height += 10) {
    // Set the total weight to 120 kg for each height
    const totalWeight = 120;

    // Distribute the total weight across categories using more appropriate proportions
    let sousPoids = Math.round(totalWeight * 0.15); // 15% of total weight
    let poidsIdéal = Math.round(totalWeight * 0.35); // 35% of total weight
    let surpoids = Math.round(totalWeight * 0.2); // 20% of total weight
    let faibleObésité = Math.round(totalWeight * 0.1); // 10% of total weight
    let obésitéMoyenne = Math.round(totalWeight * 0.1); // 10% of total weight
    let obésitéSévère = Math.round(totalWeight * 0.1); // 10% of total weight

    // Ensure that the sum of all categories equals 120 kg
    const actualTotal = sousPoids + poidsIdéal + surpoids + faibleObésité + obésitéMoyenne + obésitéSévère;

    // If there's any discrepancy due to rounding, adjust the largest category
    const discrepancy = totalWeight - actualTotal;
    if (discrepancy !== 0) {
      poidsIdéal += discrepancy; // Adjusting the largest category (poidsIdéal) for simplicity
    }

    // Push the results into the array
    bmiResults.push({
      height,
      sousPoids,
      poidsIdéal,
      surpoids,
      faibleObésité,
      obésitéMoyenne,
      obésitéSévère,
    });
  }

  return bmiResults;
};

const flattenedBMIResults = generateBMIResults();
const ChartBox: React.FC<ChartBoxProps> = ({ chartData, title, chartType, isSuccess, bottomText }) => {
  if (isSuccess && chartData.length > 0) {
    const chartDataWithValues = chartData.map(item => ({ value: item.value }));
    const { ticks, domain } = generateGraphRanges(chartDataWithValues);

    return (
      <DynamicHtmlTag type="div" className="w-full h-full flex flex-col justify-between">
        <DynamicHtmlTag type="div" className="flex-col items-start mb-4 hidden">
          <DynamicHtmlTag type="span" className="uppercase text-[2vw] md:text-3xs lg:text-2xs xl:text-xs leading-tight font-bold">
            {title}
          </DynamicHtmlTag>
        </DynamicHtmlTag>

        {chartType === "lineweight" && (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" fontSize="5px" />
              <XAxis dataKey="name" tickFormatter={value => getGrafDate(value)} tick={{ fontSize: 8 }} />
              <YAxis ticks={ticks} tickFormatter={value => `${value.toLocaleString()}`} tick={{ fontSize: 8 }} domain={domain} />
              <Tooltip
                content={<CustomTooltip fontSize={3} />}
                contentStyle={{
                  background: "#00BFFF",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  padding: "5px",
                  fontSize: "6px",
                }}
              />
              <Bar dataKey="value" fill="#8884d8" fontSize={3} />
              <Line type="monotone" dataKey="value" stroke="#00BFFF" strokeWidth={2} fontSize={3} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "lineHeight" && (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickFormatter={value => getGrafDate(value)} tick={{ fontSize: 8 }} />
              <YAxis ticks={ticks} tickFormatter={value => `${value.toLocaleString()}`} tick={{ fontSize: 8 }} domain={domain} />
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{
                  background: "#00BFFF",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  padding: "5px",
                  fontSize: "6px",
                }}
              />
              <Bar dataKey="value" fill="#8884d8" fontSize="5px" />
              <Line type="monotone" dataKey="value" stroke="#00BFFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "BMIChart" && (
          <div className="chartWrapper">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={flattenedBMIResults} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="colorObésitéSévère" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#89CFF0" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorObésitéMoyenne" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C3E4A8" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorFaibleObésité" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorSurpoids" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFE699" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorPoidsIdéal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFA500" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorSousPoids" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6347" stopOpacity={1} />
                  </linearGradient>
                </defs>

                {/* X and Y Axis */}
                <XAxis dataKey="height" label={{ value: "Taille (cm)", position: "insideBottom", offset: -10 }} />
                <YAxis domain={[0, 100]} label={{ value: "Poids (kg)", angle: -90, position: "insideLeft" }} />
                <CartesianGrid strokeDasharray="3 3" />

                {/* Stacked Area Charts for Different BMI Categories */}
                <Area type="monotone" dataKey="obésitéSévère" stackId="1" stroke="none" fill="url(#colorObésitéSévère)" />
                <Area type="monotone" dataKey="obésitéMoyenne" stackId="1" stroke="none" fill="url(#colorObésitéMoyenne)" />
                <Area type="monotone" dataKey="faibleObésité" stackId="1" stroke="none" fill="url(#colorFaibleObésité)" />
                <Area type="monotone" dataKey="surpoids" stackId="1" stroke="none" fill="url(#colorSurpoids)" />
                <Area type="monotone" dataKey="poidsIdéal" stackId="1" stroke="none" fill="url(#colorPoidsIdéal)" />
                <Area type="monotone" dataKey="sousPoids" stackId="1" stroke="none" fill="url(#colorSousPoids)" />

                {/* Labels for Categories */}
                <text x="85%" y="240" fill="#000" fontSize="14">
                  Sous poids
                </text>
                <text x="70%" y="220" fill="#000" fontSize="14">
                  Poids idéal
                </text>
                <text x="55%" y="190" fill="#000" fontSize="14">
                  Surpoids
                </text>
                <text x="40%" y="150" fill="#000" fontSize="14">
                  Faible obésité
                </text>
                <text x="20%" y="85" fill="#000" fontSize="14">
                  Obésité moyenne
                </text>
                <text x="10%" y="32" fill="#000" fontSize="14">
                  Obésité sévère
                </text>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {bottomText && (
          <DynamicHtmlTag type="span" className="text-right uppercase text-[2vw] md:text-3xs lg:text-2xs xl:text-xs leading-tight font-bold">
            {bottomText}
          </DynamicHtmlTag>
        )}
      </DynamicHtmlTag>
    );
  }

  return null;
};

export default ChartBox;

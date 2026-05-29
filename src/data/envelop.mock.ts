// mock/envelop.mock.ts
import { BorderStyle } from "~/types/envelop/envelop.type";
import { EnvelopeType } from "~/types/envelop/envelop.type";
import { FontFamily } from "~/types/font-family.enums";

import procreatePaper from "~/assets/images/papers/procreate-paper.jpg";
import stripesPaper from "~/assets/images/papers/stripes-paper.png";
import cardBoardPaper from "~/assets/images/papers/cardboard-paper.jpg";

import redSeal from "~/assets/images/seals/red-seal.jpg";
import goldenSeal from "~/assets/images/seals/golden-seal.png";
import greenSeal from "~/assets/images/seals/green-seal.jpg";

import defaultStamp from "~/assets/images/stamps/banana-stamp.jpg";
import airmailStamp from  "~/assets/images/stamps/green-stamp.jpg";

export const getNewCustomEnvelope = (id?: string): EnvelopeType => {
  const resolvedId = id ?? crypto.randomUUID();
  return {
    id: resolvedId,
    name: resolvedId,
    textColor: "black",
    fontStyle: FontFamily.ARIAL,
    backgroundColor: "white",
    backgroundUrl: procreatePaper,
    borderStyle: BorderStyle.STRIPED,
    borderColors: ["red", "transparent", "blue"],
  };
};

// Export as array directly
export const envelopePresets: EnvelopeType[] = [
  {
    id: "default",
    name: "Airmail",
    textColor: "black",
    fontStyle: FontFamily.ARIAL,
    backgroundColor: "white",
    backgroundUrl: procreatePaper,
    borderStyle: BorderStyle.STRIPED,
    borderColors: ["red", "transparent", "blue"],
  },
  // border none presets
  {
    id: "simple_white",
    name: "Simple White",
    textColor: "#000099",
    fontStyle: FontFamily.GEORGIA,
    borderStyle: BorderStyle.NONE,
    backgroundColor: "linear-gradient(to left, #cccccc, white)",
  },
  {
    id: "simple_green",
    name: "Simple Green",
    textColor: "white",
    borderStyle: BorderStyle.NONE,
    backgroundUrl: procreatePaper,
    backgroundColor: "#4A7C59",
  },

  // border solid presets
  {
    id: "solid_brown",
    name: "Solid Brown",
    textColor: "#3E2723",
    borderStyle: BorderStyle.SOLID,
    borderColors: ["#795548"],
    backgroundColor: "#F5E6D3",
    stampUrl: { imageUrl: defaultStamp },
    seal: { color: "#795548", icon: "circle" },
  },

  // border solid with hidden borders - vertical (hide top and bottom)
  {
    id: "solid_blue_vertical",
    name: "Solid Blue Vertical",
    textColor: "#1A3A4A",
    borderStyle: BorderStyle.SOLID,
    borderColors: ["#2C5F8A"],
    hiddenBorders: ["top", "bottom"],
    backgroundColor: "#E8F0F8",
    backgroundUrl: stripesPaper,
    stampUrl: { imageUrl: defaultStamp },
  },
  // border striped presets (airmail style)
  {
    id: "airmail_red",
    name: "Airmail Red",
    textColor: "#4A1A1A",
    fontStyle: FontFamily.COURIER_NEW,
    borderStyle: BorderStyle.STRIPED,
    borderColors: ["#C62828", "#E57373", "blue"],
    backgroundColor: "#FFF5F5",
    stampUrl: { imageUrl: airmailStamp },
  },
  {
    id: "airmail_green",
    name: "Airmail Green",
    textColor: "#1B3B2B",
    borderStyle: BorderStyle.STRIPED,
    borderColors: ["#2E7D32", "#66BB6A"],
    backgroundColor: "#F1F8E9",
    stampUrl: { imageUrl: airmailStamp },
  },

  // border double presets
  {
    id: "double_blue",
    name: "Double Blue",
    textColor: "#1A3A4A",
    borderStyle: BorderStyle.DOUBLE,
    borderColors: ["#E3F2FD", "#5BA3D9"],
    hiddenBorders: ["left", "right"],
    backgroundColor: "#E3F2FD",
    seal: { imageUrl: goldenSeal, icon: "anchor" },
  },
  {
    id: "double_yellow_red",
    name: "Double Yellow Red",
    textColor: "#4A1A1A",
    fontStyle: FontFamily.MONOSPACE,
    borderStyle: BorderStyle.DOUBLE,
    borderColors: ["#FFF9C4", "#D32F2F", "#D32F2F"],
    backgroundColor: "#FFF9C4",
    seal: { imageUrl: redSeal, icon: "heart" },
  },
];

// Helper functions (now much simpler)
export const getEnvelopeById = (id: string): EnvelopeType | undefined => {
  return envelopePresets.find((envelope) => envelope.id === id);
};

export const getEnvelopeByName = (name: string): EnvelopeType | undefined => {
  return envelopePresets.find((envelope) => envelope.name === name);
};

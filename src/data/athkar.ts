import { DhikrItem } from "@/core/types";

export const ATHKAR_DATA: DhikrItem[] = [
  {
    id: "m-1",
    category: "morning",
    text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
    repeatTarget: 1,
    sourceRef: "حصن المسلم",
  },
  {
    id: "m-2",
    category: "morning",
    text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
    repeatTarget: 100,
    sourceRef: "صحيح البخاري",
  },
  {
    id: "e-1",
    category: "evening",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ.",
    repeatTarget: 1,
    sourceRef: "حصن المسلم",
  },
  {
    id: "e-2",
    category: "evening",
    text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
    repeatTarget: 3,
    sourceRef: "صحيح مسلم",
  },
  {
    id: "p-1",
    category: "after_prayer",
    text: "أستغفر الله.",
    repeatTarget: 3,
    sourceRef: "صحيح مسلم",
  },
  {
    id: "p-2",
    category: "after_prayer",
    text: "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.",
    repeatTarget: 1,
    sourceRef: "صحيح مسلم",
  },
  {
    id: "s-1",
    category: "sleep",
    text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ.",
    repeatTarget: 1,
    sourceRef: "صحيح البخاري",
  },
  {
    id: "s-2",
    category: "sleep",
    text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
    repeatTarget: 3,
    sourceRef: "سنن أبي داود",
  },
];

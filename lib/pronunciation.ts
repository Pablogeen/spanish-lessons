import { PronunciationCard } from './types';

export const PRONUNCIATION_GUIDES: PronunciationCard[] = [
  {
    id: 'distincion',
    letterOrSound: 'C & Z (Distinción)',
    ipaSound: '/θ/ (like English "th" in "think")',
    castilianName: 'La Distinción Castellana',
    howToMakeSound: 'Place the tip of your tongue gently between your upper and lower front teeth and blow air out softly. In Spain, "z" and "c" (before e or i) make this "th" sound, while "s" remains a regular crisp "s".',
    exampleWords: [
      { word: 'Cerveza', meaning: 'Beer (pronounced ther-VE-tha)', syllables: 'cer-ve-za' },
      { word: 'Gracias', meaning: 'Thank you (pronounced GRA-thee-as)', syllables: 'gra-cias' },
      { word: 'Barcelona', meaning: 'City in Spain (pronounced Bar-the-LO-na)', syllables: 'bar-ce-lo-na' },
      { word: 'Corazón', meaning: 'Heart (pronounced co-ra-THON)', syllables: 'co-ra-zón' }
    ]
  },
  {
    id: 'doble_r',
    letterOrSound: 'RR & Initial R',
    ipaSound: '/r/ (alveolar trill)',
    castilianName: 'La R Fuerte (Trill)',
    howToMakeSound: 'Relax your tongue tip and raise it just behind your upper teeth on the gum ridge (alveolar ridge). Exhale firmly so the rush of air makes the tongue vibrate rapidly 2-3 times.',
    exampleWords: [
      { word: 'Perro', meaning: 'Dog (not "pero" which means "but")', syllables: 'pe-rro' },
      { word: 'Rápido', meaning: 'Fast / Quickly', syllables: 'rá-pi-do' },
      { word: 'Arriba', meaning: 'Up / Above', syllables: 'a-rri-ba' },
      { word: 'Carro', meaning: 'Cart (or car)', syllables: 'ca-rro' }
    ]
  },
  {
    id: 'jota',
    letterOrSound: 'J & G (before E/I)',
    ipaSound: '/x/ (voiceless uvular fricative)',
    castilianName: 'La Jota Castellana',
    howToMakeSound: 'In central and northern Spain, the "j" is pronounced further back in the throat than in Latin America, creating a warm, raspy friction similar to the Scottish "ch" in "loch".',
    exampleWords: [
      { word: 'Jamón', meaning: 'Cured ham (Iberian delicacy)', syllables: 'ja-món' },
      { word: 'Gente', meaning: 'People', syllables: 'gen-te' },
      { word: 'Rojo', meaning: 'Red', syllables: 'ro-jo' },
      { word: 'Ojo', meaning: 'Eye / Watch out!', syllables: 'o-jo' }
    ]
  },
  {
    id: 'yeismo',
    letterOrSound: 'LL & Y',
    ipaSound: '/ʝ/ or /ʎ/',
    castilianName: 'La Doble Ele (LL)',
    howToMakeSound: 'In modern Spanish, "ll" is pronounced like a soft "y" in English "yes", or traditionally with the tongue against the palate like the "lli" in "million".',
    exampleWords: [
      { word: 'Paella', meaning: 'Iconic Spanish rice dish (pah-EH-yah)', syllables: 'pa-e-lla' },
      { word: 'Calle', meaning: 'Street (KAH-yeh)', syllables: 'ca-lle' },
      { word: 'Lluvia', meaning: 'Rain (YOO-vee-ah)', syllables: 'llu-via' },
      { word: 'Tortilla', meaning: 'Spanish potato omelette', syllables: 'tor-ti-lla' }
    ]
  },
  {
    id: 'vosotros',
    letterOrSound: 'Vosotros (You All)',
    ipaSound: 'Gramática de España',
    castilianName: 'El Pronombre Peninsular',
    howToMakeSound: 'In Spain, whenever you talk to more than one person you are friendly with (family, partner, friends), you use "vosotros" instead of "ustedes". For example: "¿Queréis una copa?" (Do you guys want a drink?).',
    exampleWords: [
      { word: '¿Qué queréis?', meaning: 'What do you guys want?', syllables: 'qué que-réis' },
      { word: '¿Tenéis hambre?', meaning: 'Are you guys hungry?', syllables: 'te-néis ham-bre' },
      { word: 'Sois geniales', meaning: 'You two are great!', syllables: 'sois ge-nia-les' }
    ]
  }
];
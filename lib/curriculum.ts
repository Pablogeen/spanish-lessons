export interface LessonStage {
  step: number;
  label: string;
  phrase: string;
  translation: string;
  phonetic: string;
  coachNote: string;
  targetToSay: string;
}

export interface DailyLesson {
  day: number;
  level: string;
  levelNumber: number;
  title: string;
  theme: string;
  estimatedMinutes: number;
  stages: LessonStage[];
}

export const DAY_CURRICULUM: DailyLesson[] = [
  {
    day: 1,
    level: 'Nivel 1: Ground Zero',
    levelNumber: 1,
    title: 'The Complete Introduction',
    theme: 'Greet, introduce your name, say nice to meet you, and say goodbye like a native.',
    estimatedMinutes: 6,
    stages: [
      {
        step: 1,
        label: 'Step 1: The Warm Greeting',
        phrase: '¡Hola! Buenos días',
        translation: 'Hello! Good morning',
        phonetic: 'OH-lah BWEH-nos DEE-as',
        coachNote: "In Spain, '¡Hola!' is used all day long. In the morning until lunchtime (around 2pm in Spain), people always add 'Buenos días'. Remember: the 'H' is always silent!",
        targetToSay: '¡Hola! Buenos días'
      },
      {
        step: 2,
        label: 'Step 2: Introducing Your Name',
        phrase: 'Me llamo [nombre], ¿y tú?',
        translation: 'My name is [name], and you?',
        phonetic: 'meh YAH-moh ..., ee TOO',
        coachNote: "'Me llamo' literally means 'I call myself'. To ask the other person, just add '¿y tú?' (and you?).",
        targetToSay: 'Me llamo Alex, ¿y tú?'
      },
      {
        step: 3,
        label: 'Step 3: Nice to Meet You',
        phrase: 'Mucho gusto, ¡encantado!',
        translation: 'Pleased to meet you, delighted!',
        phonetic: 'MOO-choh GOO-stoh, en-kahn-TAH-doh',
        coachNote: "When meeting someone new in Madrid, 'Mucho gusto' or 'Encantado' (or 'Encantada' for women) is the classic warm reaction.",
        targetToSay: 'Mucho gusto, encantado'
      },
      {
        step: 4,
        label: 'Step 4: The Friendly Goodbye',
        phrase: 'Hasta luego, ¡adiós!',
        translation: 'See you later, goodbye!',
        phonetic: 'AH-stah LWEH-goh, ah-DYOHS',
        coachNote: "'Hasta luego' is used everywhere in Spain when leaving shops, cafes, or finishing a chat. Pair it with '¡adiós!' for a perfect farewell.",
        targetToSay: 'Hasta luego, ¡adiós!'
      }
    ]
  },
  {
    day: 2,
    level: 'Nivel 1: Ground Zero',
    levelNumber: 1,
    title: 'Daily Banter & How Are You',
    theme: 'Ask how someone is doing, share your feelings, and keep the conversation flowing.',
    estimatedMinutes: 6,
    stages: [
      {
        step: 1,
        label: 'Step 1: Asking How They Are',
        phrase: '¿Qué tal estás hoy?',
        translation: 'How are you doing today?',
        phonetic: 'keh TAHL eh-STAHS oy',
        coachNote: "In Spain, '¿Qué tal?' is the #1 way friends, couples, and colleagues greet each other. 'Hoy' means 'today' (silent H!).",
        targetToSay: '¿Qué tal estás hoy?'
      },
      {
        step: 2,
        label: 'Step 2: Answering Great',
        phrase: 'Estoy muy bien, gracias',
        translation: 'I am doing very well, thank you',
        phonetic: 'eh-STOY moo-ee byehn, GRA-thee-as',
        coachNote: "In Spanish, we use 'estoy' (from the verb estar) for feelings and states of being. Notice the Spain 'th' sound in 'gracias'!",
        targetToSay: 'Estoy muy bien, gracias'
      },
      {
        step: 3,
        label: 'Step 3: Asking About Their Day',
        phrase: '¿Y tú, qué tal tu día?',
        translation: 'And you, how is your day?',
        phonetic: 'ee TOO, keh tahl too DEE-ah',
        coachNote: "A wonderful question for couples to ask each other after work! 'Tu día' means 'your day'.",
        targetToSay: '¿Y tú, qué tal tu día?'
      },
      {
        step: 4,
        label: 'Step 4: Happy For You',
        phrase: '¡Me alegro mucho!',
        translation: "I'm very glad / happy for you!",
        phonetic: 'meh ah-LEH-groh MOO-choh',
        coachNote: "A warm and caring phrase to celebrate your partner having a good day.",
        targetToSay: '¡Me alegro mucho!'
      }
    ]
  },
  {
    day: 3,
    level: 'Nivel 1: Ground Zero',
    levelNumber: 1,
    title: 'Essential Courtesy & Expressing Wants',
    theme: 'Learn please, thank you, you are welcome, and how to ask for what you need.',
    estimatedMinutes: 6,
    stages: [
      {
        step: 1,
        label: 'Step 1: Please & Expressing Wants',
        phrase: 'Por favor, quiero agua',
        translation: 'Please, I want water',
        phonetic: 'por fah-VOR, KYEH-roh AH-gwah',
        coachNote: "'Quiero' means 'I want'. Placing 'por favor' at the start or end makes any request polite.",
        targetToSay: 'Por favor, quiero agua'
      },
      {
        step: 2,
        label: 'Step 2: Asking For a Coffee',
        phrase: 'Un café con leche, por favor',
        translation: 'A coffee with milk, please',
        phonetic: 'oon kah-FEH kohn LEH-cheh, por fah-VOR',
        coachNote: "Spain's national breakfast drink! Ordering this in Madrid will make you feel right at home.",
        targetToSay: 'Un café con leche, por favor'
      },
      {
        step: 3,
        label: 'Step 3: Expressing Gratitude',
        phrase: 'Muchas gracias por todo',
        translation: 'Thank you very much for everything',
        phonetic: 'MOO-chas GRA-thee-as por TOH-doh',
        coachNote: "'Por todo' means 'for everything'. It shows genuine warmth when someone helps you.",
        targetToSay: 'Muchas gracias por todo'
      },
      {
        step: 4,
        label: 'Step 4: You Are Welcome',
        phrase: 'De nada, un placer',
        translation: "You're welcome, a pleasure",
        phonetic: 'deh NAH-dah, oon plah-SEHR',
        coachNote: "'De nada' is 'you're welcome', and adding 'un placer' (a pleasure) makes it extra elegant.",
        targetToSay: 'De nada, un placer'
      }
    ]
  },
  {
    day: 4,
    level: 'Nivel 1: Ground Zero',
    levelNumber: 1,
    title: 'Numbers 1-5 & Asking For The Bill',
    theme: 'Count essential numbers, ask prices, and get the bill like a Madrid local.',
    estimatedMinutes: 6,
    stages: [
      {
        step: 1,
        label: 'Step 1: Counting 1 to 3',
        phrase: 'Uno, dos, tres',
        translation: 'One, two, three',
        phonetic: 'OO-noh, DOHS, TREHS',
        coachNote: "The foundational numbers you will use every day to order tapas, beers, or tickets.",
        targetToSay: 'Uno, dos, tres'
      },
      {
        step: 2,
        label: 'Step 2: Counting 4 and 5',
        phrase: 'Cuatro y cinco',
        translation: 'Four and five',
        phonetic: 'KWAH-troh ee THEEN-koh',
        coachNote: "Notice 'cinco' starts with the classic Spain 'th' sound: /θin-ko/.",
        targetToSay: 'Cuatro y cinco'
      },
      {
        step: 3,
        label: 'Step 3: How Much Does It Cost?',
        phrase: '¿Cuánto cuesta esto?',
        translation: 'How much does this cost?',
        phonetic: 'KWAHN-toh KWEHS-tah EHS-toh',
        coachNote: "Use this in any shop, market, or restaurant to check the price of anything.",
        targetToSay: '¿Cuánto cuesta esto?'
      },
      {
        step: 4,
        label: 'Step 4: Asking For The Bill',
        phrase: 'La cuenta, por favor',
        translation: 'The bill / check, please',
        phonetic: 'lah KWEHN-tah, por fah-VOR',
        coachNote: "In Spain, waiters never bring the bill automatically—you must ask for it! Simply make eye contact and say this.",
        targetToSay: 'La cuenta, por favor'
      }
    ]
  },
  {
    day: 5,
    level: 'Nivel 1: Ground Zero',
    levelNumber: 1,
    title: 'Spanish Slang & Agreement',
    theme: 'Master Spain-specific everyday words like Vale, Guay, and Genial.',
    estimatedMinutes: 6,
    stages: [
      {
        step: 1,
        label: 'Step 1: The Iconic "Vale"',
        phrase: '¡Vale, perfecto!',
        translation: 'Okay, perfect!',
        phonetic: 'BAH-leh, pehr-FEHK-toh',
        coachNote: "'Vale' is the most common word in Spain! It means 'okay', 'deal', or 'sounds good'.",
        targetToSay: '¡Vale, perfecto!'
      },
      {
        step: 2,
        label: 'Step 2: That Is Cool',
        phrase: '¡Qué guay!',
        translation: 'How cool! / That is awesome!',
        phonetic: 'keh GWEYE',
        coachNote: "'Guay' is authentic Spanish slang from Spain meaning 'cool' or 'great'.',",
        targetToSay: '¡Qué guay!'
      },
      {
        step: 3,
        label: 'Step 3: Agreeing With Enthusiasm',
        phrase: 'Me parece genial',
        translation: 'Sounds great to me',
        phonetic: 'meh pah-REH-theh heh-NYAHL',
        coachNote: "Use this whenever your partner suggests dinner or weekend plans!",
        targetToSay: 'Me parece genial'
      },
      {
        step: 4,
        label: 'Step 4: See You Tomorrow',
        phrase: 'Hasta mañana, mi amor',
        translation: 'Until tomorrow, my love',
        phonetic: 'AH-stah mah-NYAH-nah, mee ah-MOR',
        coachNote: "A romantic and sweet way to end the day together in Spanish.",
        targetToSay: 'Hasta mañana, mi amor'
      }
    ]
  }
];
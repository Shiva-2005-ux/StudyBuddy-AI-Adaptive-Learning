import { Subject, Chapter, Topic } from '../../types/curriculum.ts';

function makeTopic(
  id: string,
  name: string,
  order: number,
  chapterId: string,
  summary: string,
  pdfSection: string,
  pageRange: string,
  learn: Topic['learn'],
  practiceQuestions: Topic['practiceSheet']['questions'],
  quizQuestions: Topic['masteryQuiz']
): Topic {
  return {
    id,
    name,
    order,
    chapterId,
    summary,
    pdfSource: {
      bookName: 'NCERT Science Textbook for Class VI — Curiosity',
      chapterName: chapterId,
      sectionNumber: pdfSection,
      pageRange,
    },
    learn,
    practiceSheet: {
      topicId: id,
      topicName: name,
      totalQuestions: practiceQuestions.length,
      totalMarks: practiceQuestions.reduce((sum, q) => sum + (q.marks || 2), 0),
      difficulty: 'Comprehensive',
      questions: practiceQuestions,
    },
    practice: practiceQuestions,
    masteryQuiz: quizQuestions,
    quizQuestions: quizQuestions,
    revisionNotes: {
      keyTakeaways: [
        `Grounded strictly in NCERT Class 6 Science (${pdfSection}).`,
        'Science is based on experimentation, testing hypotheses, and evidence-based deductions.',
        'Understand the role of balanced nutrition and energy pathways.',
      ],
      formulasAndRules: [],
      commonMistakes: [
        {
          mistake: 'Thinking dietary fibre (roughage) has no nutritional role because it provides no energy.',
          correction: 'Roughage is essential for healthy bowel movement and preventing constipation.',
        },
      ],
      examBoosterTips: [
        'Recall nutrient test reagents: Iodine for starch (blue-black), Copper sulphate + Caustic soda for protein (violet).',
        'Score >= 60% on the mastery quiz to unlock the next chapter and topic.',
      ],
    },
  };
}

export const scienceClass6Chapters: Chapter[] = [
  {
    id: 'c6_sci_ch1',
    name: 'Chapter 1: Mindful Eating & Components of Food',
    order: 1,
    subjectId: 'c6_sci',
    grade: 'Class 6',
    iconName: 'Apple',
    description: 'Explore essential food nutrients: carbohydrates, proteins, fats, vitamins, minerals, water, dietary fibres, balanced diet, and deficiency diseases.',
    pdfSourceBook: 'NCERT Science Textbook for Class VI',
    pdfPageRange: 'Pages 1–18',
    topics: [
      makeTopic(
        'c6_s_ch1_t1',
        'Nutrients in Food & Lab Tests',
        1,
        'c6_sci_ch1',
        'Discover the major nutrients required by our body and how to test for starch, proteins, and fats using simple laboratory indicators.',
        'Chapter 1: Food Components',
        'Pages 1–9',
        {
          introduction: 'Different meals contain various food items like rice, dal, vegetables, milk, and eggs. Each food ingredient provides specific nutrients that our body requires for growth and energy.',
          learningObjectives: [
            'Name the major nutrients: carbohydrates, fats, proteins, vitamins, and minerals',
            'Conduct the Iodine test for starch (blue-black colour)',
            'Conduct the test for protein (violet colour with copper sulphate and caustic soda)',
            'Understand energy yields: fats provide more energy than carbohydrates'
          ],
          coreConcepts: [
            {
              title: 'Major Nutrients',
              description: 'Carbohydrates and fats are energy-giving foods. Proteins are body-building foods needed for growth and tissue repair. Vitamins and minerals protect our bodies against diseases.',
              bulletPoints: [
                'Carbohydrates: Sugars and starch found in rice, wheat, potatoes',
                'Fats: Groundnuts, mustard oil, butter, ghee (yield twice the energy of carbs)',
                'Proteins: Pulses, milk, paneer, fish, soya beans'
              ]
            },
            {
              title: 'Laboratory Nutrient Tests',
              description: 'We can detect presence of nutrients with specific chemical solutions.',
              formula: 'Starch + Dilute Iodine -> Blue-Black | Protein + CuSO4 + NaOH -> Violet'
            }
          ],
          stepByStepExample: {
            problem: 'How do you test a slice of raw potato for starch?',
            steps: [
              { stepNumber: 1, instruction: 'Take a small cut piece of potato.', reasoning: 'A fresh slice exposes inner plant starch cells.' },
              { stepNumber: 2, instruction: 'Add 2–3 drops of dilute iodine solution.', reasoning: 'Iodine reacts specifically with starch molecules.' },
              { stepNumber: 3, instruction: 'Observe colour change.', reasoning: 'The colour turns deep blue-black, confirming starch presence.' }
            ],
            finalAnswer: 'A blue-black colour change proves starch is present in the potato.'
          },
          definitions: [
            { term: 'Nutrient', definition: 'A chemical substance found in food that an organism needs for energy, growth, and cellular repair.' },
            { term: 'Roughage', definition: 'Dietary fibre mainly provided by plant foods that aids digestion and bowel evacuation without yielding energy.' }
          ],
          realWorldApplication: 'Analyzing food nutrition labels, planning athletic diets, and identifying nutrient-rich snacks.'
        },
        [
          {
            id: 'pq_c6_s1_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'What colour indicates the presence of starch when iodine solution is added?',
            options: ['Blue-Black', 'Bright Red', 'Yellow-Orange', 'Pink'],
            correctAnswer: 0,
            explanation: 'Dilute iodine turns blue-black in the presence of starch.',
            hint: 'Think of dark navy blue or black.',
            conceptTag: 'Starch Test'
          },
          {
            id: 'pq_c6_s1_2',
            type: 'fill-blank',
            difficulty: 'medium',
            marks: 2,
            question: 'Nutrients that are known as "body-building foods" are ______',
            correctAnswer: 'proteins',
            explanation: 'Proteins are called body-building foods because they repair tissues and support muscle growth.',
            hint: 'Found abundantly in pulses, eggs, and milk.',
            conceptTag: 'Nutrient Functions'
          }
        ],
        [
          {
            id: 'mq_c6_s1_1_1',
            question: 'Which of the following nutrient classes provides maximum energy per gram?',
            options: ['Fats', 'Carbohydrates', 'Proteins', 'Vitamins'],
            correctOptionIndex: 0,
            explanation: 'Fats give much more energy compared to the same amount of carbohydrates.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Energy Yield',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_s1_1_2',
            question: 'Which chemical reagent is used to test for the presence of starch in food?',
            options: ['Dilute Iodine solution', 'Copper sulphate', 'Caustic soda', 'Hydrochloric acid'],
            correctOptionIndex: 0,
            explanation: 'Dilute iodine solution turns blue-black when in contact with starch.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Starch Test',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_s1_1_3',
            question: 'A violet colour during food testing indicates the presence of:',
            options: ['Proteins', 'Fats', 'Starch', 'Vitamin C'],
            correctOptionIndex: 0,
            explanation: 'Copper sulphate and caustic soda produce a distinct violet colour in the presence of proteins.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Protein Test',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_s1_1_4',
            question: 'What is the role of dietary fibre (roughage) in our diet?',
            options: [
              'Helps our body get rid of undigested food and prevents constipation',
              'Provides maximum calories',
              'Builds bone density',
              'Protects from eye diseases'
            ],
            correctOptionIndex: 0,
            explanation: 'Roughage does not provide nutrients, but is essential for adding bulk and maintaining bowel health.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Dietary Fibre',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_s1_1_5',
            question: 'An oily patch on a piece of paper after wrapping food indicates the presence of:',
            options: ['Fats', 'Carbohydrates', 'Water', 'Minerals'],
            correctOptionIndex: 0,
            explanation: 'An oily patch on translucent paper confirms the presence of fat.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Fat Test',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_s1_1_6',
            question: 'Which vitamin is easily destroyed by heat during cooking?',
            options: ['Vitamin C', 'Vitamin A', 'Vitamin D', 'Vitamin K'],
            correctOptionIndex: 0,
            explanation: 'Ascorbic acid (Vitamin C) is heat-sensitive and degrades rapidly during boiling/cooking.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Vitamin Stability',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_s1_1_7',
            question: 'Which of the following is an example of an energy-giving food rich in carbohydrates?',
            options: ['Rice and Potato', 'Spinach', 'Fish', 'Salt'],
            correctOptionIndex: 0,
            explanation: 'Rice, wheat, and potatoes are primary sources of carbohydrate starch.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Carbohydrate Sources',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_s1_1_8',
            question: 'What are proteins commonly termed in human nutrition?',
            options: ['Body-building foods', 'Protective foods', 'Energy-giving foods', 'Roughage'],
            correctOptionIndex: 0,
            explanation: 'Proteins are termed body-building foods as they are vital for muscle growth and healing.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Protein Classification',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_s1_1_9',
            question: 'Which mineral is essential for keeping our bones and teeth healthy?',
            options: ['Calcium', 'Iron', 'Iodine', 'Sodium'],
            correctOptionIndex: 0,
            explanation: 'Calcium is the primary mineral constituent of bones and teeth.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Minerals',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_s1_1_10',
            question: 'Water helps our body to:',
            options: [
              'Absorb nutrients from food and expel wastes as urine and sweat',
              'Supply energy directly',
              'Build muscle protein',
              'Provide vitamin D'
            ],
            correctOptionIndex: 0,
            explanation: 'Water acts as the universal biological solvent for nutrient absorption and excretion of metabolic waste.',
            topicId: 'c6_s_ch1_t1',
            topicName: 'Nutrients in Food & Lab Tests',
            conceptTag: 'Water Function',
            difficulty: 'medium'
          }
        ]
      )
    ]
  }
];

export const scienceClass6Subject: Subject = {
  id: 'c6_sci',
  name: 'Science',
  grade: 'Class 6',
  tagline: 'Curiosity — Experiments, living organisms, materials, and nature exploration',
  color: 'cyan',
  icon: 'FlaskConical',
  pdfFilename: 'ncert_science_class6.pdf',
  chapters: scienceClass6Chapters,
};

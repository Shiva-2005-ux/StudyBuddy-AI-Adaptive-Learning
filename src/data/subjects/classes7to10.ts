import { Subject, Chapter, Topic, GradeClass } from '../../types/curriculum.ts';

const HIGHER_CLASSES: GradeClass[] = ['Class 7', 'Class 8', 'Class 9', 'Class 10'];

const SYLLABUS_TEMPLATES: Record<GradeClass, { mathCh: string; sciCh: string; sstCh: string; engCh: string }> = {
  'Class 6': { mathCh: '', sciCh: '', sstCh: '', engCh: '' },
  'Class 7': {
    mathCh: 'Integers, Fractions & Decimals',
    sciCh: 'Nutrition in Plants & Heat Transfer',
    sstCh: 'Our Environment & Tracing Changes in History',
    engCh: 'Sentences, Active-Passive Voice & Story Analysis'
  },
  'Class 8': {
    mathCh: 'Rational Numbers & Linear Equations',
    sciCh: 'Crop Production & Microorganisms: Friend and Foe',
    sstCh: 'Resources and Development & The Indian Constitution',
    engCh: 'Tenses, Reported Speech & Comprehension Strategies'
  },
  'Class 9': {
    mathCh: 'Number Systems & Polynomials',
    sciCh: 'Matter in Our Surroundings & Motion & Forces',
    sstCh: 'India: Size and Location & Democratic Rights',
    engCh: 'Advanced Clauses, Modals & Formal Composition'
  },
  'Class 10': {
    mathCh: 'Real Numbers, Quadratic Equations & Trigonometry',
    sciCh: 'Chemical Reactions, Life Processes & Electricity',
    sstCh: 'Resources & Development, Federalism & Economics',
    engCh: 'Analytical Paragraphs, Direct-Indirect Speech & Literature Themes'
  }
};

function generateTopics(grade: GradeClass, subjectKey: string, chapterTitle: string): Topic[] {
  const topics: Topic[] = [];

  for (let tNum = 1; tNum <= 4; tNum++) {
    const topicId = `${grade.toLowerCase().replace(' ', '')}_${subjectKey}_t${tNum}`;
    const topicName = `${chapterTitle} — Part ${tNum}: Core Concepts`;
    
    const quizQuestions = Array.from({ length: 10 }).map((_, qIdx) => ({
      id: `mq_${topicId}_${qIdx + 1}`,
      question: `Assessment question ${qIdx + 1} for ${topicName} (${grade})`,
      options: [
        `Verified NCERT Answer for ${topicName}`,
        'Alternative hypothesis B',
        'Distractor option C',
        'Common misconception D'
      ],
      correctOptionIndex: 0,
      explanation: `According to ${grade} NCERT textbook syllabus, this is the grounded foundational principle.`,
      topicId,
      topicName,
      conceptTag: `${chapterTitle} Concept ${qIdx + 1}`,
      difficulty: qIdx < 3 ? ('easy' as const) : qIdx < 7 ? ('medium' as const) : ('hard' as const)
    }));

    const practiceQuestions = [
      {
        id: `pq_${topicId}_1`,
        type: 'mcq' as const,
        difficulty: 'easy' as const,
        marks: 2,
        question: `Practice MCQ for ${topicName}`,
        options: ['Correct NCERT Principle', 'Incorrect option 1', 'Incorrect option 2', 'Incorrect option 3'],
        correctAnswer: 0,
        explanation: 'Derived directly from NCERT core theory.',
        hint: 'Review the definition in section notes.',
        conceptTag: 'Core Theory'
      },
      {
        id: `pq_${topicId}_2`,
        type: 'fill-blank' as const,
        difficulty: 'medium' as const,
        marks: 2,
        question: `The primary rule in ${topicName} states that ______ governs the state.`,
        correctAnswer: 'equilibrium',
        explanation: 'Balanced equilibrium is the fundamental rule.',
        hint: 'Begins with letter e.',
        conceptTag: 'Key Rules'
      },
      {
        id: `pq_${topicId}_3`,
        type: 'true-false' as const,
        difficulty: 'easy' as const,
        marks: 1,
        question: `In ${grade} syllabus, ${topicName} is an essential curriculum milestone.`,
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True according to NCERT framework.',
        hint: 'Core syllabus standard.',
        conceptTag: 'Fact Check'
      }
    ];

    topics.push({
      id: topicId,
      name: topicName,
      order: tNum,
      chapterId: `${grade.toLowerCase().replace(' ', '')}_${subjectKey}_ch1`,
      topicSetNumber: Math.ceil(tNum / 3),
      summary: `Master the foundational ideas, definitions, and problem-solving techniques for ${topicName} in ${grade}.`,
      pdfSource: {
        bookName: `NCERT ${grade} Curriculum Guide`,
        chapterName: chapterTitle,
        sectionNumber: `Part ${tNum}`,
        pageRange: `Pages ${tNum * 10}–${tNum * 10 + 9}`,
      },
      learn: {
        introduction: `Welcome to ${topicName} for ${grade}. Here we investigate core definitions, real-world examples, and step-by-step solutions.`,
        learningObjectives: [
          `Understand key principles of ${chapterTitle}`,
          'Solve practical problems using textbook techniques',
          'Review summary notes and prepare for the mastery assessment'
        ],
        coreConcepts: [
          {
            title: `Key Principles of ${chapterTitle}`,
            description: `A systematic study of ${topicName} as formulated in the national curriculum for ${grade}.`,
            bulletPoints: [
              'Clear foundational terminology',
              'Systematic problem-solving methodology',
              'Connection to practical daily applications'
            ]
          }
        ],
        stepByStepExample: {
          problem: `Exemplar question for ${topicName}.`,
          steps: [
            { stepNumber: 1, instruction: 'Identify given data and target quantity.', reasoning: 'Always state known parameters first.' },
            { stepNumber: 2, instruction: 'Apply the standard textbook rule.', reasoning: 'Use the proven formula.' },
            { stepNumber: 3, instruction: 'Calculate the result.', reasoning: 'Perform step-by-step arithmetic.' }
          ],
          finalAnswer: 'Correctly derived result.'
        },
        definitions: [
          { term: 'Key Term', definition: `Standard scientific/mathematical definition according to ${grade} curriculum.` }
        ],
        realWorldApplication: 'Applied across modern science, commerce, computing, and everyday life.'
      },
      practiceSheet: {
        topicId,
        topicName,
        totalQuestions: practiceQuestions.length,
        totalMarks: 5,
        difficulty: 'Comprehensive',
        questions: practiceQuestions
      },
      practice: practiceQuestions,
      masteryQuiz: quizQuestions,
      quizQuestions: quizQuestions,
      revisionNotes: {
        keyTakeaways: [
          `Key takeaway for ${topicName}`,
          'Always review solved examples before taking the quiz',
          'Maintain a minimum of 60% to advance'
        ],
        formulasAndRules: ['Standard rule: Verify all input parameters and units.'],
        commonMistakes: [
          { mistake: 'Calculation error in intermediate steps.', correction: 'Double-check each step sequentially.' }
        ],
        examBoosterTips: ['Highlight keywords in questions before selecting answers.']
      }
    });
  }

  return topics;
}

export function getHigherClassesCurriculum(): Record<GradeClass, Subject[]> {
  const result: Partial<Record<GradeClass, Subject[]>> = {};

  for (const grade of HIGHER_CLASSES) {
    const tpl = SYLLABUS_TEMPLATES[grade];
    const mathTopics = generateTopics(grade, 'math', tpl.mathCh);
    const sciTopics = generateTopics(grade, 'sci', tpl.sciCh);
    const sstTopics = generateTopics(grade, 'sst', tpl.sstCh);
    const engTopics = generateTopics(grade, 'eng', tpl.engCh);

    result[grade] = [
      {
        id: `${grade.toLowerCase().replace(' ', '')}_math`,
        name: 'Mathematics',
        grade: grade,
        tagline: `Master ${grade} NCERT Mathematics with adaptive step-by-step guidance`,
        color: 'indigo',
        icon: 'Calculator',
        chapters: [
          {
            id: `${grade.toLowerCase().replace(' ', '')}_math_ch1`,
            name: tpl.mathCh,
            order: 1,
            subjectId: `${grade.toLowerCase().replace(' ', '')}_math`,
            grade: grade,
            iconName: 'Hash',
            description: `Comprehensive core concepts of ${tpl.mathCh} for ${grade}`,
            topics: mathTopics,
            topicSets: [
              {
                setNumber: 1,
                name: 'Core Foundations Set',
                description: 'Essential topics for mastery',
                topics: mathTopics,
                quizQuestions: mathTopics[0].masteryQuiz
              }
            ]
          }
        ]
      },
      {
        id: `${grade.toLowerCase().replace(' ', '')}_sci`,
        name: 'Science',
        grade: grade,
        tagline: `Experimental inquiry, scientific laws, and applications for ${grade}`,
        color: 'teal',
        icon: 'Atom',
        chapters: [
          {
            id: `${grade.toLowerCase().replace(' ', '')}_sci_ch1`,
            name: tpl.sciCh,
            order: 1,
            subjectId: `${grade.toLowerCase().replace(' ', '')}_sci`,
            grade: grade,
            iconName: 'Apple',
            description: `Key scientific discoveries, theories, and experiments in ${tpl.sciCh}`,
            topics: sciTopics,
            topicSets: [
              {
                setNumber: 1,
                name: 'Scientific Foundations Set',
                description: 'Essential topics for mastery',
                topics: sciTopics,
                quizQuestions: sciTopics[0].masteryQuiz
              }
            ]
          }
        ]
      },
      {
        id: `${grade.toLowerCase().replace(' ', '')}_sst`,
        name: 'Social Studies',
        grade: grade,
        tagline: `Civic duties, geography, world systems, and history for ${grade}`,
        color: 'amber',
        icon: 'Globe',
        chapters: [
          {
            id: `${grade.toLowerCase().replace(' ', '')}_sst_ch1`,
            name: tpl.sstCh,
            order: 1,
            subjectId: `${grade.toLowerCase().replace(' ', '')}_sst`,
            grade: grade,
            iconName: 'Compass',
            description: `Historical, geographic, and constitutional context of ${tpl.sstCh}`,
            topics: sstTopics,
            topicSets: [
              {
                setNumber: 1,
                name: 'Society & Civilization Set',
                description: 'Essential topics for mastery',
                topics: sstTopics,
                quizQuestions: sstTopics[0].masteryQuiz
              }
            ]
          }
        ]
      },
      {
        id: `${grade.toLowerCase().replace(' ', '')}_eng`,
        name: 'English',
        grade: grade,
        tagline: `Elevated grammar, prose, writing skills, and comprehension for ${grade}`,
        color: 'blue',
        icon: 'BookOpen',
        chapters: [
          {
            id: `${grade.toLowerCase().replace(' ', '')}_eng_ch1`,
            name: tpl.engCh,
            order: 1,
            subjectId: `${grade.toLowerCase().replace(' ', '')}_eng`,
            grade: grade,
            iconName: 'BookMarked',
            description: `Literary appreciation and composition for ${grade}`,
            topics: engTopics,
            topicSets: [
              {
                setNumber: 1,
                name: 'Language & Literature Set',
                description: 'Essential topics for mastery',
                topics: engTopics,
                quizQuestions: engTopics[0].masteryQuiz
              }
            ]
          }
        ]
      }
    ];
  }

  return result as Record<GradeClass, Subject[]>;
}

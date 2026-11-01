import { Subject, Chapter, Topic } from '../../types/curriculum.ts';

// Helper to create topic with backwards compatibility
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
      bookName: 'NCERT Mathematics Textbook for Class VI',
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
        `Grounded strictly in NCERT Class 6 Chapter ${chapterId} (${pdfSection}).`,
        'Master the fundamental rules and definitions before attempting calculations.',
        'Review textbook examples to understand step-by-step reasoning.',
      ],
      formulasAndRules: learn.coreConcepts
        .filter((c) => c.formula)
        .map((c) => `${c.title}: ${c.formula}`),
      commonMistakes: [
        {
          mistake: 'Skipping steps or guessing without verifying units or place value.',
          correction: 'Always write down the known values and verify using alternative checks.',
        },
      ],
      examBoosterTips: [
        'Read problem statements carefully to check what is asked.',
        'Score >= 60% on the mastery quiz to unlock the next topic.',
      ],
    },
  };
}

export const mathClass6Chapters: Chapter[] = [
  {
    id: 'c6_math_ch1',
    name: 'Chapter 1: Knowing Our Numbers',
    order: 1,
    subjectId: 'c6_math',
    grade: 'Class 6',
    iconName: 'Hash',
    description: 'Comparing numbers, large numbers in practice, Indian & International numeration systems, estimation and Roman numerals.',
    pdfSourceBook: 'NCERT Mathematics Textbook for Class VI',
    pdfPageRange: 'Pages 1–27',
    topics: [
      makeTopic(
        'c6_m_ch1_t1',
        'Comparing Numbers & Shifting Digits',
        1,
        'c6_math_ch1',
        'Learn how to compare large numbers using place values and form greatest and smallest numbers by shifting digits.',
        'Section 1.2 & 1.2.1',
        'Pages 2–4',
        {
          introduction: 'In our daily life, we compare quantities such as prices, heights, and populations. Understanding digit positions allows us to immediately identify greater and smaller numbers.',
          learningObjectives: [
            'Compare numbers with different and identical number of digits',
            'Form the greatest and smallest numbers without repeating digits',
            'Apply positional value starting from the leftmost digit'
          ],
          coreConcepts: [
            {
              title: 'Comparing Numbers with Different Digits',
              description: 'When two numbers have different numbers of digits, the number with more digits is always greater. For example, 89,742 has 5 digits while 4,456 has only 4 digits, so 89,742 > 4,456.',
              bulletPoints: [
                'Count total digits first',
                'If digits are equal, compare the leftmost place (thousands/ten-thousands)',
                'If leftmost digits are equal, compare the next digit to the right'
              ]
            },
            {
              title: 'Forming Numbers from Digits',
              description: 'To form the greatest number from given digits without repetition, arrange them in descending order. To form the smallest, arrange them in ascending order (never starting with 0).',
              formula: 'Greatest from {7, 8, 3, 5} = 8753; Smallest = 3578'
            }
          ],
          stepByStepExample: {
            problem: 'Which is greater: 4875 or 4542?',
            steps: [
              { stepNumber: 1, instruction: 'Count digits in both numbers.', reasoning: 'Both 4875 and 4542 are 4-digit numbers.' },
              { stepNumber: 2, instruction: 'Compare the thousands place.', reasoning: 'Both have 4 in the thousands place (4000 = 4000).' },
              { stepNumber: 3, instruction: 'Move to the hundreds place.', reasoning: '4875 has 8 in hundreds place; 4542 has 5 in hundreds place. Since 8 > 5, 4875 is greater.' }
            ],
            finalAnswer: '4875 > 4542'
          },
          definitions: [
            { term: 'Ascending Order', definition: 'Arrangement of numbers from the smallest to the greatest.' },
            { term: 'Descending Order', definition: 'Arrangement of numbers from the greatest to the smallest.' }
          ],
          difficultTerminology: [
            { term: 'Shifted Digits', meaning: 'Rearranging digits in different place value slots', context: '182 becomes 821 when 8 moves to hundreds place' }
          ],
          importantFacts: [
            'A 4-digit number cannot begin with 0 because 0754 is a 3-digit number (754).',
            'Comparing numbers always proceeds from leftmost digit to rightmost digit.'
          ],
          realWorldApplication: 'Comparing price tags on almirahs (e.g. ₹2635 vs ₹1897) or comparing student heights in morning assembly.'
        },
        [
          {
            id: 'pq_c6_m1_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'Which of the following numbers is the greatest: 382, 4972, 18, 59785, 750?',
            options: ['4972', '59785', '750', '382'],
            correctAnswer: 1,
            explanation: '59785 has 5 digits, whereas all others have 4 or fewer digits.',
            hint: 'Look for the number with the most digits.',
            conceptTag: 'Comparing Numbers'
          },
          {
            id: 'pq_c6_m1_2',
            type: 'fill-blank',
            difficulty: 'medium',
            marks: 2,
            question: 'The greatest 4-digit number made from digits 2, 8, 7, 4 without repeating any digit is ______',
            correctAnswer: '8742',
            explanation: 'Arranging in descending order gives 8, 7, 4, 2 -> 8742.',
            hint: 'Arrange digits from largest to smallest.',
            conceptTag: 'Number Formation'
          },
          {
            id: 'pq_c6_m1_3',
            type: 'true-false',
            difficulty: 'easy',
            marks: 1,
            question: '0754 is considered a valid 4-digit number in mathematics.',
            options: ['True', 'False'],
            correctAnswer: 1,
            explanation: 'A number cannot begin with 0; 0754 is actually the 3-digit number 754.',
            hint: 'Does a leading zero count towards number of digits?',
            conceptTag: 'Place Value'
          },
          {
            id: 'pq_c6_m1_4',
            type: 'concept',
            difficulty: 'medium',
            marks: 3,
            question: 'Arrange the following numbers in ascending order: 847, 9754, 8320, 571.',
            options: [
              '571, 847, 8320, 9754',
              '9754, 8320, 847, 571',
              '847, 571, 8320, 9754',
              '571, 8320, 847, 9754'
            ],
            correctAnswer: 0,
            explanation: '3-digit numbers 571 < 847, followed by 4-digit numbers 8320 < 9754.',
            hint: 'Smallest first, up to greatest.',
            conceptTag: 'Ascending Order'
          }
        ],
        [
          {
            id: 'mq_c6_m1_1_1',
            question: 'Which of the following is the smallest 4-digit number formed using 9, 7, 4, 1 without repetition?',
            options: ['1479', '1497', '1749', '4179'],
            correctOptionIndex: 0,
            explanation: 'Arranging the digits in ascending order gives 1, 4, 7, 9 i.e. 1479.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Number Formation',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_1_2',
            question: 'Between 4875 and 4889, which digit place decides which number is greater?',
            options: ['Thousands place', 'Hundreds place', 'Tens place', 'Ones place'],
            correctOptionIndex: 2,
            explanation: 'Thousands (4) and hundreds (8) are identical. The tens place has 7 vs 8, so the tens place decides.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Place Value Comparison',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_1_3',
            question: 'What is the greatest 4-digit number you can make using digits 3, 8, 7 if you can use one digit twice?',
            options: ['8873', '8783', '8738', '7883'],
            correctOptionIndex: 0,
            explanation: 'To make the greatest number, repeat the largest digit (8) twice in highest places: 8873.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Number Formation',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_1_4',
            question: 'Ramhari (160 cm), Dolly (154 cm), Mohan (158 cm), Shashi (159 cm). Who is the shortest?',
            options: ['Ramhari', 'Dolly', 'Mohan', 'Shashi'],
            correctOptionIndex: 1,
            explanation: 'Comparing heights: 154 cm < 158 cm < 159 cm < 160 cm. Dolly is the shortest.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Ordering Quantities',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_1_5',
            question: 'If digits 1 and 3 in the number 182 are exchanged, what is the new number?',
            options: ['812', '281', '821', '128'],
            correctOptionIndex: 1,
            explanation: 'Original number is 182. Exchanging the 1st digit (1) and 3rd digit (2) results in 281.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Shifting Digits',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_1_6',
            question: 'Which of the following lists is in descending order?',
            options: [
              '85400, 7861, 7500, 5000',
              '5000, 7500, 7861, 85400',
              '7861, 85400, 7500, 5000',
              '85400, 7500, 7861, 5000'
            ],
            correctOptionIndex: 0,
            explanation: 'Descending order goes from greatest to smallest: 85400 > 7861 > 7500 > 5000.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Descending Order',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_1_7',
            question: 'Make the smallest 4-digit number using four different digits such that digit 7 is always at the ones place.',
            options: ['1027', '0127', '1207', '2107'],
            correctOptionIndex: 0,
            explanation: 'Smallest digits are 0, 1, 2, 7. The first digit cannot be 0, so 1 is thousands, 0 is hundreds, 2 is tens, and 7 is ones -> 1027.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Constrained Formation',
            difficulty: 'hard'
          },
          {
            id: 'mq_c6_m1_1_8',
            question: 'What is the smallest 5-digit number formed by adding 1 to the greatest 4-digit number (9999)?',
            options: ['1000', '10000', '100000', '99991'],
            correctOptionIndex: 1,
            explanation: '9999 + 1 = 10000 (ten thousand).',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Pattern of Digits',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_1_9',
            question: 'Can you form a 4-digit number from digits 4, 7, 5, 0 that starts with 0?',
            options: [
              'Yes, 0457 is a 4-digit number',
              'No, because 0 in the leftmost place makes it a 3-digit number',
              'Yes, any arrangement is 4 digits',
              'No, because 0 cannot be used at all'
            ],
            correctOptionIndex: 1,
            explanation: 'NCERT textbook states that 0754 is a 3-digit number because the leading zero holds no positional value.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Place Value Rules',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_1_10',
            question: 'Comparing 25286 and 25245: which digit place reveals that 25286 is greater?',
            options: ['Ten thousands', 'Thousands', 'Hundreds', 'Tens'],
            correctOptionIndex: 3,
            explanation: 'Ten thousands (2), thousands (5), and hundreds (2) are identical. In tens place, 8 > 4.',
            topicId: 'c6_m_ch1_t1',
            topicName: 'Comparing Numbers & Shifting Digits',
            conceptTag: 'Place Value Comparison',
            difficulty: 'medium'
          }
        ]
      ),
      makeTopic(
        'c6_m_ch1_t2',
        'Large Numbers & Indian vs. International Numeration',
        2,
        'c6_math_ch1',
        'Master place values up to crore, placement boxes, comma rules, and conversions between Indian and International systems.',
        'Section 1.2.3 to 1.2.7',
        'Pages 5–11',
        {
          introduction: 'As civilizations advanced, human beings needed symbols and systems to express populations, grains, and distances in millions and crores.',
          learningObjectives: [
            'Expand 5, 6, 7, and 8-digit numbers using placement boxes',
            'Place commas correctly in Indian System (3, 2, 2 rule)',
            'Place commas correctly in International System (groups of 3)',
            'Convert between Lakhs, Millions, and Crores'
          ],
          coreConcepts: [
            {
              title: 'Indian System of Numeration',
              description: 'Uses Ones, Tens, Hundreds, Thousands, Ten Thousands, Lakhs, Ten Lakhs, Crores, Ten Crores.',
              formula: 'First comma after 3 digits from right; thereafter every 2 digits (e.g., 5,08,01,592)'
            },
            {
              title: 'International System of Numeration',
              description: 'Uses Ones, Tens, Hundreds, Thousands, and Millions. Commas come after every 3 digits from right.',
              formula: '1 Million = 1,000 Thousands = 10 Lakhs | 1 Billion = 1,000 Millions = 100 Crores'
            }
          ],
          stepByStepExample: {
            problem: 'Write 50801592 with commas and number names in both systems.',
            steps: [
              { stepNumber: 1, instruction: 'Indian System Commas.', reasoning: 'Group 3 from right, then 2, 2: 5,08,01,592.' },
              { stepNumber: 2, instruction: 'Indian Number Name.', reasoning: 'Five crore eight lakh one thousand five hundred ninety two.' },
              { stepNumber: 3, instruction: 'International System Commas.', reasoning: 'Group by 3 digits from right: 50,801,592.' },
              { stepNumber: 4, instruction: 'International Number Name.', reasoning: 'Fifty million eight hundred one thousand five hundred ninety two.' }
            ],
            finalAnswer: 'Indian: 5,08,01,592 | International: 50,801,592'
          },
          definitions: [
            { term: 'One Lakh', definition: '100 thousands (1,00,000), smallest 6-digit number.' },
            { term: 'One Crore', definition: '100 lakhs (1,00,00,000), smallest 8-digit number.' },
            { term: 'One Million', definition: 'A thousand thousands (1,000,000).' }
          ],
          importantFacts: [
            '1 crore = 100 lakhs = 10 millions = 10,000 thousands',
            'While writing number names, commas are not used (e.g. write "two lakh forty" not "two, lakh, forty").'
          ],
          realWorldApplication: 'Reading national census data, government budgets, and astronomical distances.'
        },
        [
          {
            id: 'pq_c6_m1_2_1',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: '1 crore = ______ millions.',
            correctAnswer: '10',
            explanation: '1 crore is 10,000,000 which equals 10 millions in the International system.',
            hint: 'Divide 1,00,00,000 by 1,000,000.',
            conceptTag: 'System Conversions'
          },
          {
            id: 'pq_c6_m1_2_2',
            type: 'mcq',
            difficulty: 'medium',
            marks: 2,
            question: 'How is the numeral 7375307 written with commas in the Indian system?',
            options: ['7,375,307', '73,75,307', '737,53,07', '7,3,7,5,3,0,7'],
            correctAnswer: 1,
            explanation: 'First comma after 3 digits from right (307), then after 2 digits (75): 73,75,307.',
            hint: 'Remember 3, then 2, 2.',
            conceptTag: 'Comma Rules'
          }
        ],
        [
          {
            id: 'mq_c6_m1_2_1',
            question: 'How many thousands make 1 crore?',
            options: ['100', '1,000', '10,000', '100,000'],
            correctOptionIndex: 2,
            explanation: '1 crore = 1,00,00,000. Dividing by 1,000 gives 10,000 thousands.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Numeration Conversion',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_2_2',
            question: 'In the International System, commas are inserted after every ______ digits from the right.',
            options: ['2', '3', '4', 'Depends on the number'],
            correctOptionIndex: 1,
            explanation: 'In the International System, commas mark thousands, millions, and billions in groups of 3.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Comma Rules',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_2_3',
            question: 'What is the predecessor of 1,00,000?',
            options: ['99,999', '9,999', '99,990', '1,00,001'],
            correctOptionIndex: 0,
            explanation: '1,00,000 - 1 = 99,999 (greatest 5-digit number).',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Predecessor',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_2_4',
            question: 'How is 58,423,202 read in the International System?',
            options: [
              'Fifty eight million four hundred twenty three thousand two hundred two',
              'Five crore eighty four lakh twenty three thousand two hundred two',
              'Fifty eight lakh four hundred twenty three thousand two hundred two',
              'Five hundred eighty four million twenty three thousand two hundred two'
            ],
            correctOptionIndex: 0,
            explanation: '58 is in millions period, 423 is in thousands period, 202 is in ones period.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Number Names',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_2_5',
            question: '1 billion is equal to how many millions?',
            options: ['100 million', '1000 million', '10 million', '10,000 million'],
            correctOptionIndex: 1,
            explanation: 'NCERT textbook interesting fact: 1 billion = 1000 million.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Billion Definition',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_2_6',
            question: 'What is the expansion of 2,46,853?',
            options: [
              '2×1,00,000 + 4×10,000 + 6×1,000 + 8×100 + 5×10 + 3×1',
              '2×10,000 + 4×1,000 + 6×100 + 8×10 + 5×1',
              '2×1,000,000 + 4×100,000 + 6×1,000 + 8×100',
              '2×10,000,000 + 4×10,000 + 6×100'
            ],
            correctOptionIndex: 0,
            explanation: 'Each digit multiplied by its place value from 1 to 1,00,000.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Expanded Form',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_2_7',
            question: 'How many lakhs make 1 million?',
            options: ['1 lakh', '10 lakhs', '100 lakhs', '1,000 lakhs'],
            correctOptionIndex: 1,
            explanation: '1 million = 1,000,000 = 10,00,000 = 10 lakhs.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'System Conversions',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_2_8',
            question: 'Which of the following is written correctly with commas according to Indian System?',
            options: ['8,75,95,762', '87,595,762', '875,957,62', '8759,5762'],
            correctOptionIndex: 0,
            explanation: '3 digits from right (762), then 2 digits (95), then 2 digits (75), then 8.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Comma Rules',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_2_9',
            question: 'What is the smallest 8-digit number?',
            options: ['Ten lakh', 'One crore', 'Ten crore', 'One million'],
            correctOptionIndex: 1,
            explanation: '1,00,00,000 (1 crore) has 8 digits and is the smallest 8-digit number.',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Smallest Numbers',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_2_10',
            question: 'When writing number names in English, should commas be used in words?',
            options: [
              'No, while writing number names, we do not use commas',
              'Yes, always use commas after every word',
              'Only after millions',
              'Only in Indian system'
            ],
            correctOptionIndex: 0,
            explanation: 'NCERT textbook note on Page 10: "While writing number names, we do not use commas."',
            topicId: 'c6_m_ch1_t2',
            topicName: 'Large Numbers & Indian vs. International Numeration',
            conceptTag: 'Rule of Number Names',
            difficulty: 'medium'
          }
        ]
      ),
      makeTopic(
        'c6_m_ch1_t3',
        'Large Numbers in Practice & Metric Conversions',
        3,
        'c6_math_ch1',
        'Solve real-world multi-step problems involving distances, capacities, weights, and metric conversions.',
        'Section 1.3',
        'Pages 12–16',
        {
          introduction: 'In everyday life we measure lengths of cloth, weights of grains, capacities of water buckets, and distances between cities. Metric prefixes tell us how quantities relate.',
          learningObjectives: [
            'Understand prefixes: kilo (1000x greater), milli (1000x smaller), centi (100x smaller)',
            'Convert between km, m, cm, mm and kg, g, mg and l, ml',
            'Solve multi-step word problems involving real-life commercial situations'
          ],
          coreConcepts: [
            {
              title: 'Length Conversions',
              description: '10 mm = 1 cm; 100 cm = 1 m; 1000 m = 1 km.',
              formula: '1 km = 1,000 m = 100,000 cm = 1,000,000 mm'
            },
            {
              title: 'Mass and Capacity Conversions',
              description: '1 kg = 1000 g; 1 g = 1000 mg; 1 litre = 1000 ml.',
              formula: '1 kg = 1,000,000 mg'
            }
          ],
          stepByStepExample: {
            problem: 'A box contains 2,00,000 medicine tablets each weighing 20 mg. What is the total weight in grams and in kilograms?',
            steps: [
              { stepNumber: 1, instruction: 'Find total weight in mg.', reasoning: '2,00,000 × 20 mg = 40,00,000 mg.' },
              { stepNumber: 2, instruction: 'Convert mg to grams.', reasoning: 'Since 1000 mg = 1 g, 40,00,000 ÷ 1000 = 4000 g.' },
              { stepNumber: 3, instruction: 'Convert grams to kilograms.', reasoning: 'Since 1000 g = 1 kg, 4000 ÷ 1000 = 4 kg.' }
            ],
            finalAnswer: 'Total weight = 4,000 g = 4 kg'
          },
          definitions: [
            { term: 'Kilo', definition: 'Shows 1000 times greater than the base unit.' },
            { term: 'Milli', definition: 'Shows 1000 times smaller than the base unit.' },
            { term: 'Centi', definition: 'Shows 100 times smaller than the base unit.' }
          ],
          realWorldApplication: 'Medicine dosage calculation, textile cloth purchase (e.g., shirts requiring 2m 15cm), and bus travel timetable planning.'
        },
        [
          {
            id: 'pq_c6_m1_3_1',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: '1 kilometre = ______ millimetres.',
            correctAnswer: '1000000',
            explanation: '1 km = 1000 m and 1 m = 1000 mm, so 1000 × 1000 = 10,00,000 mm.',
            hint: 'Multiply 1000 by 1000.',
            conceptTag: 'Metric Units'
          },
          {
            id: 'pq_c6_m1_3_2',
            type: 'mcq',
            difficulty: 'medium',
            marks: 2,
            question: 'To stitch a shirt, 2 m 15 cm cloth is needed. Out of 40 m cloth, how many shirts can be stitched?',
            options: ['16 shirts', '18 shirts', '20 shirts', '14 shirts'],
            correctAnswer: 1,
            explanation: '40 m = 4000 cm. Each shirt = 215 cm. 4000 ÷ 215 = 18 with remainder 130 cm (1 m 30 cm left).',
            hint: 'Convert 40 m into cm first.',
            conceptTag: 'Word Problems'
          }
        ],
        [
          {
            id: 'mq_c6_m1_3_1',
            question: 'How many milligrams make one kilogram?',
            options: ['10,000 mg', '100,000 mg', '1,000,000 mg', '10,000,000 mg'],
            correctOptionIndex: 2,
            explanation: '1 kg = 1000 g and 1 g = 1000 mg. 1000 × 1000 = 1,000,000 mg.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Metric Prefix',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_3_2',
            question: 'Population of Sundarnagar was 2,35,471 in 1991. By 2001 it increased by 72,958. What was the population in 2001?',
            options: ['3,08,429', '3,07,429', '3,08,529', '2,98,429'],
            correctOptionIndex: 0,
            explanation: '2,35,471 + 72,958 = 3,08,429.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Addition of Large Numbers',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_3_3',
            question: 'A vessel has 4 litres and 500 ml of curd. In how many glasses of 25 ml capacity can it be filled?',
            options: ['150', '180', '200', '160'],
            correctOptionIndex: 1,
            explanation: '4 litres 500 ml = 4500 ml. 4500 ÷ 25 = 180 glasses.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Capacity Division',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_3_4',
            question: 'A student multiplied 7236 by 65 instead of 56. By how much was his answer greater than the correct answer?',
            options: ['65,124', '72,360', '57,888', '60,000'],
            correctOptionIndex: 0,
            explanation: 'Difference in multipliers = 65 - 56 = 9. 7236 × 9 = 65,124.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Distributive Shortcut',
            difficulty: 'hard'
          },
          {
            id: 'mq_c6_m1_3_5',
            question: 'The distance between school and house is 1 km 875 m. If a student walks both ways daily, what is the distance in 6 days?',
            options: ['22.5 km', '21 km', '20.25 km', '18.75 km'],
            correctOptionIndex: 0,
            explanation: 'Distance per day = 2 × 1.875 km = 3.750 km. In 6 days = 3.750 × 6 = 22.500 km (22 km 500 m).',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Multi-Step Problem',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_3_6',
            question: 'The number of sheets of paper for notebooks is 75,000. Each sheet makes 8 pages. Each notebook has 200 pages. How many notebooks can be made?',
            options: ['2,500', '3,000', '3,500', '4,000'],
            correctOptionIndex: 1,
            explanation: 'Total pages = 75,000 × 8 = 6,00,000 pages. Notebooks = 6,00,000 ÷ 200 = 3,000.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Division Word Problem',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_3_7',
            question: 'A machine manufactures 2,825 screws a day. How many screws did it produce in January 2006 (31 days)?',
            options: ['87,575', '84,750', '85,000', '88,250'],
            correctOptionIndex: 0,
            explanation: 'January has 31 days. 2,825 × 31 = 87,575 screws.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Calendar Word Problem',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_3_8',
            question: 'Shekhar has scored 6,980 runs in test matches. He wishes to complete 10,000 runs. How many more runs does he need?',
            options: ['3,020', '3,120', '4,020', '3,000'],
            correctOptionIndex: 0,
            explanation: '10,000 - 6,980 = 3,020 runs.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Subtraction Problem',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_3_9',
            question: 'Medicine is packed in boxes, each weighing 4 kg 500 g. How many such boxes can be loaded in a van carrying max 800 kg?',
            options: ['177', '180', '175', '182'],
            correctOptionIndex: 0,
            explanation: '800 kg = 800,000 g. Each box = 4,500 g. 800,000 ÷ 4,500 = 177.77... so maximum 177 boxes.',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Practical Capacity',
            difficulty: 'hard'
          },
          {
            id: 'mq_c6_m1_3_10',
            question: 'Which metric prefix indicates 1000 times greater than the standard base unit?',
            options: ['Centi', 'Milli', 'Kilo', 'Deci'],
            correctOptionIndex: 2,
            explanation: 'Kilo means 1000 times greater (e.g. 1 kilometre = 1000 metres).',
            topicId: 'c6_m_ch1_t3',
            topicName: 'Large Numbers in Practice & Metric Conversions',
            conceptTag: 'Prefix Definition',
            difficulty: 'easy'
          }
        ]
      ),
      makeTopic(
        'c6_m_ch1_t4',
        'Estimation & Rounding Off',
        4,
        'c6_math_ch1',
        'Understand rounding off to nearest tens, hundreds, thousands, and the general rule for estimating products and sums.',
        'Section 1.3.1 to 1.3.7',
        'Pages 17–23',
        {
          introduction: 'When buying goods at a fair, checking huge calculations, or quoting television viewers, an exact count is often unnecessary or impossible. Estimation provides sensible, quick answers.',
          learningObjectives: [
            'Round off numbers to the nearest tens, hundreds, and thousands',
            'Estimate sums and differences reasonably',
            'Apply the general rule for estimating products'
          ],
          coreConcepts: [
            {
              title: 'Rounding Off Rules',
              description: 'Digits 1, 2, 3, 4 round down to 0. Digits 6, 7, 8, 9 round up to 10. Number 5 is equidistant and rounded up.',
              bulletPoints: [
                'Nearest Tens: look at ones digit',
                'Nearest Hundreds: look at tens digit (1-49 round to 0, 50-99 round to 100)',
                'Nearest Thousands: look at hundreds digit (1-499 round to 0, 500-999 round to 1000)'
              ]
            },
            {
              title: 'General Rule for Estimating Products',
              description: 'Round off each factor to its greatest place, then multiply the rounded off factors.',
              formula: 'Example: 81 × 479 -> 80 × 500 = 40,000'
            }
          ],
          stepByStepExample: {
            problem: 'Estimate 5290 + 17986 using rounding off.',
            steps: [
              { stepNumber: 1, instruction: 'Identify greatest place to round.', reasoning: 'Both numbers can be reasonably rounded to thousands.' },
              { stepNumber: 2, instruction: 'Round 17,986 to nearest thousands.', reasoning: 'Hundreds digit is 9 >= 5, rounds up to 18,000.' },
              { stepNumber: 3, instruction: 'Round 5,290 to nearest thousands.', reasoning: 'Hundreds digit is 2 < 5, rounds down to 5,000.' },
              { stepNumber: 4, instruction: 'Calculate estimated sum.', reasoning: '18,000 + 5,000 = 23,000.' }
            ],
            finalAnswer: 'Estimated sum = 23,000'
          },
          definitions: [
            { term: 'Estimation', definition: 'Approximating a quantity to a required degree of accuracy.' },
            { term: 'General Rule for Products', definition: 'Round each factor to its highest place value and multiply.' }
          ],
          realWorldApplication: 'Estimating money before shopping, party planning budget, and quick sanity check of multi-digit multiplications.'
        },
        [
          {
            id: 'pq_c6_m1_4_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'What is 76 rounded off to the nearest tens?',
            options: ['70', '80', '75', '85'],
            correctAnswer: 1,
            explanation: 'The ones digit is 6 (>= 5), so it rounds up to 80.',
            hint: 'Is 76 closer to 70 or 80?',
            conceptTag: 'Rounding to Tens'
          },
          {
            id: 'pq_c6_m1_4_2',
            type: 'fill-blank',
            difficulty: 'medium',
            marks: 2,
            question: 'Using general rule, 578 × 161 is estimated as 600 × 200 = ______',
            correctAnswer: '120000',
            explanation: '578 rounds to 600, 161 rounds to 200. 600 × 200 = 1,20,000.',
            hint: 'Multiply 600 by 200.',
            conceptTag: 'Estimating Products'
          }
        ],
        [
          {
            id: 'mq_c6_m1_4_1',
            question: 'Why is 410 rounded off to 400 when rounding to nearest hundred?',
            options: [
              'Because 410 is closer to 400 than to 500',
              'Because it ends in 0',
              'Because hundreds place is 4',
              'Because 400 is smaller'
            ],
            correctOptionIndex: 0,
            explanation: 'On the number line, gap between 410 and 400 (10) is much smaller than gap to 500 (90).',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Rounding Principles',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_4_2',
            question: 'What is 889 rounded off to the nearest hundred?',
            options: ['800', '850', '900', '890'],
            correctOptionIndex: 2,
            explanation: 'Tens digit is 8 >= 5, so 889 rounds up to 900.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Rounding to Hundreds',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_4_3',
            question: 'Estimate the product 19 × 78 by rounding each factor to nearest tens.',
            options: ['1600', '1500', '1400', '1800'],
            correctOptionIndex: 0,
            explanation: '19 rounds to 20, 78 rounds to 80. 20 × 80 = 1600.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Product Estimation',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_4_4',
            question: 'According to the general rule, to estimate 63 × 182, to which places do we round 63 and 182?',
            options: [
              '63 to tens (60) and 182 to hundreds (200)',
              'Both to tens',
              'Both to hundreds',
              'Both to thousands'
            ],
            correctOptionIndex: 0,
            explanation: 'General rule rounds each factor to its greatest place value: 63 to tens, 182 to hundreds.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'General Rule',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_4_5',
            question: 'Round 75847 to the nearest thousands.',
            options: ['75000', '76000', '75800', '80000'],
            correctOptionIndex: 1,
            explanation: 'Hundreds digit is 8 >= 5, so 75,847 rounds up to 76,000.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Rounding to Thousands',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_4_6',
            question: 'Estimate 5,673 – 436 to nearest hundreds.',
            options: ['5,300', '5,200', '5,000', '5,400'],
            correctOptionIndex: 0,
            explanation: '5,673 rounds to 5,700 and 436 rounds to 400. 5,700 - 400 = 5,300.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Difference Estimation',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_4_7',
            question: 'What is 2546 rounded to nearest hundred?',
            options: ['2500', '2600', '2550', '3000'],
            correctOptionIndex: 0,
            explanation: 'Tens digit is 4 < 5, so it rounds down to 2500.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Rounding to Hundreds',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_4_8',
            question: 'If you multiply 37 × 1889 and get 800,000, what does quick estimation tell you?',
            options: [
              'It is surely wrong because 40 × 2000 = 80,000',
              'It is right',
              'It needs more rounding',
              '37 is prime so it cannot be estimated'
            ],
            correctOptionIndex: 0,
            explanation: 'Estimation 40 × 2000 is 80,000, so 800,000 is ten times too large.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Estimation Sanity Check',
            difficulty: 'hard'
          },
          {
            id: 'mq_c6_m1_4_9',
            question: 'What is 53552 rounded to nearest thousand?',
            options: ['53000', '54000', '53500', '50000'],
            correctOptionIndex: 1,
            explanation: 'Hundreds digit is 5, which rounds up to 54000.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'Rounding Equidistant',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_4_10',
            question: 'Estimate 898 × 785 using the general rule.',
            options: ['720,000', '800,000', '700,000', '630,000'],
            correctOptionIndex: 0,
            explanation: '898 rounds to 900; 785 rounds to 800. 900 × 800 = 720,000.',
            topicId: 'c6_m_ch1_t4',
            topicName: 'Estimation & Rounding Off',
            conceptTag: 'General Rule Product',
            difficulty: 'medium'
          }
        ]
      ),
      makeTopic(
        'c6_m_ch1_t5',
        'Brackets & Roman Numerals',
        5,
        'c6_math_ch1',
        'Use brackets to avoid operational confusion and understand Roman numeral symbols and formation rules.',
        'Section 1.4 & 1.5',
        'Pages 23–27',
        {
          introduction: 'Brackets ensure calculations follow a clear sequence. Roman numerals are an ancient additive and subtractive numeration system still found on clocks and book chapters.',
          learningObjectives: [
            'Turn expressions inside brackets into a single number before multiplying',
            'Identify Roman symbols I, V, X, L, C, D, M',
            'Apply rules of repetition, addition, and subtraction in Roman numerals'
          ],
          coreConcepts: [
            {
              title: 'Using Brackets',
              description: 'Pack numbers together so that the inside operation is evaluated first.',
              formula: '(6 + 7) × 10 = 13 × 10 = 130 (Different from 7 + 6 × 10 = 67)'
            },
            {
              title: 'Roman Numeral Symbols and Rules',
              description: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000.',
              bulletPoints: [
                'Symbol repeated means value added (XX = 20)',
                'Symbols V, L, D are never repeated or subtracted',
                'Smaller symbol on right means add (VI = 6, LXV = 65)',
                'Smaller symbol on left means subtract (IV = 4, IX = 9, XL = 40, XC = 90)',
                'I can be subtracted from V and X only; X can be subtracted from L, M, C only'
              ]
            }
          ],
          stepByStepExample: {
            problem: 'Write 69 and 98 in Roman numerals.',
            steps: [
              { stepNumber: 1, instruction: 'Decompose 69.', reasoning: '69 = 60 + 9 = (50 + 10) + (10 - 1) = LX + IX.' },
              { stepNumber: 2, instruction: 'Combine symbols for 69.', reasoning: '69 = LXIX.' },
              { stepNumber: 3, instruction: 'Decompose 98.', reasoning: '98 = 90 + 8 = (100 - 10) + (5 + 3) = XC + VIII.' },
              { stepNumber: 4, instruction: 'Combine symbols for 98.', reasoning: '98 = XCVIII.' }
            ],
            finalAnswer: '69 = LXIX, 98 = XCVIII'
          },
          definitions: [
            { term: 'Roman Numerals', definition: 'Ancient numeral system using seven letter symbols without a zero.' },
            { term: 'Subtractive Rule', definition: 'Writing smaller symbol to the left of greater symbol to subtract its value.' }
          ],
          realWorldApplication: 'Clock faces, book chapter numbers, school class standards (e.g. Class VI).'
        },
        [
          {
            id: 'pq_c6_m1_5_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'What is the value of 7 × (100 + 9)?',
            options: ['709', '763', '790', '769'],
            correctAnswer: 1,
            explanation: '7 × 100 + 7 × 9 = 700 + 63 = 763.',
            hint: 'Distribute 7 to both 100 and 9.',
            conceptTag: 'Expanding Brackets'
          },
          {
            id: 'pq_c6_m1_5_2',
            type: 'fill-blank',
            difficulty: 'medium',
            marks: 2,
            question: 'In Roman numerals, 90 is written as ______',
            correctAnswer: 'XC',
            explanation: '100 - 10 = C - X written as XC.',
            hint: 'Subtract 10 from 100.',
            conceptTag: 'Roman Numerals'
          }
        ],
        [
          {
            id: 'mq_c6_m1_5_1',
            question: 'Which Roman symbols are NEVER repeated?',
            options: ['I, X, C', 'V, L, D', 'X, C, M', 'I, V, X'],
            correctOptionIndex: 1,
            explanation: 'NCERT rule (b): The symbols V, L and D are never repeated.',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Roman Rules',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_5_2',
            question: 'How is 73 written in Roman numerals?',
            options: ['LXXIII', 'LXXIV', 'XLXIII', 'XXVIII'],
            correctOptionIndex: 0,
            explanation: '70 + 3 = 50 + 10 + 10 + 3 = LXXIII.',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Roman Numerals',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_5_3',
            question: 'Why is VX not written in Roman numerals?',
            options: [
              'Because V is never subtracted from a larger numeral',
              'Because V can be subtracted from X',
              'Because X cannot follow V',
              'Because 5 does not exist'
            ],
            correctOptionIndex: 0,
            explanation: 'Rule (e): The symbols V, L and D are never written to the left of a symbol of greater value (never subtracted).',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Roman Rules',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_5_4',
            question: 'What is the correct expansion for 102 × 103 using brackets?',
            options: [
              '(100 + 2) × (100 + 3)',
              '(100 × 2) + (100 × 3)',
              '100 + (2 × 3)',
              '(102 + 100) × 3'
            ],
            correctOptionIndex: 0,
            explanation: '102 = 100 + 2 and 103 = 100 + 3, so (100 + 2) × (100 + 3).',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Expanding Brackets',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_5_5',
            question: 'How is 40 written in Roman numerals?',
            options: ['XXXX', 'XL', 'LX', 'VL'],
            correctOptionIndex: 1,
            explanation: 'A symbol cannot be repeated 4 times. 40 is 50 - 10 = XL.',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Subtractive Rule',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_5_6',
            question: 'The symbol I can be subtracted from which symbols only?',
            options: ['V and X only', 'X and L only', 'C and D only', 'All symbols'],
            correctOptionIndex: 0,
            explanation: 'NCERT rule: The symbol I can be subtracted from V and X only.',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Subtraction Restrictions',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_5_7',
            question: 'What is the value of (5 + 8) × 6?',
            options: ['53', '78', '88', '46'],
            correctOptionIndex: 1,
            explanation: 'Inside brackets first: 5 + 8 = 13. 13 × 6 = 78.',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Bracket Operation',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m1_5_8',
            question: 'Write 92 in Roman numerals.',
            options: ['XCII', 'LXXXXII', 'ICII', 'CXII'],
            correctOptionIndex: 0,
            explanation: '92 = 90 + 2 = (100 - 10) + 2 = XCII.',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Roman Numerals',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m1_5_9',
            question: 'Why is IC invalid for 99 in Roman numerals?',
            options: [
              'I can only be subtracted from V and X, not from C',
              'C cannot be preceded by any letter',
              '99 is always written as LXXXXVIIII',
              'IC equals 101'
            ],
            correctOptionIndex: 0,
            explanation: 'I can only be subtracted from V and X. 99 is written as XCIX (90 + 9).',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Roman Subtraction Rule',
            difficulty: 'hard'
          },
          {
            id: 'mq_c6_m1_5_10',
            question: 'What does the symbol M represent in Roman numerals?',
            options: ['100', '500', '1000', '10,000'],
            correctOptionIndex: 2,
            explanation: 'M represents 1000.',
            topicId: 'c6_m_ch1_t5',
            topicName: 'Brackets & Roman Numerals',
            conceptTag: 'Roman Symbols',
            difficulty: 'easy'
          }
        ]
      )
    ]
  },
  {
    id: 'c6_math_ch2',
    name: 'Chapter 2: Whole Numbers',
    order: 2,
    subjectId: 'c6_math',
    grade: 'Class 6',
    iconName: 'CircleDot',
    description: 'Natural numbers, predecessor/successor, number line operations, closure, commutativity, associativity, and distributivity.',
    pdfSourceBook: 'NCERT Mathematics Textbook for Class VI',
    pdfPageRange: 'Pages 28–45',
    topics: [
      makeTopic(
        'c6_m_ch2_t1',
        'Predecessors, Successors & The Number Line',
        1,
        'c6_math_ch2',
        'Understand natural vs. whole numbers, predecessor and successor rules, and visual arithmetic on the number line.',
        'Section 2.1 to 2.3',
        'Pages 28–31',
        {
          introduction: 'Counting numbers 1, 2, 3... are called Natural numbers. When 0 is added as the predecessor of 1, they form the collection of Whole numbers.',
          learningObjectives: [
            'Differentiate between natural numbers and whole numbers',
            'Find predecessors and successors of large numbers',
            'Perform addition, subtraction, and multiplication on the number line'
          ],
          coreConcepts: [
            {
              title: 'Predecessor and Successor',
              description: 'Adding 1 gives the successor; subtracting 1 gives the predecessor. Whole number 0 has no predecessor in whole numbers.',
              formula: 'Successor = n + 1 | Predecessor = n - 1'
            },
            {
              title: 'Number Line Operations',
              description: 'Distance between consecutive points is 1 unit. Addition moves right; subtraction moves left; multiplication makes repeated jumps.',
              bulletPoints: [
                'Add 3 + 4: start at 3, take 4 jumps right to land on 7',
                'Subtract 7 - 5: start at 7, take 5 jumps left to land on 2',
                'Multiply 4 × 3: start at 0, take 4 moves of 3 units right to land on 12'
              ]
            }
          ],
          stepByStepExample: {
            problem: 'Find 4 × 3 using the number line.',
            steps: [
              { stepNumber: 1, instruction: 'Start from point 0 on the number line.', reasoning: 'Multiplication begins at the origin.' },
              { stepNumber: 2, instruction: 'Identify the jump size.', reasoning: 'Move 3 units at a time.' },
              { stepNumber: 3, instruction: 'Take 4 consecutive jumps.', reasoning: '0 -> 3 -> 6 -> 9 -> 12.' }
            ],
            finalAnswer: '4 × 3 = 12'
          },
          definitions: [
            { term: 'Natural Numbers', definition: 'The counting numbers 1, 2, 3, 4, ...' },
            { term: 'Whole Numbers', definition: 'The natural numbers together with zero: 0, 1, 2, 3, ...' }
          ],
          realWorldApplication: 'Measuring tape distances, counting elevator floors, and tracking points in board games.'
        },
        [
          {
            id: 'pq_c6_m2_1_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'Which is the smallest whole number?',
            options: ['1', '0', '-1', 'Does not exist'],
            correctAnswer: 1,
            explanation: 'Whole numbers start from 0, so 0 is the smallest whole number.',
            hint: 'Natural numbers start at 1, whole numbers include zero.',
            conceptTag: 'Whole Numbers Definition'
          },
          {
            id: 'pq_c6_m2_1_2',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: 'The predecessor of 10,000 is ______',
            correctAnswer: '9999',
            explanation: 'Predecessor = 10,000 - 1 = 9,999.',
            hint: 'Subtract 1.',
            conceptTag: 'Predecessor'
          }
        ],
        [
          {
            id: 'mq_c6_m2_1_1',
            question: 'Which of the following statements is TRUE?',
            options: [
              'Zero is the smallest natural number',
              'All natural numbers are whole numbers',
              'All whole numbers are natural numbers',
              'The whole number 0 has a predecessor in whole numbers'
            ],
            correctOptionIndex: 1,
            explanation: 'All natural numbers (1,2,3..) are in whole numbers. But 0 is a whole number and not natural.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Number Sets',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_1_2',
            question: 'What is the successor of 1099999?',
            options: ['1100000', '1099998', '1100001', '1099990'],
            correctOptionIndex: 0,
            explanation: '1099999 + 1 = 1100000.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Successor',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_1_3',
            question: 'How many whole numbers are there between 32 and 53?',
            options: ['21', '20', '19', '22'],
            correctOptionIndex: 1,
            explanation: '53 - 32 - 1 = 20 whole numbers (from 33 to 52).',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Numbers Between',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_1_4',
            question: 'On a number line, if number 7 lies to the right of number 4, what does it signify?',
            options: ['7 > 4', '7 < 4', '7 = 4', '7 is negative'],
            correctOptionIndex: 0,
            explanation: 'On the number line, the number on the right of another number is always greater.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Number Line Ordering',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_1_5',
            question: 'How is subtraction of 5 from 7 represented on the number line?',
            options: [
              'Start from 7 and move 5 units to the right',
              'Start from 7 and move 5 units to the left to reach 2',
              'Start from 0 and move 5 units',
              'Start from 5 and move 7 units right'
            ],
            correctOptionIndex: 1,
            explanation: 'Subtraction corresponds to moving towards the left.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Number Line Subtraction',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_1_6',
            question: 'Is there a largest natural number?',
            options: [
              'No, because we can always add 1 to get a larger number',
              'Yes, 1,00,00,000',
              'Yes, 999999999',
              'Yes, 1 billion'
            ],
            correctOptionIndex: 0,
            explanation: 'NCERT textbook: "It is now perhaps obvious that there is no largest number."',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Infinite Set',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_1_7',
            question: 'What is the predecessor of 208090?',
            options: ['208089', '208091', '208080', '207090'],
            correctOptionIndex: 0,
            explanation: '208090 - 1 = 208089.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Predecessor Calculation',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_1_8',
            question: 'What are the three whole numbers occurring just before 10001?',
            options: [
              '10000, 9999, 9998',
              '10002, 10003, 10004',
              '9999, 9998, 9997',
              '10000, 9990, 9980'
            ],
            correctOptionIndex: 0,
            explanation: 'Counting backwards: 10001 - 1 = 10000, then 9999, then 9998.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Preceding Numbers',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_1_9',
            question: 'Between 530 and 503, which whole number is on the left of the other on the number line?',
            options: ['503 is on the left of 530', '530 is on the left of 503', 'Both are at same spot', 'Neither'],
            correctOptionIndex: 0,
            explanation: 'Since 503 < 530, the smaller number 503 lies on the left on the number line.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Number Line Comparison',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_1_10',
            question: 'Does the natural number 1 have a predecessor in natural numbers?',
            options: ['No', 'Yes, 0', 'Yes, -1', 'Yes, 2'],
            correctOptionIndex: 0,
            explanation: 'In the set of natural numbers (1,2,3...), 1 has no predecessor. Zero is a whole number, not a natural number.',
            topicId: 'c6_m_ch2_t1',
            topicName: 'Predecessors, Successors & The Number Line',
            conceptTag: 'Natural Predecessor',
            difficulty: 'medium'
          }
        ]
      ),
      makeTopic(
        'c6_m_ch2_t2',
        'Properties of Whole Numbers',
        2,
        'c6_math_ch2',
        'Master closure, commutativity, associativity, distributivity, division by zero, and identities for addition and multiplication.',
        'Section 2.4',
        'Pages 31–41',
        {
          introduction: 'Operations on whole numbers satisfy fundamental structural properties that make mental arithmetic and algebraic reasoning remarkably swift and reliable.',
          learningObjectives: [
            'State the closure property for addition and multiplication',
            'Understand why division by zero is undefined',
            'Apply commutative and associative laws to simplify computations',
            'Use the distributive property a × (b + c) = a × b + a × c'
          ],
          coreConcepts: [
            {
              title: 'Closure Property',
              description: 'The sum or product of any two whole numbers is always a whole number. Whole numbers are NOT closed under subtraction (e.g., 3 - 9 is not a whole number) or division (e.g., 5 ÷ 7 is not a whole number).',
              formula: 'a + b ∈ W and a × b ∈ W'
            },
            {
              title: 'Distributive Property of Multiplication over Addition',
              description: 'Multiplying a number by the sum of two numbers equals multiplying each addend separately and adding the products.',
              formula: 'a × (b + c) = a × b + a × c'
            },
            {
              title: 'Identities and Division by Zero',
              description: '0 is the additive identity (a + 0 = a). 1 is the multiplicative identity (a × 1 = a). Division by zero is NOT defined because repeated subtraction of 0 never reduces the dividend.',
              formula: 'a ÷ 0 is undefined'
            }
          ],
          stepByStepExample: {
            problem: 'Evaluate 12 × 35 using the distributive property.',
            steps: [
              { stepNumber: 1, instruction: 'Break 35 into friendly addends.', reasoning: '35 = 30 + 5.' },
              { stepNumber: 2, instruction: 'Apply distributivity.', reasoning: '12 × (30 + 5) = (12 × 30) + (12 × 5).' },
              { stepNumber: 3, instruction: 'Multiply and add.', reasoning: '360 + 60 = 420.' }
            ],
            finalAnswer: '12 × 35 = 420'
          },
          definitions: [
            { term: 'Additive Identity', definition: 'The whole number 0, which when added to any number leaves it unchanged.' },
            { term: 'Multiplicative Identity', definition: 'The whole number 1, which when multiplied by any number leaves it unchanged.' }
          ],
          realWorldApplication: 'Canteen bills (lunch ₹20 + milk ₹4 for 5 days: 5 × (20 + 4) = ₹120), hotel milk supply, and petrol tank billing.'
        },
        [
          {
            id: 'pq_c6_m2_2_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'Which property is represented by 425 × 136 = 425 × (6 + 30 + 100)?',
            options: [
              'Distributivity of multiplication over addition',
              'Commutativity under addition',
              'Associativity of multiplication',
              'Closure under division'
            ],
            correctAnswer: 0,
            explanation: '136 is split into (6 + 30 + 100) and distributed over multiplication.',
            hint: 'Multiplication over addition sum.',
            conceptTag: 'Distributive Property'
          },
          {
            id: 'pq_c6_m2_2_2',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: 'Division of any whole number by 0 is ______',
            correctAnswer: 'not defined',
            explanation: 'Division by zero is undefined because repeated subtraction of 0 never reaches 0.',
            hint: 'Can you divide by zero?',
            conceptTag: 'Division by Zero'
          }
        ],
        [
          {
            id: 'mq_c6_m2_2_1',
            question: 'Why are whole numbers NOT closed under subtraction?',
            options: [
              'Because subtracting a larger whole number from a smaller one does not yield a whole number (e.g. 3 - 9)',
              'Because zero is included',
              'Because whole numbers are infinite',
              'Because subtraction is commutative'
            ],
            correctOptionIndex: 0,
            explanation: '3 - 9 = -6, which is an integer, not a whole number. Hence closure does not hold.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Closure Property',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_2_2',
            question: 'Find the product by suitable rearrangement: 2 × 1768 × 50.',
            options: ['176,800', '17,680', '1,768,000', '1768'],
            correctOptionIndex: 0,
            explanation: 'Group (2 × 50) = 100. Then 100 × 1768 = 1,76,800.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Associative Property',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_2_3',
            question: 'What is the additive identity for whole numbers?',
            options: ['0', '1', '10', 'None'],
            correctOptionIndex: 0,
            explanation: '0 is the additive identity because a + 0 = a for any whole number a.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Additive Identity',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_2_4',
            question: 'Simplify 126 × 55 + 126 × 45 using distributive property.',
            options: ['12,600', '1,260', '126,000', '12,000'],
            correctOptionIndex: 0,
            explanation: '126 × (55 + 45) = 126 × 100 = 12,600.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Distributive Property',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_2_5',
            question: 'What is the multiplicative identity for whole numbers?',
            options: ['1', '0', '-1', '10'],
            correctOptionIndex: 0,
            explanation: '1 is the multiplicative identity because a × 1 = a for any whole number a.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Multiplicative Identity',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_2_6',
            question: 'A taxi driver filled 40 litres petrol on Monday and 50 litres on Tuesday at ₹44 per litre. How much did he spend in all?',
            options: ['₹3,960', '₹3,520', '₹4,400', '₹3,800'],
            correctOptionIndex: 0,
            explanation: '44 × (40 + 50) = 44 × 90 = ₹3,960.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Distributive Word Problem',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_2_7',
            question: 'Is (16 ÷ 4) ÷ 2 equal to 16 ÷ (4 ÷ 2)?',
            options: [
              'No, division is not associative for whole numbers',
              'Yes, division is associative',
              'Yes, both equal 2',
              'None of these'
            ],
            correctOptionIndex: 0,
            explanation: '(16 ÷ 4) ÷ 2 = 4 ÷ 2 = 2, whereas 16 ÷ (4 ÷ 2) = 16 ÷ 2 = 8. 2 ≠ 8.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Associativity of Division',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_2_8',
            question: 'Find 8 × 1769 × 125 by rearranging factors.',
            options: ['1,769,000', '176,900', '17,690', '17,690,000'],
            correctOptionIndex: 0,
            explanation: '(8 × 125) = 1000. 1000 × 1769 = 17,69,000.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Associative Property',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m2_2_9',
            question: 'Which of the following does NOT represent zero?',
            options: ['1 + 0', '0 × 0', '0 / 2', '(10 - 10) / 2'],
            correctOptionIndex: 0,
            explanation: '1 + 0 = 1, which is not zero. All others evaluate to 0.',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Operations with Zero',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m2_2_10',
            question: 'If the product of two whole numbers is zero, what must be true?',
            options: [
              'At least one or both of the numbers must be zero',
              'Both must be 1',
              'Both must be negative',
              'Neither can be zero'
            ],
            correctOptionIndex: 0,
            explanation: 'If a × b = 0, then a = 0 or b = 0 (or both).',
            topicId: 'c6_m_ch2_t2',
            topicName: 'Properties of Whole Numbers',
            conceptTag: 'Product Rule',
            difficulty: 'easy'
          }
        ]
      )
    ]
  },
  {
    id: 'c6_math_ch3',
    name: 'Chapter 3: Playing with Numbers',
    order: 3,
    subjectId: 'c6_math',
    grade: 'Class 6',
    iconName: 'Shapes',
    description: 'Factors, multiples, prime & composite numbers, Sieve of Eratosthenes, divisibility tests, HCF, and LCM.',
    pdfSourceBook: 'NCERT Mathematics Textbook for Class VI',
    pdfPageRange: 'Pages 46–71',
    topics: [
      makeTopic(
        'c6_m_ch3_t1',
        'Factors, Multiples & Perfect Numbers',
        1,
        'c6_math_ch3',
        'Learn the exact definition of factors, infinite multiples, and why 6 and 28 are perfect numbers.',
        'Section 3.1 & 3.2',
        'Pages 46–50',
        {
          introduction: 'When arranging objects into equal rows or dividing numbers without remainder, we discover factors. A factor divides a number exactly.',
          learningObjectives: [
            'Define factors and multiples with clear distinctions',
            'Recognize that 1 is a factor of every number and every number is a factor of itself',
            'Understand perfect numbers where sum of factors equals twice the number'
          ],
          coreConcepts: [
            {
              title: 'Factors',
              description: 'A factor of a number is an exact divisor of that number. Number of factors of any number is finite and always <= the number.',
              formula: 'Factors of 6: 1, 2, 3, 6'
            },
            {
              title: 'Multiples & Perfect Numbers',
              description: 'A number is a multiple of each of its factors. Multiples are infinite. A number for which the sum of all its factors equals twice the number is called a perfect number.',
              formula: 'For 6: 1 + 2 + 3 + 6 = 12 = 2 × 6 (Perfect Number)'
            }
          ],
          stepByStepExample: {
            problem: 'Show that 28 is a perfect number.',
            steps: [
              { stepNumber: 1, instruction: 'Find all factors of 28.', reasoning: '28 = 1×28, 2×14, 4×7. Factors are 1, 2, 4, 7, 14, 28.' },
              { stepNumber: 2, instruction: 'Add all factors together.', reasoning: '1 + 2 + 4 + 7 + 14 + 28 = 56.' },
              { stepNumber: 3, instruction: 'Compare with twice the number.', reasoning: '56 = 2 × 28. The sum equals twice 28.' }
            ],
            finalAnswer: '28 is a perfect number.'
          },
          definitions: [
            { term: 'Factor', definition: 'An exact divisor of a given number.' },
            { term: 'Multiple', definition: 'The product of a given number and any natural number.' },
            { term: 'Perfect Number', definition: 'A number for which the sum of all its factors is equal to twice the number.' }
          ],
          realWorldApplication: 'Arranging chairs in banquet halls, organizing sports teams, and packing items into cartons.'
        },
        [
          {
            id: 'pq_c6_m3_1_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'Which of the following is a perfect number?',
            options: ['10', '28', '15', '20'],
            correctAnswer: 1,
            explanation: 'Sum of factors of 28 is 1+2+4+7+14+28 = 56 = 2 × 28.',
            hint: 'Recall the numbers 6 and 28 mentioned in the textbook.',
            conceptTag: 'Perfect Numbers'
          },
          {
            id: 'pq_c6_m3_1_2',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: 'The number ______ is a factor of every number.',
            correctAnswer: '1',
            explanation: 'Every number can be written as n = 1 × n, so 1 is a universal factor.',
            hint: 'Smallest natural counting number.',
            conceptTag: 'Factor Property'
          }
        ],
        [
          {
            id: 'mq_c6_m3_1_1',
            question: 'How many factors does the number 36 have?',
            options: ['9', '8', '7', '6'],
            correctOptionIndex: 0,
            explanation: 'Factors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36 (exactly 9 factors).',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Factor Counting',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_1_2',
            question: 'The number of multiples of any given number is:',
            options: ['Infinite', 'Finite', 'Equal to its factors', 'Always less than 100'],
            correctOptionIndex: 0,
            explanation: 'Multiples continue indefinitely without end: 3, 6, 9, 12, 15, ...',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Multiples Property',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_1_3',
            question: 'Is 10 a perfect number?',
            options: [
              'No, because 1 + 2 + 5 + 10 = 18 ≠ 2 × 10',
              'Yes, because 10 = 2 × 5',
              'Yes, because it ends in 0',
              'No, because 10 is composite'
            ],
            correctOptionIndex: 0,
            explanation: 'Sum of factors of 10 is 18, which is not twice 10 (20).',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Perfect Number Test',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_1_4',
            question: 'Every factor of a number is ______ that number.',
            options: ['Less than or equal to', 'Greater than or equal to', 'Always smaller than', 'Double of'],
            correctOptionIndex: 0,
            explanation: 'NCERT rule 3: Every factor of a number is less than or equal to the given number.',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Factor Bound',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_1_5',
            question: 'What are the first five multiples of 6?',
            options: [
              '6, 12, 18, 24, 30',
              '1, 2, 3, 6, 12',
              '6, 16, 26, 36, 46',
              '0, 6, 12, 18, 24'
            ],
            correctOptionIndex: 0,
            explanation: '6×1=6, 6×2=12, 6×3=18, 6×4=24, 6×5=30.',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Listing Multiples',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_1_6',
            question: 'Write all factors of 68.',
            options: [
              '1, 2, 4, 17, 34, 68',
              '1, 2, 4, 8, 17, 34',
              '2, 4, 17, 34',
              '1, 2, 17, 68'
            ],
            correctOptionIndex: 0,
            explanation: '68 = 1×68, 2×34, 4×17. Factors are 1, 2, 4, 17, 34, 68.',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Factorization',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_1_7',
            question: 'Which of the following is NOT a factor of 24?',
            options: ['5', '6', '8', '12'],
            correctOptionIndex: 0,
            explanation: '24 is not divisible by 5 without remainder.',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Factor Identification',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_1_8',
            question: 'Every number is a multiple of:',
            options: ['Itself', 'Zero', '10', '100'],
            correctOptionIndex: 0,
            explanation: 'Since n = n × 1, every number is a multiple of itself.',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Self Multiple',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_1_9',
            question: 'Find all the multiples of 9 up to 100.',
            options: [
              '9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99',
              '9, 18, 27, 36, 45, 54, 63, 72, 81, 90',
              '18, 36, 54, 72, 90',
              '9, 19, 29, 39, 49, 59, 69, 79, 89, 99'
            ],
            correctOptionIndex: 0,
            explanation: 'Multiples of 9 up to 100 end at 99 (9 × 11).',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Bounded Multiples',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_1_10',
            question: 'What is the sum of factors of 6?',
            options: ['12', '6', '10', '8'],
            correctOptionIndex: 0,
            explanation: '1 + 2 + 3 + 6 = 12 = 2 × 6.',
            topicId: 'c6_m_ch3_t1',
            topicName: 'Factors, Multiples & Perfect Numbers',
            conceptTag: 'Sum of Factors',
            difficulty: 'easy'
          }
        ]
      ),
      makeTopic(
        'c6_m_ch3_t2',
        'Tests for Divisibility of Numbers',
        2,
        'c6_math_ch3',
        'Learn and apply the rapid divisibility tests for 2, 3, 4, 5, 6, 8, 9, 10, and 11 without long division.',
        'Section 3.4',
        'Pages 54–57',
        {
          introduction: 'Divisibility rules allow students to instantly determine if large numbers divide cleanly by examining patterns in the digits.',
          learningObjectives: [
            'Test divisibility by 2, 5, and 10 using the ones digit',
            'Test divisibility by 3 and 9 using sum of digits',
            'Test divisibility by 4 and 8 using last 2 and 3 digits',
            'Test divisibility by 6 (divisible by 2 and 3 both)',
            'Test divisibility by 11 using difference of odd and even placed digits'
          ],
          coreConcepts: [
            {
              title: 'Ones Digit Tests',
              description: 'Divisible by 10 if ones digit is 0. Divisible by 5 if ones digit is 0 or 5. Divisible by 2 if ones digit is 0, 2, 4, 6, or 8.',
              formula: '2410 (div by 2, 5, 10) | 4829 (not div by 2)'
            },
            {
              title: 'Sum of Digits Tests',
              description: 'Divisible by 3 if sum of digits is a multiple of 3. Divisible by 9 if sum of digits is a multiple of 9.',
              formula: '7221: 7+2+2+1 = 12 (div by 3) | 758: 7+5+8 = 20 (not div by 9)'
            },
            {
              title: 'Divisibility by 11',
              description: 'Find difference between sum of digits at odd places (from right) and sum of digits at even places (from right). If difference is 0 or divisible by 11, the number is divisible by 11.',
              formula: '61809: Odd places (9+8+6=23), Even places (0+1=1), Diff = 22 (div by 11)'
            }
          ],
          stepByStepExample: {
            problem: 'Check whether 1331 is divisible by 11.',
            steps: [
              { stepNumber: 1, instruction: 'Sum of digits at odd places from right.', reasoning: '1 (ones) + 3 (hundreds) = 4.' },
              { stepNumber: 2, instruction: 'Sum of digits at even places from right.', reasoning: '3 (tens) + 1 (thousands) = 4.' },
              { stepNumber: 3, instruction: 'Find difference.', reasoning: '4 - 4 = 0.' },
              { stepNumber: 4, instruction: 'Apply rule.', reasoning: 'Since difference is 0, 1331 is divisible by 11.' }
            ],
            finalAnswer: '1331 is divisible by 11'
          },
          definitions: [
            { term: 'Divisibility Rule', definition: 'A shortcut test to determine whether an integer is divisible by a fixed divisor without performing division.' },
            { term: 'Co-prime Divisibility', definition: 'If a number is divisible by two co-prime numbers, it is divisible by their product (e.g. 2 and 3 -> 6).' }
          ],
          realWorldApplication: 'Verifying bank account check digits, simplifying large fractional rates, and distributing batches into equal groups.'
        },
        [
          {
            id: 'pq_c6_m3_2_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'Which of the following numbers is divisible by 6?',
            options: ['27', '18', '25', '35'],
            correctAnswer: 1,
            explanation: '18 is divisible by both 2 (even) and 3 (1+8=9, multiple of 3).',
            hint: 'Must be divisible by both 2 and 3.',
            conceptTag: 'Divisibility by 6'
          },
          {
            id: 'pq_c6_m3_2_2',
            type: 'fill-blank',
            difficulty: 'medium',
            marks: 2,
            question: 'A number is divisible by 4 if the number formed by its last ______ digits is divisible by 4.',
            correctAnswer: 'two',
            explanation: 'NCERT rule: If the number formed by the last two digits (ones and tens) is divisible by 4.',
            hint: 'Ones and tens places.',
            conceptTag: 'Divisibility by 4'
          }
        ],
        [
          {
            id: 'mq_c6_m3_2_1',
            question: 'Is 7221 divisible by 3?',
            options: [
              'Yes, because 7 + 2 + 2 + 1 = 12, which is divisible by 3',
              'No, because it ends in 1',
              'No, because 7 is not divisible by 3',
              'Only if rounded'
            ],
            correctOptionIndex: 0,
            explanation: 'Divisibility by 3 checks the sum of all digits: 7+2+2+1 = 12, which divides by 3.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Divisibility by 3',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_2_2',
            question: 'What is the rule to check divisibility by 8?',
            options: [
              'Number formed by the last three digits is divisible by 8',
              'Sum of digits is divisible by 8',
              'Last digit is 8',
              'Number is divisible by 4 only'
            ],
            correctOptionIndex: 0,
            explanation: 'For a number with 4 or more digits, the last three digits must form a number divisible by 8.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Divisibility by 8',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_2_3',
            question: 'Which of the following numbers is divisible by 11?',
            options: ['5445', '1258', '572', 'Both 5445 and 572'],
            correctOptionIndex: 3,
            explanation: '5445: (5+4)-(4+5) = 0. 572: (2+5)-7 = 0. Both are divisible by 11.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Divisibility by 11',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_2_4',
            question: 'If a number is divisible by both 9 and 10, it must be divisible by:',
            options: ['90', '19', '1', '100'],
            correctOptionIndex: 0,
            explanation: '9 and 10 are co-prime, so the number must be divisible by their product: 9 × 10 = 90.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Co-prime Rule',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_2_5',
            question: 'A number is divisible by 4 if:',
            options: [
              'The number formed by its last two digits is divisible by 4',
              'Its last digit is 4',
              'The sum of its digits is 4',
              'It has 4 digits'
            ],
            correctOptionIndex: 0,
            explanation: 'NCERT textbook: A number with 3 or more digits is divisible by 4 if the last 2 digits divide by 4.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Divisibility by 4',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_2_6',
            question: 'Why is 27 NOT divisible by 6?',
            options: [
              'Because it is not divisible by 2 (it is odd)',
              'Because it is not divisible by 3',
              'Because 27 > 6',
              'Because 6 is composite'
            ],
            correctOptionIndex: 0,
            explanation: 'To be divisible by 6, a number must be divisible by BOTH 2 and 3.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Divisibility by 6',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_2_7',
            question: 'What smallest digit should be placed in _ 6724 so that the number is divisible by 3?',
            options: ['2', '1', '0', '3'],
            correctOptionIndex: 0,
            explanation: 'Sum of known digits = 6+7+2+4 = 19. Smallest digit to make sum divisible by 3 (21) is 2 (19 + 2 = 21).',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Missing Digit Problem',
            difficulty: 'hard'
          },
          {
            id: 'mq_c6_m3_2_8',
            question: 'What makes two numbers "co-prime"?',
            options: [
              'They have only 1 as their common factor',
              'Both must be prime numbers',
              'Their difference must be 2',
              'Their sum must be even'
            ],
            correctOptionIndex: 0,
            explanation: 'NCERT definition: Two numbers having only 1 as a common factor are called co-prime numbers (e.g. 4 and 15).',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Co-prime Definition',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_m3_2_9',
            question: 'Is 2104 divisible by 8?',
            options: [
              'Yes, because 104 is divisible by 8 (104 ÷ 8 = 13)',
              'No, because 2104 ends in 4',
              'No, because 2+1+0+4 = 7',
              'Only if divided by 16'
            ],
            correctOptionIndex: 0,
            explanation: 'The last 3 digits are 104. 104 ÷ 8 = 13 with remainder 0, so 2104 is divisible by 8.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Divisibility by 8',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_m3_2_10',
            question: 'What is the divisibility rule for 5?',
            options: [
              'The ones digit must be either 0 or 5',
              'Sum of digits must be 5',
              'Last two digits must be 25',
              'The number must be odd'
            ],
            correctOptionIndex: 0,
            explanation: 'Any number ending with 0 or 5 is divisible by 5.',
            topicId: 'c6_m_ch3_t2',
            topicName: 'Tests for Divisibility of Numbers',
            conceptTag: 'Divisibility by 5',
            difficulty: 'easy'
          }
        ]
      )
    ]
  }
];

export const mathClass6Subject: Subject = {
  id: 'c6_math',
  name: 'Mathematics',
  grade: 'Class 6',
  tagline: 'Master numbers, geometry, algebra, and mensuration with NCERT textbook grounding',
  color: 'indigo',
  icon: 'Calculator',
  pdfFilename: 'NCERT-books-for-class-6-maths_ae45ad0c.pdf',
  chapters: mathClass6Chapters,
};

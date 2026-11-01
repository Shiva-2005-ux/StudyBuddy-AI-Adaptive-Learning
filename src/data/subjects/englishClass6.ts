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
      bookName: 'Poorvi: Textbook of English for Grade 6',
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
        `Grounded strictly in NCERT English Textbook: Poorvi (${pdfSection}).`,
        'Focus on vocabulary in context, grammar fundamentals, and literary comprehension.',
        'Reflect on moral lessons and character perspectives.',
      ],
      formulasAndRules: [],
      commonMistakes: [
        {
          mistake: 'Focusing only on literal plot points without understanding the underlying moral or grammatical context.',
          correction: 'Observe how literary devices like metaphors, rhymes, and dialogue choices convey deeper character values.',
        },
      ],
      examBoosterTips: [
        'Notice theme keywords (perseverance, empathy, resilience) to construct analytical answers.',
        'Score >= 60% on the mastery quiz to unlock the next chapter and topic.',
      ],
    },
  };
}

export const englishClass6Chapters: Chapter[] = [
  {
    id: 'c6_eng_ch1',
    name: 'Chapter 1: A Bottle of Dew',
    order: 1,
    subjectId: 'c6_eng',
    grade: 'Class 6',
    iconName: 'BookMarked',
    description: 'By Sudha Murty — The inspiring story of Rama, his devoted wife Madhumati, and Sage Mahipati who taught him that true magic is hard work.',
    pdfSourceBook: 'Poorvi: Textbook of English for Grade 6',
    pdfPageRange: 'Pages 1–12',
    topics: [
      makeTopic(
        'c6_e_ch1_t1',
        'A Bottle of Dew: Story & Vocabulary',
        1,
        'c6_eng_ch1',
        'Read Sudha Murty\'s celebrated tale about Rama, who spent his wealth chasing an alchemist potion until a wise sage redirected his energy into hard work.',
        'Unit 1: Fables and Folk Tales',
        'Pages 1–8',
        {
          introduction: 'Rama was the son of a wealthy landlord who believed in magic potions that could turn copper into gold. Sage Mahipati promised him the secret potion on one condition: he must collect five litres of winter morning dew from banana plants himself.',
          learningObjectives: [
            'Understand the plot, characters (Rama, Madhumati, Sage Mahipati), and moral theme',
            'Recognize that wealth and prosperity stem from perseverance and diligent labour',
            'Master new vocabulary words: alchemist, potion, dilapidated, diligent, barren'
          ],
          coreConcepts: [
            {
              title: 'The Search for the Magic Dew',
              description: 'To collect five litres of morning dew, Rama had to clear barren fields, plant rows of banana trees, tend to them every dawn, and collect dew drop by drop over six years.',
              bulletPoints: [
                'Rama planted and nurtured hundreds of banana trees with his own hands',
                'His wife Madhumati harvested and sold the bananas in the marketplace',
                'By the time Rama filled the vessel with dew, their family had accumulated sacks of gold coins through the honest sale of bananas'
              ]
            },
            {
              title: 'The Sage\'s Wisdom',
              description: 'When Rama poured the dew over copper and nothing happened, Sage Mahipati smiled and pointed to the gold coins Madhumati had saved from his banana harvests: "This is the real magic. Your hard work has created this gold!"',
              formula: 'Hard work + Diligence = Genuine Prosperity'
            }
          ],
          stepByStepExample: {
            problem: 'Why did Sage Mahipati ask Rama to collect five litres of dew from banana leaves instead of simply telling him to work?',
            steps: [
              { stepNumber: 1, instruction: 'Analyze Rama\'s mindset.', reasoning: 'Rama was obsessed with magic potions and would have rejected ordinary advice to become a farmer.' },
              { stepNumber: 2, instruction: 'Examine the Sage\'s pedagogical method.', reasoning: 'By framing the dew collection as the essential magic ingredient, the Sage inspired Rama to plant and tend banana trees for six continuous years.' },
              { stepNumber: 3, instruction: 'Observe the outcome.', reasoning: 'Rama developed the habit of diligent farming and realized the true value of hard work.' }
            ],
            finalAnswer: 'The Sage used a clever condition to transform Rama from an idle dreamer into an industrious, prosperous farmer.'
          },
          definitions: [
            { term: 'Potion', definition: 'A liquid with magical, medicinal, or poisonous properties.' },
            { term: 'Perseverance', definition: 'Persistence in doing something despite difficulty or delay in achieving success.' }
          ],
          difficultTerminology: [
            { term: 'Dilapidated', meaning: 'In a state of disrepair or ruin as a result of age or neglect', context: 'Rama\'s ancestral fields were dilapidated before he began cultivating them.' }
          ],
          importantFacts: [
            'Story authored by philanthropist and author Sudha Murty.',
            'Highlights that honest effort always yields sweeter and lasting rewards than shortcuts.'
          ],
          realWorldApplication: 'Daily study habits, sports training, and career achievements all mirror Rama\'s lesson: consistent daily effort creates mastery.'
        },
        [
          {
            id: 'pq_c6_e1_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'Who is the author of the story "A Bottle of Dew"?',
            options: ['Sudha Murty', 'Ruskin Bond', 'R.K. Narayan', 'Rabindranath Tagore'],
            correctAnswer: 0,
            explanation: 'Sudha Murty wrote "A Bottle of Dew", featured in NCERT Poorvi.',
            hint: 'Renowned author and philanthropist.',
            conceptTag: 'Author Identification'
          },
          {
            id: 'pq_c6_e1_2',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: 'Rama collected morning dew from the leaves of ______ trees.',
            correctAnswer: 'banana',
            explanation: 'Sage Mahipati instructed Rama to collect dew from banana leaves.',
            hint: 'A fruit tree with large green leaves.',
            conceptTag: 'Plot Recall'
          }
        ],
        [
          {
            id: 'mq_c6_e1_1_1',
            question: 'What did Rama believe throughout his youth before meeting the Sage?',
            options: [
              'That an alchemist potion could turn copper into gold',
              'That he should become a merchant in the city',
              'That farming was the highest honour',
              'That books had magic spells'
            ],
            correctOptionIndex: 0,
            explanation: 'Rama spent his inheritance searching for a magical potion to turn copper into gold.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Story Premise',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e1_1_2',
            question: 'What condition did Sage Mahipati set for Rama to create the magic potion?',
            options: [
              'He must collect five litres of winter morning dew from banana leaves with his own hands',
              'He must meditate in the forest for 10 years',
              'He must give away all his property to the village',
              'He must travel to the Himalayas'
            ],
            correctOptionIndex: 0,
            explanation: 'The Sage required five litres of dew collected by Rama himself from banana leaves.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'The Condition',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e1_1_3',
            question: 'Who helped Rama by selling the bananas harvested from the plantation?',
            options: ['His wife Madhumati', 'Sage Mahipati', 'The village headman', 'His brothers'],
            correctOptionIndex: 0,
            explanation: 'Madhumati diligently took the bananas to market and saved the money earned.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Characters',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e1_1_4',
            question: 'How long did it take Rama to gather five litres of morning dew?',
            options: ['Six years', 'Six months', 'One year', 'Twelve years'],
            correctOptionIndex: 0,
            explanation: 'It took Rama six years of diligent dawn harvesting to collect five litres of dew.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Plot Details',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_e1_1_5',
            question: 'What happened when Rama poured the collected dew onto copper in front of the Sage?',
            options: [
              'Nothing happened to the copper; it remained copper',
              'The copper instantly turned into sparkling gold',
              'The copper melted into silver',
              'A bright light appeared'
            ],
            correctOptionIndex: 0,
            explanation: 'The copper did not change because dew has no chemical power to convert metals.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Climax',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_e1_1_6',
            question: 'What did Sage Mahipati show Rama to explain the real meaning of the magic potion?',
            options: [
              'The sacks of gold coins Madhumati had saved from selling their bananas',
              'A book of ancient scriptures',
              'A magical mirror',
              'A bag of fertilizer'
            ],
            correctOptionIndex: 0,
            explanation: 'The Sage pointed to the gold earned by selling bananas from the trees Rama had planted.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Moral Resolution',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e1_1_7',
            question: 'What is the primary moral of "A Bottle of Dew"?',
            options: [
              'True wealth is earned through hard work, perseverance, and dedication',
              'One should never trust strangers',
              'Magic is the fastest way to get rich',
              'Dew has medicinal value'
            ],
            correctOptionIndex: 0,
            explanation: 'The central theme is that honest diligent work is the only real alchemy in life.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Moral Lesson',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e1_1_8',
            question: 'What is the antonym of the word "diligent"?',
            options: ['Lazy / Idle', 'Careful', 'Persistent', 'Honest'],
            correctOptionIndex: 0,
            explanation: 'Diligent means hardworking and thorough; its opposite is lazy or idle.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Vocabulary Antonyms',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_e1_1_9',
            question: 'In the story, why was Madhumati a vital character in Rama\'s transformation?',
            options: [
              'She managed the crop sales smartly and saved the wealth without distracting Rama from his task',
              'She knew how to make potions herself',
              'She asked the Sage for help',
              'She went to the city to trade silk'
            ],
            correctOptionIndex: 0,
            explanation: 'Madhumati saw the practical opportunity, sold the bananas, and turned Rama\'s effort into real wealth.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Character Analysis',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_e1_1_10',
            question: 'Which literary genre does "A Bottle of Dew" belong to?',
            options: [
              'Folk tale with a didactic moral',
              'Science fiction thriller',
              'Historical biography',
              'Tragic drama'
            ],
            correctOptionIndex: 0,
            explanation: 'It is a traditional wisdom folk tale teaching timeless moral values.',
            topicId: 'c6_e_ch1_t1',
            topicName: 'A Bottle of Dew: Story & Vocabulary',
            conceptTag: 'Genre Knowledge',
            difficulty: 'easy'
          }
        ]
      )
    ]
  },
  {
    id: 'c6_eng_ch2',
    name: 'Chapter 2: The Raven and the Fox',
    order: 2,
    subjectId: 'c6_eng',
    grade: 'Class 6',
    iconName: 'Feather',
    description: 'An Aesop fable retold in poetic verse — A raven holding a morsel of cheese is flattered by a cunning fox into opening its beak to sing.',
    pdfSourceBook: 'Poorvi: Textbook of English for Grade 6',
    pdfPageRange: 'Pages 13–19',
    topics: [
      makeTopic(
        'c6_e_ch2_t1',
        'The Raven and the Fox: Flattery & Poetic Devices',
        1,
        'c6_eng_ch2',
        'Explore the classic verse fable, examine rhyme schemes, character motivations, and the danger of succumbing to false praise.',
        'Unit 1: Fables and Folk Tales',
        'Pages 13–19',
        {
          introduction: 'Perched high in an oak tree, Master Raven held a delicious morsel of cheese in his beak. Below, Sir Fox caught the appetizing scent and devised a clever plan of flattery.',
          learningObjectives: [
            'Analyze the poetic rhythm and rhyme scheme of the fable',
            'Understand how flattery exploits human and animal vanity',
            'Identify key vocabulary: morsel, flattery, vanity, perched, plumage'
          ],
          coreConcepts: [
            {
              title: 'The Art of Flattery',
              description: 'The fox did not use force or threats; instead, he praised the raven\'s glossy black plumage, noble stance, and claimed his voice must be sweeter than any nightingale\'s.',
              bulletPoints: [
                'The raven, blinded by pride, wished to show off his vocal talent',
                'As he opened his beak to caw, the cheese fell directly into the fox\'s waiting mouth',
                'The fox concluded: "Flatterers live at the expense of those who listen to them."'
              ]
            }
          ],
          stepByStepExample: {
            problem: 'What lesson does the fox teach the raven after catching the fallen cheese?',
            steps: [
              { stepNumber: 1, instruction: 'Examine the fox\'s closing dialogue.', reasoning: 'The fox tells the raven that every flatterer lives at the expense of those who listen to him.' },
              { stepNumber: 2, instruction: 'Identify the trade-off.', reasoning: 'The raven paid for a hollow compliment with his real, tangible food.' }
            ],
            finalAnswer: 'Never let vanity make you vulnerable to insincere compliments from people with hidden motives.'
          },
          definitions: [
            { term: 'Flattery', definition: 'Excessive and insincere praise, especially given to further one\'s own interests.' },
            { term: 'Fable', definition: 'A short story or poem, typically with animals as characters, conveying a moral.' }
          ],
          realWorldApplication: 'Social media validation, discerning genuine advice from false compliments, and staying humble.'
        },
        [
          {
            id: 'pq_c6_e2_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'What was Master Raven holding in his beak?',
            options: ['A piece of cheese', 'A golden coin', 'A shiny berry', 'A fish'],
            correctAnswer: 0,
            explanation: 'Master Raven was holding a morsel of cheese in his beak.',
            hint: 'A dairy food item.',
            conceptTag: 'Fable Comprehension'
          },
          {
            id: 'pq_c6_e2_2',
            type: 'fill-blank',
            difficulty: 'medium',
            marks: 2,
            question: 'The fox praised the raven\'s glossy feathers and asked him to ______',
            correctAnswer: 'sing',
            explanation: 'The fox flattered the raven by asking him to sing, knowing his beak would open.',
            hint: 'Produce vocal music.',
            conceptTag: 'Character Action'
          }
        ],
        [
          {
            id: 'mq_c6_e2_1_1',
            question: 'Where was Master Raven sitting at the start of the poem?',
            options: ['On a tree branch (oak tree)', 'On a fence', 'By a river bank', 'On a rooftop'],
            correctOptionIndex: 0,
            explanation: 'The raven was perched high on an oak tree.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Poem Setting',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e2_1_2',
            question: 'How did the fox persuade the raven to open his mouth?',
            options: [
              'By praising his plumage and asking to hear his melodious voice',
              'By shaking the tree',
              'By offering him money',
              'By threatening him'
            ],
            correctOptionIndex: 0,
            explanation: 'The fox used clever flattery about the raven\'s voice.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Fox Strategy',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e2_1_3',
            question: 'What happened the instant the raven opened his beak to sing?',
            options: [
              'The cheese fell and the fox caught it',
              'A beautiful song resonated in the woods',
              'Other birds joined in singing',
              'The fox ran away frightened'
            ],
            correctOptionIndex: 0,
            explanation: 'As the beak opened, the cheese dropped into the fox\'s mouth.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Plot Climax',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e2_1_4',
            question: 'What moral did the fox deliver to the disappointed raven?',
            options: [
              'Flatterers live at the expense of those who listen to them',
              'Birds should never eat cheese',
              'Always sing from the highest branch',
              'Foxes are faster runners than birds'
            ],
            correctOptionIndex: 0,
            explanation: 'The fox stated: "Learn that each flatterer lives at the expense of those who give heed."',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Moral Lesson',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e2_1_5',
            question: 'What character flaw in the raven caused his loss?',
            options: ['Vanity and pride', 'Greed', 'Cowardice', 'Anger'],
            correctOptionIndex: 0,
            explanation: 'The raven\'s vanity made him hungry for praise, making him gullible.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Character Trait',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_e2_1_6',
            question: 'What does the word "morsel" mean in the poem?',
            options: ['A small piece of food', 'A loud noise', 'A bird feather', 'A musical instrument'],
            correctOptionIndex: 0,
            explanation: 'A morsel is a bite-sized, small portion of food.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Vocabulary Meaning',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e2_1_7',
            question: 'What type of poem uses animals to convey a universal moral truth?',
            options: ['A verse fable', 'An epic poem', 'A sonnet', 'An elegy'],
            correctOptionIndex: 0,
            explanation: 'Fables feature animal characters behaving like humans to teach a moral lesson.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Literary Form',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_e2_1_8',
            question: 'Which poetic sound device is present in "sweet song softly sung"?',
            options: ['Alliteration', 'Onomatopoeia', 'Simile', 'Hyperbole'],
            correctOptionIndex: 0,
            explanation: 'Repetition of the initial "s" sound is alliteration.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Poetic Device',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_e2_1_9',
            question: 'Did the fox intend to become friends with the raven?',
            options: [
              'No, his sole interest was getting the cheese through deceit',
              'Yes, he wanted a singing partner',
              'Yes, they shared the meal',
              'He wanted to learn how to fly'
            ],
            correctOptionIndex: 0,
            explanation: 'The fox acted purely out of self-interest to obtain the cheese.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Motivation Analysis',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_e2_1_10',
            question: 'How did the raven feel after the cheese was taken?',
            options: [
              'Foolish, ashamed, and determined not to be flattered again',
              'Proud of his singing',
              'Hungry but happy',
              'Completely indifferent'
            ],
            correctOptionIndex: 0,
            explanation: 'The raven swore, though somewhat late, that he would never be caught in such flattery again.',
            topicId: 'c6_e_ch2_t1',
            topicName: 'The Raven and the Fox: Flattery & Poetic Devices',
            conceptTag: 'Emotional Resolution',
            difficulty: 'easy'
          }
        ]
      )
    ]
  }
];

export const englishClass6Subject: Subject = {
  id: 'c6_eng',
  name: 'English',
  grade: 'Class 6',
  tagline: 'Poorvi — Stories, fables, nature poems, and communicative language skills',
  color: 'emerald',
  icon: 'BookMarked',
  pdfFilename: 'english_6_3d7e131c.pdf',
  chapters: englishClass6Chapters,
};

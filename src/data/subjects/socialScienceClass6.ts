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
      bookName: 'Exploring Society: India and Beyond — Grade 6',
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
        `Grounded strictly in NCERT Social Science Textbook: Exploring Society (${pdfSection}).`,
        'Remember that history, geography, and civic institutions explain how our society functions.',
        'Use exact historical terms and geographical definitions.',
      ],
      formulasAndRules: [],
      commonMistakes: [
        {
          mistake: 'Confusing latitudes (parallels) with longitudes (meridians).',
          correction: 'Latitudes run horizontally parallel to the Equator; longitudes run vertically between North and South poles.',
        },
      ],
      examBoosterTips: [
        'Connect geographical features with how people live and earn their livelihood.',
        'Score >= 60% on the mastery quiz to unlock the next topic.',
      ],
    },
  };
}

export const socialScienceClass6Chapters: Chapter[] = [
  {
    id: 'c6_soc_ch1',
    name: 'Chapter 1: Locating Places on the Earth',
    order: 1,
    subjectId: 'c6_sst',
    grade: 'Class 6',
    iconName: 'Globe',
    description: 'Learn about the Earth as a sphere, the Equator, parallels of latitude, meridians of longitude, and geographic coordinates.',
    pdfSourceBook: 'Exploring Society: India and Beyond',
    pdfPageRange: 'Pages 7–26',
    topics: [
      makeTopic(
        'c6_soc_ch1_t1',
        'Earth Shape, Latitudes & Hemispheres',
        1,
        'c6_soc_ch1',
        'Understand the spherical Earth, the Equator as 0° latitude, Northern and Southern Hemispheres, and important parallels of latitude.',
        'Theme A, Chapter 1',
        'Pages 7–16',
        {
          introduction: 'How do we know where a place is located on our vast planet? Geographers developed a network of imaginary horizontal lines called latitudes that circle the globe.',
          learningObjectives: [
            'Identify the Equator as 0° latitude dividing Earth into Northern and Southern Hemispheres',
            'Define parallels of latitude and how distance is measured in degrees',
            'Locate important parallels: Tropic of Cancer, Tropic of Capricorn, Arctic & Antarctic circles'
          ],
          coreConcepts: [
            {
              title: 'The Equator and Hemispheres',
              description: 'The Equator is an imaginary line drawn around the middle of the Earth at 0° latitude. It divides the Earth into the Northern Hemisphere and Southern Hemisphere.',
              bulletPoints: [
                'All latitudes North of the Equator are designated with N (e.g. 20° N)',
                'All latitudes South of the Equator are designated with S (e.g. 20° S)',
                'North Pole is at 90° N; South Pole is at 90° S'
              ]
            },
            {
              title: 'Parallels of Latitude',
              description: 'All parallel circles from the Equator up to the poles are called parallels of latitude. Because they are parallel, they never meet, but their size decreases towards the poles.',
              formula: 'Equator = 0° | Tropic of Cancer = 23½° N | Tropic of Capricorn = 23½° S'
            }
          ],
          stepByStepExample: {
            problem: 'Why do parallels of latitude get smaller in length as we move towards the poles?',
            steps: [
              { stepNumber: 1, instruction: 'Observe Earth as a 3D sphere.', reasoning: 'Earth is widest at the equator and tapers towards the poles.' },
              { stepNumber: 2, instruction: 'Slice the sphere horizontally.', reasoning: 'Slices near the centre (equator) produce the largest circles. Slices near the top/bottom produce smaller circles.' },
              { stepNumber: 3, instruction: 'Conclusion.', reasoning: 'At the poles (90° N and 90° S), the parallel circle shrinks to a single point.' }
            ],
            finalAnswer: 'Parallels shrink in circumference from the equator (largest circle) to points at the poles.'
          },
          definitions: [
            { term: 'Equator', definition: 'The imaginary circle around the Earth equidistant from the North and South poles, representing 0° latitude.' },
            { term: 'Latitude', definition: 'The angular distance of a place north or south of the Earth equator, measured in degrees.' }
          ],
          realWorldApplication: 'GPS navigation in smartphones, flight navigation routes, and climate zone boundaries.'
        },
        [
          {
            id: 'pq_c6_ss1_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'What is the latitude of the Equator?',
            options: ['90°', '0°', '23½°', '66½°'],
            correctAnswer: 1,
            explanation: 'The Equator is the reference baseline for latitude, defined as 0°.',
            hint: 'Reference starting line for all latitudes.',
            conceptTag: 'Equator'
          },
          {
            id: 'pq_c6_ss1_2',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: 'The Tropic of Cancer is located at ______ degrees North latitude.',
            correctAnswer: '23.5',
            explanation: 'The Tropic of Cancer is at 23½° N (23.5° N).',
            hint: '23 and a half degrees.',
            conceptTag: 'Important Parallels'
          }
        ],
        [
          {
            id: 'mq_c6_ss1_1_1',
            question: 'Which line divides the Earth into the Northern and Southern Hemispheres?',
            options: ['Equator', 'Prime Meridian', 'Tropic of Cancer', 'Arctic Circle'],
            correctOptionIndex: 0,
            explanation: 'The Equator (0° latitude) separates Earth into the Northern and Southern Hemispheres.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Hemispheres',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_1_2',
            question: 'What is the latitude of the South Pole?',
            options: ['90° S', '0° S', '180° S', '45° S'],
            correctOptionIndex: 0,
            explanation: 'The South Pole is located at 90° S latitude.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Poles',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_1_3',
            question: 'Which of the following is true about parallels of latitude?',
            options: [
              'They all have equal length',
              'They never intersect each other',
              'They meet at the Prime Meridian',
              'They run vertically from north to south'
            ],
            correctOptionIndex: 1,
            explanation: 'Parallels of latitude are parallel circles that never meet each other.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Latitude Properties',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_1_4',
            question: 'The Tropic of Capricorn is located in which hemisphere?',
            options: ['Southern Hemisphere (23½° S)', 'Northern Hemisphere (23½° N)', 'Eastern Hemisphere', 'Western Hemisphere'],
            correctOptionIndex: 0,
            explanation: 'Tropic of Capricorn is at 23½° S in the Southern Hemisphere.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Tropics',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_1_5',
            question: 'What happens to the size of the circles of latitude as we travel from the equator towards either pole?',
            options: [
              'Their size decreases until they become a dot at the poles',
              'Their size increases',
              'Their size remains unchanged',
              'They expand in the Southern hemisphere'
            ],
            correctOptionIndex: 0,
            explanation: 'Due to the spherical shape of Earth, the circles get progressively smaller towards the poles.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Earth Geometry',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_1_6',
            question: 'What parallel of latitude is located at 66½° North?',
            options: ['Arctic Circle', 'Antarctic Circle', 'Tropic of Cancer', 'Equator'],
            correctOptionIndex: 0,
            explanation: 'The Arctic Circle is located at 66½° N.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Special Parallels',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_1_7',
            question: 'If a city is located at 20° S, in which hemisphere is it situated?',
            options: ['Southern Hemisphere', 'Northern Hemisphere', 'Eastern Hemisphere only', 'Western Hemisphere only'],
            correctOptionIndex: 0,
            explanation: 'The letter S signifies south of the Equator in the Southern Hemisphere.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Hemisphere Notation',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_1_8',
            question: 'Why are degrees of latitude denoted with N or S?',
            options: [
              'To show whether a place is north or south of the Equator',
              'To show the time of day',
              'To show altitude above sea level',
              'To show wind speed'
            ],
            correctOptionIndex: 0,
            explanation: 'The letters N and S specify the direction relative to the 0° Equator.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Cardinal Direction',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_1_9',
            question: 'What is the latitude of the Antarctic Circle?',
            options: ['66½° S', '66½° N', '23½° S', '90° S'],
            correctOptionIndex: 0,
            explanation: 'The Antarctic Circle is located at 66½° S.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Special Parallels',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_1_10',
            question: 'Is the distance from the Equator to either pole one-fourth of a circle around the Earth?',
            options: [
              'Yes, 90° is 1/4 of 360°',
              'No, it is half of a circle',
              'No, it is 1/3 of a circle',
              'No, poles are not measured in degrees'
            ],
            correctOptionIndex: 0,
            explanation: 'Earth circle is 360°. From 0° to 90° is 90/360 = 1/4 of the circumference.',
            topicId: 'c6_soc_ch1_t1',
            topicName: 'Earth Shape, Latitudes & Hemispheres',
            conceptTag: 'Angular Measurement',
            difficulty: 'hard'
          }
        ]
      ),
      makeTopic(
        'c6_soc_ch1_t2',
        'Longitudes, Prime Meridian & Coordinates',
        2,
        'c6_soc_ch1',
        'Learn about meridians of longitude, the Prime Meridian at Greenwich (0°), the International Date Line (180°), and pinpointing coordinates.',
        'Theme A, Chapter 1',
        'Pages 17–26',
        {
          introduction: 'Latitude alone cannot pinpoint a location. Knowing whether a place is east or west requires vertical lines running from the North Pole to the South Pole called longitudes.',
          learningObjectives: [
            'Define meridians of longitude and the Prime Meridian (0°)',
            'Understand Eastern and Western Hemispheres',
            'Combine latitude and longitude into coordinates to pinpoint any point on Earth'
          ],
          coreConcepts: [
            {
              title: 'The Prime Meridian',
              description: 'The Prime Meridian passes through Greenwich, London, and represents 0° longitude. It divides the Earth into the Eastern and Western Hemispheres.',
              formula: 'Prime Meridian = 0° Longitude | Anti-meridian = 180° Longitude'
            },
            {
              title: 'The Geographic Grid',
              description: 'The criss-crossing network of parallels of latitude and meridians of longitude forms the Earth grid. Where a latitude and longitude intersect is a precise location coordinate.',
              bulletPoints: [
                'Longitudes meet at both poles',
                'Distance between meridians is greatest at the equator and reduces to zero at the poles',
                '180° East and 180° West are the very same line'
              ]
            }
          ],
          stepByStepExample: {
            problem: 'How do you pinpoint a location using the grid system?',
            steps: [
              { stepNumber: 1, instruction: 'Determine the latitude.', reasoning: 'Find how many degrees North or South of the Equator the place lies.' },
              { stepNumber: 2, instruction: 'Determine the longitude.', reasoning: 'Find how many degrees East or West of the Prime Meridian it lies.' },
              { stepNumber: 3, instruction: 'Find the intersection point.', reasoning: 'The exact intersection of the two lines gives the unique coordinates (e.g., 28° N, 77° E for Delhi).' }
            ],
            finalAnswer: 'Latitude + Longitude coordinates uniquely identify any location on Earth.'
          },
          definitions: [
            { term: 'Prime Meridian', definition: 'The 0° meridian of longitude passing through Greenwich observatory near London.' },
            { term: 'Grid', definition: 'The intersecting network of parallels of latitude and meridians of longitude on a globe.' }
          ],
          realWorldApplication: 'Aviation flight paths, sea navigation, digital map tracking, and meteorological weather forecasts.'
        },
        [
          {
            id: 'pq_c6_ss1_2_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'What is the longitude value of the Prime Meridian?',
            options: ['0°', '90°', '180°', '360°'],
            correctAnswer: 0,
            explanation: 'The Prime Meridian is the reference line for longitude, defined as 0°.',
            hint: 'Starting meridian at Greenwich.',
            conceptTag: 'Prime Meridian'
          },
          {
            id: 'pq_c6_ss1_2_2',
            type: 'fill-blank',
            difficulty: 'medium',
            marks: 2,
            question: 'Meridians of longitude meet at the ______',
            correctAnswer: 'poles',
            explanation: 'All meridians converge and meet at the North and South poles.',
            hint: 'Top and bottom of the Earth.',
            conceptTag: 'Meridian Convergence'
          }
        ],
        [
          {
            id: 'mq_c6_ss1_2_1',
            question: 'Through which place does the Prime Meridian (0° longitude) pass?',
            options: ['Greenwich (London)', 'New Delhi (India)', 'Paris (France)', 'Cairo (Egypt)'],
            correctOptionIndex: 0,
            explanation: 'The Prime Meridian passes through the British Royal Observatory at Greenwich near London.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Greenwich Meridian',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_2_2',
            question: 'Where is the distance between two meridians of longitude greatest?',
            options: ['At the Equator', 'At the Tropic of Cancer', 'At the Arctic Circle', 'At the Poles'],
            correctOptionIndex: 0,
            explanation: 'Meridians are furthest apart at the equator and converge to 0 distance at the poles.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Meridian Spacing',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_2_3',
            question: 'What line lies directly opposite the Prime Meridian on the globe?',
            options: ['180° meridian', '90° meridian', 'Equator', 'Tropic of Cancer'],
            correctOptionIndex: 0,
            explanation: 'The 180° meridian (anti-meridian) is directly opposite 0° Prime Meridian.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: '180th Meridian',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_2_4',
            question: 'Which two hemispheres are divided by the Prime Meridian and 180° meridian?',
            options: [
              'Eastern and Western Hemispheres',
              'Northern and Southern Hemispheres',
              'Upper and Lower Hemispheres',
              'Land and Water Hemispheres'
            ],
            correctOptionIndex: 0,
            explanation: 'The Prime Meridian and 180° line divide Earth into Eastern and Western Hemispheres.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Hemispheres',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_2_5',
            question: 'What is formed when parallels of latitude and meridians of longitude intersect on a globe?',
            options: ['A geographic grid', 'A contour map', 'A time zone', 'An equator'],
            correctOptionIndex: 0,
            explanation: 'The network of intersecting latitudes and longitudes is called the geographic grid.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Geographic Grid',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss1_2_6',
            question: 'If a place has coordinates 28° N, 77° E, what do these two numbers represent?',
            options: [
              '28° North latitude and 77° East longitude',
              '28° North longitude and 77° East latitude',
              '28 km north and 77 km east',
              '28 minutes and 77 seconds'
            ],
            correctOptionIndex: 0,
            explanation: 'First number is latitude (North/South), second is longitude (East/West).',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Coordinate Reading',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_2_7',
            question: 'Are all meridians of longitude equal in length?',
            options: [
              'Yes, all meridians of longitude have equal semi-circular length from pole to pole',
              'No, they vary like latitudes',
              'Only in the northern hemisphere',
              'Only at Greenwich'
            ],
            correctOptionIndex: 0,
            explanation: 'Unlike latitudes which decrease in circumference, all meridians connect pole to pole and are equal in length.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Longitude Property',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_2_8',
            question: 'What is the longitude value of the 180° East and 180° West lines?',
            options: [
              'They are the exact same line on the globe',
              'They are two separate lines on opposite sides',
              'They intersect at the equator',
              'They do not exist'
            ],
            correctOptionIndex: 0,
            explanation: '180° East and 180° West are on the same line.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Anti-Meridian',
            difficulty: 'hard'
          },
          {
            id: 'mq_c6_ss1_2_9',
            question: 'Why can we not locate a place using latitude alone?',
            options: [
              'Because a whole parallel of latitude circles the globe; we need longitude to pinpoint the exact east-west spot',
              'Because latitude only shows height',
              'Because latitude changes with seasons',
              'Because latitudes are invisible'
            ],
            correctOptionIndex: 0,
            explanation: 'A circle of latitude has infinite points; we need the crossing meridian of longitude.',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'Grid Location',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss1_2_10',
            question: 'In which hemisphere is India situated with respect to the Equator and Prime Meridian?',
            options: [
              'Northern and Eastern Hemispheres',
              'Southern and Eastern Hemispheres',
              'Northern and Western Hemispheres',
              'Southern and Western Hemispheres'
            ],
            correctOptionIndex: 0,
            explanation: 'India lies entirely in the Northern Hemisphere (above Equator) and Eastern Hemisphere (east of Prime Meridian).',
            topicId: 'c6_soc_ch1_t2',
            topicName: 'Longitudes, Prime Meridian & Coordinates',
            conceptTag: 'India Geography',
            difficulty: 'easy'
          }
        ]
      )
    ]
  },
  {
    id: 'c6_soc_ch2',
    name: 'Chapter 2: Oceans and Continents',
    order: 2,
    subjectId: 'c6_sst',
    grade: 'Class 6',
    iconName: 'Compass',
    description: 'Explore the major domains of the Earth: 7 Continents (Asia, Africa, North America, South America, Antarctica, Europe, Australia) and 5 Oceans.',
    pdfSourceBook: 'Exploring Society: India and Beyond',
    pdfPageRange: 'Pages 27–40',
    topics: [
      makeTopic(
        'c6_soc_ch2_t1',
        'The Seven Continents of the World',
        1,
        'c6_soc_ch2',
        'Study Asia (largest), Africa (Sahara, Nile), North & South America (Isthmus of Panama, Amazon, Andes), Europe, Australia (island continent), and Antarctica.',
        'Theme A, Chapter 2',
        'Pages 27–34',
        {
          introduction: 'Continents are large landmasses separated by vast expanses of water. More than two-thirds of the Earth surface is covered by oceans, but continents host human civilizations.',
          learningObjectives: [
            'List the seven continents in order of size',
            'Identify major geographic features of each continent (e.g. Ural Mountains, Sahara, Amazon, Great Barrier Reef)',
            'Understand how continents are separated or connected by isthmuses and straits'
          ],
          coreConcepts: [
            {
              title: 'Asia & Africa',
              description: 'Asia is the largest continent covering about one-third of total land area. Africa is the second largest; the equator passes almost through its middle.',
              bulletPoints: [
                'Asia is separated from Europe by the Ural mountains',
                'Africa contains the world largest hot desert (Sahara) and longest river (Nile)',
                'Africa is the only continent through which Tropic of Cancer, Equator, and Tropic of Capricorn all pass'
              ]
            },
            {
              title: 'The Americas, Europe, Australia & Antarctica',
              description: 'North America is linked to South America by the Isthmus of Panama. Australia is the smallest continent and an island. Antarctica is permanently covered in thick ice sheets.',
              formula: 'Isthmus = narrow strip of land joining two landmasses | Strait = narrow passage of water connecting two large water bodies'
            }
          ],
          stepByStepExample: {
            problem: 'What is the difference between an Isthmus and a Strait?',
            steps: [
              { stepNumber: 1, instruction: 'Define Isthmus.', reasoning: 'A narrow strip of land joining two large landmasses (e.g. Isthmus of Panama joining North and South America).' },
              { stepNumber: 2, instruction: 'Define Strait.', reasoning: 'A narrow passage of water connecting two large water bodies (e.g. Palk Strait between India and Sri Lanka).' }
            ],
            finalAnswer: 'An isthmus connects land; a strait connects bodies of water.'
          },
          definitions: [
            { term: 'Continent', definition: 'One of the seven great land divisions of the Earth.' },
            { term: 'Island Continent', definition: 'A continent surrounded on all sides by oceans and seas, specifically Australia.' }
          ],
          realWorldApplication: 'Global shipping canals (Panama Canal cutting through the isthmus), international trade routes, and polar research stations.'
        },
        [
          {
            id: 'pq_c6_ss2_1',
            type: 'mcq',
            difficulty: 'easy',
            marks: 2,
            question: 'Which is the largest continent on Earth?',
            options: ['Africa', 'Asia', 'North America', 'Europe'],
            correctAnswer: 1,
            explanation: 'Asia is the largest continent, covering approximately one-third of the total land area.',
            hint: 'Contains India and China.',
            conceptTag: 'Continents'
          },
          {
            id: 'pq_c6_ss2_2',
            type: 'fill-blank',
            difficulty: 'easy',
            marks: 2,
            question: 'The narrow strip of land linking North America to South America is the Isthmus of ______',
            correctAnswer: 'Panama',
            explanation: 'The Isthmus of Panama connects North America and South America.',
            hint: 'Named after the Central American country with a famous canal.',
            conceptTag: 'Isthmus'
          }
        ],
        [
          {
            id: 'mq_c6_ss2_1_1',
            question: 'Which continent is known as the "Island Continent"?',
            options: ['Australia', 'Antarctica', 'South America', 'Europe'],
            correctOptionIndex: 0,
            explanation: 'Australia is surrounded on all sides by oceans and seas, making it an island continent.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Australia',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss2_1_2',
            question: 'Which mountain range separates Europe from Asia on the west?',
            options: ['Ural Mountains', 'Himalayas', 'Alps', 'Andes'],
            correctOptionIndex: 0,
            explanation: 'The Ural Mountains form the natural geographic boundary between Europe and Asia.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Eurasia Boundary',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss2_1_3',
            question: 'Through which continent do the Tropic of Cancer, Equator, and Tropic of Capricorn ALL pass?',
            options: ['Africa', 'Asia', 'South America', 'Australia'],
            correctOptionIndex: 0,
            explanation: 'Africa is the only continent through which all three latitude lines pass.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Africa Geography',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss2_1_4',
            question: 'Where is the world longest river, the Nile, located?',
            options: ['Africa', 'South America', 'Asia', 'North America'],
            correctOptionIndex: 0,
            explanation: 'The river Nile flows through northeastern Africa.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'River Nile',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss2_1_5',
            question: 'What is an isthmus?',
            options: [
              'A narrow strip of land connecting two large land masses',
              'A narrow body of water connecting two oceans',
              'A piece of land surrounded by water on three sides',
              'A deep oceanic trench'
            ],
            correctOptionIndex: 0,
            explanation: 'An isthmus is a narrow strip of land joining two larger landmasses.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Geographical Features',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss2_1_6',
            question: 'The world longest mountain range, the Andes, runs through which continent?',
            options: ['South America', 'North America', 'Europe', 'Asia'],
            correctOptionIndex: 0,
            explanation: 'The Andes mountain range stretches along the entire western edge of South America.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Andes Mountains',
            difficulty: 'medium'
          },
          {
            id: 'mq_c6_ss2_1_7',
            question: 'Why are there no permanent human settlements in Antarctica?',
            options: [
              'It is permanently covered in thick ice sheets with extreme polar cold',
              'It has dangerous wildlife',
              'It has volcanic smoke',
              'It is underwater'
            ],
            correctOptionIndex: 0,
            explanation: 'Antarctica is situated in the South Polar Region with harsh sub-zero temperatures, hosting only research stations.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Antarctica',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss2_1_8',
            question: 'What is the combined landmass of Europe and Asia called?',
            options: ['Eurasia', 'Asiopia', 'Pangaea', 'Gondwana'],
            correctOptionIndex: 0,
            explanation: 'The combined continuous landmass of Europe and Asia is termed Eurasia.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Eurasia',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss2_1_9',
            question: 'Which of the following is the world largest hot desert, situated in Africa?',
            options: ['Sahara Desert', 'Thar Desert', 'Gobi Desert', 'Kalahari Desert'],
            correctOptionIndex: 0,
            explanation: 'The Sahara Desert in northern Africa is the world largest hot desert.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Sahara Desert',
            difficulty: 'easy'
          },
          {
            id: 'mq_c6_ss2_1_10',
            question: 'What is the strait between India and Sri Lanka called?',
            options: ['Palk Strait', 'Bering Strait', 'Gibraltar Strait', 'Malacca Strait'],
            correctOptionIndex: 0,
            explanation: 'The Palk Strait is the narrow sea channel separating India and Sri Lanka.',
            topicId: 'c6_soc_ch2_t1',
            topicName: 'The Seven Continents of the World',
            conceptTag: 'Strait Definition',
            difficulty: 'medium'
          }
        ]
      )
    ]
  }
];

export const socialScienceClass6Subject: Subject = {
  id: 'c6_sst',
  name: 'Social Studies',
  grade: 'Class 6',
  tagline: 'Exploring Society: India and Beyond — Comprehensive NCERT Grade 6 syllabus',
  color: 'amber',
  icon: 'Compass',
  pdfFilename: 'class_6_social_science_7605e63e.pdf',
  chapters: socialScienceClass6Chapters,
};

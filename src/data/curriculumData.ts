import { Subject, GradeClass, Chapter, Topic } from '../types/curriculum.ts';
import { mathClass6Subject } from './subjects/mathClass6.ts';
import { socialScienceClass6Subject } from './subjects/socialScienceClass6.ts';
import { englishClass6Subject } from './subjects/englishClass6.ts';
import { scienceClass6Subject } from './subjects/scienceClass6.ts';
import { getHigherClassesCurriculum } from './subjects/classes7to10.ts';

// Combine subjects for Class 6
const class6Subjects: Subject[] = [
  mathClass6Subject,
  scienceClass6Subject,
  socialScienceClass6Subject,
  englishClass6Subject,
];

// Higher classes (Classes 7–10)
const higherCurriculum = getHigherClassesCurriculum();

export const CURRICULUM_DATA: Record<GradeClass, Subject[]> = {
  'Class 6': class6Subjects,
  'Class 7': higherCurriculum['Class 7'],
  'Class 8': higherCurriculum['Class 8'],
  'Class 9': higherCurriculum['Class 9'],
  'Class 10': higherCurriculum['Class 10'],
};

/**
 * Helper to retrieve all topics in order for a chapter.
 * Works seamlessly whether chapter has .topics or legacy .topicSets.
 */
export function getChapterTopics(chapter: Chapter): Topic[] {
  if (Array.isArray(chapter.topics) && chapter.topics.length > 0) {
    return chapter.topics;
  }
  if (Array.isArray(chapter.topicSets)) {
    return chapter.topicSets.flatMap((ts) => ts.topics);
  }
  return [];
}

/**
 * Finds the immediate next topic in sequence within the same chapter.
 */
export function getNextTopicInChapter(chapter: Chapter, currentTopicId: string): Topic | undefined {
  const topics = getChapterTopics(chapter);
  const currentIndex = topics.findIndex((t) => t.id === currentTopicId);
  if (currentIndex >= 0 && currentIndex < topics.length - 1) {
    return topics[currentIndex + 1];
  }
  return undefined;
}

/**
 * Finds the previous topic in sequence within the same chapter.
 */
export function getPrevTopicInChapter(chapter: Chapter, currentTopicId: string): Topic | undefined {
  const topics = getChapterTopics(chapter);
  const currentIndex = topics.findIndex((t) => t.id === currentTopicId);
  if (currentIndex > 0) {
    return topics[currentIndex - 1];
  }
  return undefined;
}

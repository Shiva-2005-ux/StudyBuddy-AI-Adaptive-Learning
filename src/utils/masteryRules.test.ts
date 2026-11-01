import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateQuizSubmission,
  isTopicUnlocked,
  getNextTopicInChapter,
  PASSING_THRESHOLD_PERCENT,
} from './masteryRules.ts';

test('Strict 60% Earn-to-Advance Boundary Verification', () => {
  assert.equal(PASSING_THRESHOLD_PERCENT, 60);

  // 10 questions: 6 correct = 60.0% => MUST PASS (score >= 60)
  const testAnswers60 = [
    { questionId: '1', selectedOptionIndex: 0, correctOptionIndex: 0, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Fractions' },
    { questionId: '2', selectedOptionIndex: 1, correctOptionIndex: 1, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Fractions' },
    { questionId: '3', selectedOptionIndex: 2, correctOptionIndex: 2, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Decimals' },
    { questionId: '4', selectedOptionIndex: 0, correctOptionIndex: 0, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Decimals' },
    { questionId: '5', selectedOptionIndex: 1, correctOptionIndex: 1, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Percentages' },
    { questionId: '6', selectedOptionIndex: 2, correctOptionIndex: 2, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Percentages' },
    // 4 wrong
    { questionId: '7', selectedOptionIndex: 0, correctOptionIndex: 1, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Fractions' },
    { questionId: '8', selectedOptionIndex: 0, correctOptionIndex: 2, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Decimals' },
    { questionId: '9', selectedOptionIndex: 1, correctOptionIndex: 3, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Percentages' },
    { questionId: '10', selectedOptionIndex: 2, correctOptionIndex: 0, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Percentages' },
  ];

  const res60 = evaluateQuizSubmission(testAnswers60, 't2');
  assert.equal(res60.scorePercentage, 60);
  assert.equal(res60.passed, true, 'Score of exactly 60% must be marked as PASS (>= 60%)');
  assert.equal(res60.unlockedNextTopic, true, 'Next topic must unlock at 60%');
  assert.equal(res60.nextTopicId, 't2');
  assert.equal(res60.weakConcepts.length, 3);

  // 10 questions: 5 correct = 50.0% => MUST FAIL (< 60)
  const testAnswers50 = [
    { questionId: '1', selectedOptionIndex: 0, correctOptionIndex: 0, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Fractions' },
    { questionId: '2', selectedOptionIndex: 1, correctOptionIndex: 1, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Fractions' },
    { questionId: '3', selectedOptionIndex: 2, correctOptionIndex: 2, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Decimals' },
    { questionId: '4', selectedOptionIndex: 0, correctOptionIndex: 0, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Decimals' },
    { questionId: '5', selectedOptionIndex: 1, correctOptionIndex: 1, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Percentages' },
    // 5 wrong
    { questionId: '6', selectedOptionIndex: 0, correctOptionIndex: 1, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Fractions' },
    { questionId: '7', selectedOptionIndex: 0, correctOptionIndex: 1, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Fractions' },
    { questionId: '8', selectedOptionIndex: 0, correctOptionIndex: 2, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Decimals' },
    { questionId: '9', selectedOptionIndex: 1, correctOptionIndex: 3, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Percentages' },
    { questionId: '10', selectedOptionIndex: 2, correctOptionIndex: 0, topicId: 't1', topicName: 'Topic 1', conceptTag: 'Percentages' },
  ];

  const res50 = evaluateQuizSubmission(testAnswers50, 't2');
  assert.equal(res50.scorePercentage, 50);
  assert.equal(res50.passed, false, 'Score of 50% must FAIL');
  assert.equal(res50.unlockedNextTopic, false, 'Next topic must NOT unlock below 60%');
  assert.equal(res50.nextTopicId, null);

  // 100 questions: 59 correct = 59.0% => MUST FAIL
  const testAnswers59: any[] = [];
  for (let i = 0; i < 59; i++) {
    testAnswers59.push({ questionId: `q_${i}`, selectedOptionIndex: 0, correctOptionIndex: 0, topicId: 't1', topicName: 'T1', conceptTag: 'A' });
  }
  for (let i = 59; i < 100; i++) {
    testAnswers59.push({ questionId: `q_${i}`, selectedOptionIndex: 1, correctOptionIndex: 0, topicId: 't1', topicName: 'T1', conceptTag: 'A' });
  }
  const res59 = evaluateQuizSubmission(testAnswers59, 't2');
  assert.equal(res59.scorePercentage, 59);
  assert.equal(res59.passed, false, '59% must fail without rounding up');
  assert.equal(res59.unlockedNextTopic, false);
});

test('Topic Unlocking & Next Topic Ordering Verification', () => {
  const topics = [
    { id: 't1', order: 1 },
    { id: 't2', order: 2 },
    { id: 't3', order: 3 },
  ];

  // Next topic discovery
  assert.equal(getNextTopicInChapter('t1', topics), 't2');
  assert.equal(getNextTopicInChapter('t2', topics), 't3');
  assert.equal(getNextTopicInChapter('t3', topics), null);

  // Topic 1 of Chapter 1 is unlocked initially
  assert.equal(isTopicUnlocked('t1', 1, 1, [], []), true);

  // Topic 2 is locked if topic 1 is not mastered
  assert.equal(isTopicUnlocked('t2', 2, 1, [], [], 't1'), false);

  // Topic 2 is unlocked if topic 1 is mastered
  assert.equal(isTopicUnlocked('t2', 2, 1, ['t1'], [], 't1'), true);

  // Topic 2 is unlocked if in unlockedTopicIds
  assert.equal(isTopicUnlocked('t2', 2, 1, [], ['t2'], 't1'), true);
});

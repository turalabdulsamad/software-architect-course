import { CAPSTONE_ID, LESSONS, type LaneId, type Lesson } from "@/lib/course";
import type { SessionMeta } from "@/lib/sessions";
import { ExerciseCheck } from "./ExerciseCheck";
import { GoCode } from "./GoCode";
import { QuizBank } from "./QuizBank";
import { RichText } from "./RichText";
import { H2 } from "./mdx/Teach";

const WORDS_PER_MINUTE = 200;
const MINUTES_PER_QUESTION = 1;

const LANE_INTRO: Record<LaneId, { summary: string; outcomes: string[] }> = {
  go: {
    summary:
      "Go from a first program to goroutines and tests: the types, functions, errors, collections, methods and interfaces every later lesson builds on.",
    outcomes: [
      "Write, run and test a Go program from scratch",
      "Handle errors the Go way with multiple return values and defer",
      "Model data with slices, maps, structs, methods and interfaces",
      "Run work concurrently with goroutines and channels without data races",
    ],
  },
  ds: {
    summary:
      "The core data structures and what each one costs: Big-O, arrays, linked lists, stacks, queues, hash maps, trees, heaps and graphs, all built in Go.",
    outcomes: [
      "Estimate the cost of code with Big-O and confirm it with benchmarks",
      "Choose between arrays, linked lists, stacks and queues by access pattern",
      "Explain why hash map lookups are O(1) on average and build one yourself",
      "Use trees, heaps and graphs, and traverse a graph with BFS and DFS",
    ],
  },
  al: {
    summary:
      "Sorting, searching, recursion, two pointers, dynamic programming, graph algorithms and greedy search, ending in a capstone that uses all three tracks.",
    outcomes: [
      "Implement and test sorting algorithms up to merge sort",
      "Apply binary search, two pointers and sliding windows to array problems",
      "Break problems down with recursion and dynamic programming",
      "Order dependencies with topological sort and find shortest paths with Dijkstra",
    ],
  },
};

const laneLessons = (lane: LaneId): Lesson[] => {
  const inLane = LESSONS.filter((l) => l.lane === lane);
  return [...inLane.filter((l) => l.id !== CAPSTONE_ID), ...inLane.filter((l) => l.id === CAPSTONE_ID)];
};

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

const readingMinutes = (lessons: Lesson[]) => {
  const words = lessons.reduce((n, l) => n + wordCount(l.text) + wordCount(l.exercise), 0);
  const questions = lessons.reduce((n, l) => n + l.quiz.length, 0);
  return Math.round(words / WORDS_PER_MINUTE + questions * MINUTES_PER_QUESTION);
};

function LaneLessons({ lessons }: { lessons: Lesson[] }) {
  return lessons.map((lesson) => (
    <section key={lesson.id} className="lane-lesson">
      <H2>{lesson.title}</H2>
      <RichText text={lesson.text} />
      <GoCode code={lesson.code} label={`${lesson.id}.go`} />
      <h3>Quiz</h3>
      <QuizBank lesson={lesson} />
      <h3>Exercise · write it in your own editor</h3>
      <p className="exercise">{lesson.exercise}</p>
      <ExerciseCheck lessonId={lesson.id} />
    </section>
  ));
}

export function laneSession(lane: LaneId): { default: React.ComponentType; meta: SessionMeta } {
  const lessons = laneLessons(lane);
  return {
    default: function LaneContent() {
      return <LaneLessons lessons={lessons} />;
    },
    meta: { ...LANE_INTRO[lane], minutes: readingMinutes(lessons) },
  };
}

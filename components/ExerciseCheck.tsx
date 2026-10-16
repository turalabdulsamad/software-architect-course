"use client";

import { useProgress } from "@/lib/progress";

export function ExerciseCheck({ lessonId }: { lessonId: string }) {
  const p = useProgress();
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={p.exerciseDone(lessonId)}
        onChange={(e) => p.setExercise(lessonId, e.target.checked)}
      />
      <span>I finished this exercise and it runs</span>
    </label>
  );
}

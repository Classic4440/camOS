import { useDesk } from "@/lib/camos/store";
import { Page, PageHead } from "@/components/camos/ui";
import { cn } from "@/lib/utils";

export function LearnView() {
  const paths = useDesk((state) => state.paths);
  const exercises = useDesk((state) => state.exercises);
  const notes = useDesk((state) => state.notes);
  const setPath = useDesk((state) => state.setPath);
  const answerExercise = useDesk((state) => state.answerExercise);
  const answered = exercises.filter((item) => item.picked !== null);
  const correct = answered.filter((item) => item.picked === item.answer).length;
  const reading = notes.filter((note) => note.tags.some((tag) => tag.toLowerCase() === "reading"));

  return (
    <Page width="read">
      <PageHead
        kicker="Records · Learning"
        title="Study with a consequence."
        lede="Move a path when you have actually practiced. The questions check the rules this desk uses."
      />
      <ol className="divide-y divide-line border-y border-line">
        {paths.map((path) => (
          <li key={path.id} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl">{path.title}</h2>
              <span className="tabular-nums text-sm">{path.progress}%</span>
            </div>
            <p className="text-sm text-muted">{path.domain}</p>
            <label className="mt-3 block">
              <span className="sr-only">{path.title} progress</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={path.progress}
                onChange={(event) => setPath(path.id, { progress: Number(event.target.value) })}
              />
            </label>
          </li>
        ))}
      </ol>
      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Reasoning</h2>
          <p className="text-sm tabular-nums text-muted">
            {correct} / {exercises.length} correct
          </p>
        </div>
        <ol className="space-y-8">
          {exercises.map((exercise, index) => (
            <li key={exercise.id}>
              <p className="text-xs font-semibold uppercase tracking-widest text-faint">Question {index + 1}</p>
              <p className="mt-1 font-semibold">{exercise.prompt}</p>
              <ul className="mt-3 space-y-2">
                {exercise.choices.map((choice, choiceIndex) => {
                  const picked = exercise.picked === choiceIndex;
                  const show = exercise.picked !== null;
                  const right = choiceIndex === exercise.answer;
                  return (
                    <li key={choice}>
                      <button
                        type="button"
                        disabled={exercise.picked !== null}
                        onClick={() => answerExercise(exercise.id, choiceIndex)}
                        className={cn(
                          "min-h-11 w-full border px-3 text-left text-sm",
                          !show && "border-line hover:border-ink",
                          show && right && "border-moss text-moss",
                          show && picked && !right && "border-rust text-rust",
                          show && !picked && !right && "border-line text-muted",
                        )}
                      >
                        {choice}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {exercise.picked !== null ? <p className="mt-2 text-sm leading-relaxed text-muted">{exercise.explanation}</p> : null}
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-10 border-t border-line pt-4">
        <h2 className="font-display text-xl">Reading</h2>
        {reading.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No note is tagged reading. In the vault, add that tag to a note you are actually working through.</p>
        ) : (
          <ul className="mt-2 text-sm">
            {reading.map((note) => (
              <li key={note.id}>{note.title}</li>
            ))}
          </ul>
        )}
      </section>
    </Page>
  );
}

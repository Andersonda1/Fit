import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function WorkoutPlanner() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState("");
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({ name: "", muscle: "", reps: "", sets: "", comment: "" });
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(null);

  const addWorkout = () => {
    if (!newWorkout.trim()) return;
    setWorkouts([...workouts, { name: newWorkout.trim(), exercises: [] }]);
    setNewWorkout("");
  };

  const openExerciseModal = (wIndex) => {
    setCurrentWorkoutIndex(wIndex);
    setExerciseForm({ name: "", muscle: "", reps: "", sets: "", comment: "" });
    setModalOpen(true);
  };

  const submitExercise = () => {
    const updated = [...workouts];
    updated[currentWorkoutIndex].exercises.push({
      ...exerciseForm,
      done: false,
      weight: "",
      postComment: ""
    });
    setWorkouts(updated);
    updateStats(updated);
    setModalOpen(false);
  };

  const toggleExerciseDone = (wIndex, eIndex) => {
    const updated = [...workouts];
    const ex = updated[wIndex].exercises[eIndex];
    ex.done = !ex.done;
    if (ex.done) {
      ex.weight = prompt("Указанный вес:") || "";
      ex.postComment = prompt("Комментарий после выполнения:") || "";
    } else {
      ex.weight = "";
      ex.postComment = "";
    }
    setWorkouts(updated);
    updateStats(updated);
  };

  const copyWorkout = (wIndex) => {
    const original = workouts[wIndex];
    const copy = {
      ...original,
      name: `${original.name} (копия)`,
      exercises: original.exercises.map(e => ({ ...e, done: false, weight: "", postComment: "" }))
    };
    setWorkouts([...workouts, copy]);
  };

  const updateStats = (data) => {
    let total = 0, completed = 0;
    data.forEach(w => w.exercises.forEach(e => {
      total++;
      if (e.done) completed++;
    }));
    setStats({ total, completed });
  };

  const removeWorkout = (wIndex) => {
    const updated = [...workouts];
    updated.splice(wIndex, 1);
    setWorkouts(updated);
    updateStats(updated);
  };

  const removeExercise = (wIndex, eIndex) => {
    const updated = [...workouts];
    updated[wIndex].exercises.splice(eIndex, 1);
    setWorkouts(updated);
    updateStats(updated);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Тренировочный планировщик</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Новая тренировка"
          value={newWorkout}
          onChange={(e) => setNewWorkout(e.target.value)}
        />
        <Button onClick={addWorkout}>Добавить</Button>
      </div>

      <div className="text-gray-700 text-sm">
        Всего упражнений: {stats.total} • Выполнено: {stats.completed}
      </div>

      {workouts.map((w, wIndex) => (
        <Card key={wIndex} className="bg-white shadow-md">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{w.name}</h2>
              <div className="space-x-2">
                <Button onClick={() => openExerciseModal(wIndex)}>+ Упражнение</Button>
                <Button variant="secondary" onClick={() => copyWorkout(wIndex)}>Копировать</Button>
                <Button variant="destructive" onClick={() => removeWorkout(wIndex)}>Удалить тренировку</Button>
              </div>
            </div>
            {w.exercises.map((ex, eIndex) => (
              <div
                key={eIndex}
                className={`p-2 rounded border ${ex.done ? "bg-green-100 border-green-500" : "bg-gray-50"}`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">
                      {ex.name} — {ex.muscle} | {ex.reps}×{ex.sets}
                    </div>
                    <div className="text-sm text-gray-600">{ex.comment}</div>
                    {ex.done && (
                      <div className="text-sm mt-1">
                        <div>Вес: {ex.weight}</div>
                        <div>Комментарий: {ex.postComment}</div>
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => removeExercise(wIndex, eIndex)}>✕</Button>
                </div>
                <Button
                  size="sm"
                  variant={ex.done ? "secondary" : "outline"}
                  className="mt-2"
                  onClick={() => toggleExerciseDone(wIndex, eIndex)}
                >
                  {ex.done ? "Сбросить" : "Выполнено"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить упражнение</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Упражнение" value={exerciseForm.name} onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })} />
            <Input placeholder="Целевая мышца" value={exerciseForm.muscle} onChange={(e) => setExerciseForm({ ...exerciseForm, muscle: e.target.value })} />
            <Input placeholder="Повторения" value={exerciseForm.reps} onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })} />
            <Input placeholder="Подходы" value={exerciseForm.sets} onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })} />
            <Textarea placeholder="Комментарий" value={exerciseForm.comment} onChange={(e) => setExerciseForm({ ...exerciseForm, comment: e.target.value })} />
            <Button onClick={submitExercise}>Добавить</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

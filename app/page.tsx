
"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [heading, setHeading] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("daily-notes");
      if (saved) {
        const data = JSON.parse(saved);
        setHeading(data.heading || "");
        setTasks(data.tasks || []);
      }
    } catch {
      console.error("Could not load saved notes");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "daily-notes",
        JSON.stringify({ heading, tasks })
      );
    }
  }, [heading, tasks, loaded]);

  function addTask() {
    setTasks(old => [
      ...old,
      {
        id: Date.now() + Math.random(),
        text: "",
        completed: false
      }
    ]);
  }

  function updateTask(id: number, text: string) {
    setTasks(old =>
      old.map(task =>
        task.id === id ? { ...task, text } : task
      )
    );
  }

  function toggleTask(id: number) {
    setTasks(old =>
      old.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks(old => old.filter(task => task.id !== id));
  }

  function handleEnter(
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) {
    if (e.key === "Enter") {
      e.preventDefault();

      const index = tasks.findIndex(task => task.id === id);

      const next = [
        ...tasks.slice(0, index + 1),
        {
          id: Date.now() + Math.random(),
          text: "",
          completed: false
        },
        ...tasks.slice(index + 1)
      ];

      setTasks(next);
    }
  }

  return (
    <main className="paper min-h-screen px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-3xl">

        <section>
          <input
            value={heading}
            onChange={e => setHeading(e.target.value)}
            placeholder="Add a heading..."
            className="typewriter mb-8 w-full border-b border-[#8c765b]/30 bg-transparent pb-3 text-xl font-bold text-[#453b30] outline-none placeholder:text-[#a99a83]"
          />

          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className="group flex items-center gap-4"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="paper-checkbox shrink-0"
                  aria-label="Complete task"
                />

                <input
                  value={task.text}
                  onChange={e =>
                    updateTask(task.id, e.target.value)
                  }
                  onKeyDown={e => handleEnter(e, task.id)}
                  placeholder=" "
                  className={`typewriter min-w-0 flex-1 border-b border-transparent bg-transparent py-2 text-base leading-relaxed outline-none focus:border-[#8c765b]/30 ${
                    task.completed
                      ? "text-[#9b8c79] line-through"
                      : "text-[#453b30]"
                  }`}
                />

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-[#a99a83] opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
                  aria-label="Delete line"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addTask}
            className="typewriter mt-6 text-sm text-[#9b896f] transition-colors hover:text-[#453b30]"
          >
            + Add another line
          </button>
        </section>

      </div>
    </main>
  );
}

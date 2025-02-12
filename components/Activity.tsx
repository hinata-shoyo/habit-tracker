"use client";

import { useState, useEffect, useContext } from "react";
import { SquareCheck, Trash } from "lucide-react";
import ActivityCalendar, {
  Activity,
  ThemeInput,
} from "react-activity-calendar";
import { Task } from "./DashboardPage";
import { themeContext } from "./providers";

export const Activityy: React.FC<Task> = ({
  id,
  name,
  gettasks,
  createdAt,
}) => {
  interface Completed {
    completedOn: string;
  }
  const [completed, setCompleted] = useState<Completed[]>([]);
  const [todayCom, setTodayCom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const todayy = new Date().toLocaleDateString("en-CA")
  const today =  new Date(todayy).toJSON().split("T")[0];

  const getCompletes = async () => {
    try {
      const response = await fetch(`/api/task/complete?taskId=${id}`, {
        method: "GET",
      });
      const data = await response.json();
      data.completedTasks.map((comp: Completed) => {
        if (comp.completedOn.split("T")[0] === today) {
          setTodayCom(true);
        }
      });
      setCompleted(data.completedTasks);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getCompletes();
  }, []);

  const subtractSixMonths = (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - 11);
    // Format back to YYYY-MM-DD
    return date.toISOString().split("T")[0];
  };

  const startDate = (completed: Completed[]): Activity[] => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-CA"); // Ensures correct local YYYY-MM-DD format
    };
    const normalizeDate = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Resets time to 00:00:00
    };
    const completedDates = new Set(
      completed.map((curr) => curr.completedOn.split("T")[0]),
    );
    const startDate = normalizeDate(new Date(createdAt));
    const toDate = normalizeDate(new Date(today));
    const grouped = [];
    for (let i = new Date(startDate); i <= toDate; i.setDate(i.getDate() + 1)) {
      const date = formatDate(i);
      grouped.push({
        date: date,
        count: 0,
        level: completedDates.has(date) ? 4 : 1,
      });
    }
    grouped.unshift({ date: subtractSixMonths(), count: 0, level: 0 });
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 4);
    grouped.push({
      date: nextDate.toISOString().split("T")[0],
      count: 0,
      level: 0,
    });
    return grouped;
  };

  const explicitTheme: ThemeInput = {
    light: ["#c9c2bd", "#857ab4", "#7DB9B6", "#F5E9CF", "#8e51ff"],
    dark: ["#383838", "#676378", "#7DB9B6", "#F5E9CF", "#8e51ff"],
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/task/complete", {
        method: "POST",
        body: JSON.stringify({
          taskId: id,
          completedOn: today,
        }),
      });
      setLoading(false);
      setTodayCom(!todayCom);
      getCompletes();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      const response = await fetch("/api/task", {
        method: "DELETE",
        body: JSON.stringify({
          taskId: id,
        }),
      });
      await gettasks();
      setDelLoading(false);
    } catch (e) {
      console.log(e);
      setDelLoading(false);
    }
  };
  const useTheme = useContext(themeContext);

  return (
    <div className="dark:text-white ">
      <div className=" dark:border-gray-400 dark:bg-black bg-stone-300 border-black rounded-md p-2 ">
        <div className="flex justify-between mb-2">
          <div
            className={`ml-4 text-[1rem] ${todayCom ? "line-through dark:text-violet-400 text-violet-600" : ""}`}
          >
            {name}
          </div>
          <div className="flex items-center gap-4 dark:text-gray-300 text-gray-900">
            <div onClick={handleDelete}>
              <Trash
                size={25}
                className={`${delLoading ? "opacity-50" : ""} hover:cursor-pointer`}
              />
            </div>
            <div onClick={handleComplete}>
              <SquareCheck
                size={30}
                className={`${todayCom ? "dark:text-violet-400 text-violet-600" : ""} ${loading ? "opacity-50" : ""} hover:cursor-pointer`}
              />
            </div>
          </div>
        </div>
        <div
          className="ovrflow-x-scroll  mx-auto dark:border-gray-400 border-black "
          style={{ direction: "rtl" }}
        >
          <ActivityCalendar
            data={startDate(completed)}
            maxLevel={4}
            blockSize={10}
            hideTotalCount={true}
            hideColorLegend={true}
            hideMonthLabels={true}
            theme={explicitTheme}
            colorScheme={useTheme?.theme}
          />
        </div>
      </div>
    </div>
  );
};

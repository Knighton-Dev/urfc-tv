import schedule from "@/data/schedule.json";
import type { Game } from "@/types/schedule";

function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

function getTodaysGame(): Game | null {
  const today = getTodayDateString();
  return (schedule as Game[]).find((game) => game.date === today) ?? null;
}

export default function Home() {
  const game = getTodaysGame();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-black">
      {game ? (
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="text-2xl font-medium tracking-widest uppercase text-black/50">
            Do the Utah Royals play today?
          </p>
          <p className="text-[12rem] font-black leading-none tracking-tight">
            YES
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-medium">vs. {game.opponent}</p>
            <p className="text-lg text-black/60">{game.time}</p>
          </div>
          <a
            href={game.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-black px-8 py-3 text-lg font-semibold transition-colors hover:bg-black hover:text-white"
          >
            Watch on {game.provider}
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="text-2xl font-medium tracking-widest uppercase text-black/50">
            Do the Utah Royals play today?
          </p>
          <p className="text-[12rem] font-black leading-none tracking-tight">
            NO
          </p>
        </div>
      )}
    </main>
  );
}

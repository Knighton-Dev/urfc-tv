import schedule from "@/data/schedule.json";
import type { Game } from "@/types/schedule";

function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Denver",
  }); // YYYY-MM-DD in Mountain Time
}

function getTodaysGame(): Game | null {
  const today = getTodayDateString();
  return (schedule as Game[]).find((game) => game.date === today) ?? null;
}

function getNextGame(): Game | null {
  const today = getTodayDateString();
  return (
    (schedule as Game[])
      .filter((game) => game.date > today)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
  );
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    timeZone: "America/Denver",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const game = getTodaysGame();
  const nextGame = !game ? getNextGame() : null;

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
          <div className="mt-4 flex flex-col items-center gap-3">
            {game.streamingServices && game.streamingServices.length > 0 && (
              <>
                {game.streamingServices.map((service) => (
                  <a
                    key={service.provider}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-black px-8 py-3 text-lg font-semibold transition-colors hover:bg-black hover:text-white"
                  >
                    Watch on {service.provider}
                  </a>
                ))}
                {game.broadcast && game.broadcast.length > 0 && (
                  <div className="flex flex-col items-center gap-1 pt-1">
                    {game.broadcast.map((channel) => (
                      <p key={channel.provider} className="text-lg text-black/60">
                        Also available on {channel.provider}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
            {(!game.streamingServices || game.streamingServices.length === 0) &&
              game.broadcast &&
              game.broadcast.length > 0 && (
                <div className="flex flex-col items-center gap-2">
                  {game.broadcast.map((channel) => (
                    <p
                      key={channel.provider}
                      className="text-lg font-semibold text-black"
                    >
                      Watch on {channel.provider}
                    </p>
                  ))}
                </div>
              )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="text-2xl font-medium tracking-widest uppercase text-black/50">
            Do the Utah Royals play today?
          </p>
          <p className="text-[12rem] font-black leading-none tracking-tight">
            NO
          </p>
          {nextGame && (
            <p className="text-lg text-black/60">
              Next game: {formatDate(nextGame.date)} vs. {nextGame.opponent} at {nextGame.time}
            </p>
          )}
        </div>
      )}
    </main>
  );
}

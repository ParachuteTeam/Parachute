import React, { useMemo } from "react";
import { add, format } from "date-fns";
import { IoEarthSharp } from "react-icons/io5";
import { formatTimeZoneTag } from "../../utils/utils";

const AvailablePerson: React.FC<{
  id?: string;
  name: string;
  timeZoneTag: string;
  setHoveredPerson?: (id: string | null) => void;
}> = ({ id, name, timeZoneTag, setHoveredPerson }) => {
  return (
    <div
      className="flex flex-row items-center gap-1"
      onMouseEnter={() => setHoveredPerson?.(id ?? null)}
      onMouseLeave={() => setHoveredPerson?.(null)}
    >
      <div className="font-semibold">{name}</div>
      <IoEarthSharp className="text-md ml-2 text-gray-500" />
      <div className="text-gray-500">{formatTimeZoneTag(timeZoneTag)}</div>
    </div>
  );
};

interface TimeSlotParticipantsPanelProps {
  participants: {
    userID: string;
    timeZone: string;
    user: {
      name: string;
    };
  }[];
  onHoverPersonChange?: (id: string | null) => void;
  hoveredTime?: Date | null;
}

export const TimeSlotParticipantsPanel: React.FC<
  TimeSlotParticipantsPanelProps
> = ({ participants, onHoverPersonChange, hoveredTime }) => {
  // States
  const [hoveredPerson, setHoveredPerson] = React.useState<string | null>(null);

  // Cached participants map to find who is available
  const participantsMap = useMemo(() => {
    const map: Record<string, string> = {};
    participants?.forEach((participant) => {
      map[participant.userID] = participant.user.name;
    });
    return map;
  }, [participants]);

  return (
    <div className="card flex h-96 w-96 flex-col items-start justify-start gap-3 p-6 text-sm shadow-lg">
      {hoveredPerson || !hoveredTime ? (
        <>
          <div className="mb-6 text-xs text-gray-500">
            {hoveredPerson
              ? `Now displaying availability of ${
                  participantsMap[hoveredPerson] ?? ""
                }`
              : "All people filled (hover to see their availability):"}
          </div>
          {participants?.map((participant) => (
            <AvailablePerson
              key={participant.userID}
              id={participant.userID}
              name={participant.user.name}
              timeZoneTag={participant.timeZone}
              setHoveredPerson={(id) => {
                setHoveredPerson(id);
                onHoverPersonChange?.(id);
              }}
            />
          ))}
        </>
      ) : (
        <>
          <div className="mb-6 text-xs text-gray-500">
            People available on {format(hoveredTime, "EEEEEEE")} from{" "}
            {format(hoveredTime, "p")} to{" "}
            {format(add(hoveredTime, { minutes: 15 }), "p")}:
          </div>
          {participants?.map((participant) => (
            <AvailablePerson
              key={participant.userID}
              id={participant.userID}
              name={participant.user.name}
              timeZoneTag={participant.timeZone}
            />
          ))}
        </>
      )}
    </div>
  );
};

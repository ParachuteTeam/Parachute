import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { ButtonWithState } from "./Button";
import { MdOutlineFileDownloadDone } from "react-icons/md";

interface TimeslotSavePanelProps {
  changed: boolean;
  saveTimeSlots: () => Promise<void>;
  resetSchedule: () => void;
}

export const TimeslotSavePanel: React.FC<TimeslotSavePanelProps> = ({
  changed,
  saveTimeSlots,
  resetSchedule,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  return (
    <div className="card flex h-36 w-64 flex-col items-center justify-center gap-2 p-4 shadow-lg">
      {changed ? (
        <>
          <div className="flex flex-row items-center justify-center gap-1 p-1">
            <FiEdit className="text-sm" />
            <div className="text-sm text-gray-500">Unsaved change detected</div>
          </div>
          <ButtonWithState
            className="primary-button-with-hover w-full text-sm"
            loadingClassName="primary-button-loading w-full text-sm"
            loading={isSaving}
            onClick={() => {
              setIsSaving(true);
              saveTimeSlots().finally(() => setIsSaving(false));
            }}
          >
            Save
          </ButtonWithState>
          <ButtonWithState
            className="rounded-button w-full text-sm"
            disabledClassName="rounded-button-disabled w-full text-sm"
            disabled={isSaving}
            onClick={resetSchedule}
          >
            Discard
          </ButtonWithState>
        </>
      ) : (
        <>
          <MdOutlineFileDownloadDone className="text-5xl text-gray-500" />
          <div className="mt-1 text-lg font-bold">File Saved</div>
          <div className="text-[12px] font-light text-gray-500">
            Availability is up to date
          </div>
        </>
      )}
    </div>
  );
};

export const TimeslotSavePanelSkeleton: React.FC = () => {
  return <div className="skeleton h-36 w-64" />;
};

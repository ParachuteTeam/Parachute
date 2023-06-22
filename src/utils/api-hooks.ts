import { api } from "./api";
import { toDatetimeIntervals } from "./utils";

// >>> Query Hooks >>>

export const useEvent = (eventId: string) => {
  return api.events.getEvent.useQuery({
    eventId,
  });
};

export const useEventWithJoinCode = (joinCode: string) => {
  return api.events.getEventjoinCode.useQuery(
    {
      joinCode,
    },
    { enabled: joinCode.length > 0 }
  );
};

export const useParticipatedEvents = () => {
  return api.participates.getParticipateEvents.useQuery();
};

export const useUserParticipateOf = (eventId: string) => {
  return api.events.getCurrentUserParticipate.useQuery({
    eventId,
  });
};

export const useParticipantsOf = (eventId: string) => {
  return api.events.getAllParticipants.useQuery({
    eventId,
  });
};

export const useUserTimeslotsIn = (eventId: string) => {
  const result = api.events.getCurrentUserParticipate.useQuery({
    eventId,
  });
  return {
    ...result,
    data: result.data?.timeSlots,
  };
};

export const useAllTimeslotsOf = (eventId: string) => {
  return api.timeslots.getAllTimeSlots_Event.useQuery({
    eventID: eventId,
  });
};

// <<< Query Hooks <<<

// >>> Mutation Hooks >>>

export const useCreateEvent = () => {
  return api.events.createEvent.useMutation();
};

export const useEditNameOf = (eventId: string) => {
  const { mutateAsync: editEventName } =
    api.events.updateEvent_name.useMutation();
  return async (name: string) => {
    await editEventName({ eventId, name });
  };
};

export const useLeaveEvent = (eventId: string) => {
  const { mutateAsync: deleteCurrentUserParticipate } =
    api.participates.deleteCurrentUserParticipate.useMutation();
  return async () => {
    await deleteCurrentUserParticipate({ eventID: eventId });
  };
};

export const useDeleteParticipantsOf = (eventId: string) => {
  const { mutateAsync: deleteParticipants } =
    api.participates.deleteParticipants.useMutation();
  return async (deleteUserIDs: string[]) => {
    await deleteParticipants({ eventID: eventId, userIDs: deleteUserIDs });
  };
};

export const useDeleteEvent = (eventId: string) => {
  const { mutateAsync: deleteEvent } = api.events.deleteEvent.useMutation();
  return async () => {
    await deleteEvent({ eventId });
  };
};

export const useReplaceUserTimeslotsIn = (eventId: string) => {
  const { mutateAsync: replaceMyTimeslots } =
    api.timeslots.timeslotsReplace.useMutation();
  return async (schedule: Date[], defaultTimeZone: string) => {
    const intervals = toDatetimeIntervals(schedule, { minutes: 15 }, true);
    await replaceMyTimeslots({
      eventID: eventId,
      defaultTimeZone,
      timeslots: intervals.map((itv) => ({
        begins: itv.start.toJSON(),
        ends: itv.end.toJSON(),
      })),
    });
  };
};

// <<< Mutation Hooks <<<

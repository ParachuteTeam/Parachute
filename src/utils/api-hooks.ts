import { api } from "./api";

// >>> Query Hooks >>>

export const useEvent = (eventId: string) => {
  return api.events.getEvent.useQuery({
    eventId,
  });
};

export const useEventWithJoinCode = (joinCode: string) => {
  return api.events.getEventjoinCode.useQuery({
    joinCode,
  });
};

export const useParticipatedEvents = () => {
  return api.participates.getParticipateEvents.useQuery();
};

export const useParticipantsOf = (eventId: string) => {
  return api.events.getAllParticipants.useQuery({
    eventId,
  });
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

export const useDeleteParticipantsOf = (eventId: string) => {
  const { mutateAsync: editEventParticipants } =
    api.participates.deleteParticipants.useMutation();
  return async (deleteUserIDs: string[]) => {
    await editEventParticipants({ eventID: eventId, userIDs: deleteUserIDs });
  };
};

export const useDeleteEvent = (eventId: string) => {
  const { mutateAsync: deleteEvent } = api.events.deleteEvent.useMutation();
  return async () => {
    await deleteEvent({ eventId });
  };
};

// <<< Mutation Hooks <<<

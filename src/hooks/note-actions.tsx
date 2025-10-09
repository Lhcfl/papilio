export const useRenoteAction = (noteId: string) => {
	const api = useMisskeyApi();
	return useMutation({
		mutationKey: ["renote", noteId],
		mutationFn: (visibility: "public" | "home" | "followers") =>
			api.request("notes/create", { renoteId: noteId, visibility }),
	});
};

export const useUnrenoteAction = (noteId: string) => {
	const api = useMisskeyApi();
	return useMutation({
		mutationKey: ["unrenote", noteId],
		mutationFn: () => api.request("notes/unrenote", { noteId }),
	});
};

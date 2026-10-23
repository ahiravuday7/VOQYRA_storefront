const authQueryKeys = {
  all: ["auth"],
  currentUser: () => [...authQueryKeys.all, "current-user"],
};

export { authQueryKeys };

function getAuthUser(data) {
  return data?.data?.user ?? data?.user ?? null;
}

export { getAuthUser };

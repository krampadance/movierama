const getUser = (store) => ({
  userId: store.user,
  userName: store.userName,
  likes: store.userLikes,
  hates: store.userHates,
  accessToken: store.accessToken
});

export default getUser;

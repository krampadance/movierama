export const getUser = store => {
    return {
        userId: store.user,
        userName: store.userName,
        likes: store.userLikes,
        hates: store.userHates
    }
}

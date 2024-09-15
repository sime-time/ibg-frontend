import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// this function is for admin registration
export const authorizePB = async () => {
  if (!pb.authStore.isValid) {
    try {
      await pb.admins.authWithPassword(
        import.meta.env.VITE_POCKETBASE_EMAIL,
        import.meta.env.VITE_POCKETBASE_PASSWORD
      );
    } catch (err) {
      console.error("Authentication error: ", err);
    }
  }
  return pb;
}

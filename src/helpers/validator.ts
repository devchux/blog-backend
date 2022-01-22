export const signupValidator: (data: any) => boolean = (data: any) => {
  const { username, password, email } = data;
  if (!username || !password || !email) return false;
  return true;
};

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    console.log('Bearer_' + user.token);
    return { Authorization: 'Bearer_' + user.token };
  } else {
    return {};
  }
}

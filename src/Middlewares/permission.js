export default (role) => (req, res, next) => {
  if (!req.auth) return res.status(401).json({ error: 'Token not provided.' }); // Forbidden for not authenticated
  if (!role || role === 'logged' || role === 'authenticated') return next(); // Allow everyone authenticated if no role are set
  if (req.auth.roles.includes(role)) return next(); // Allow only users with certain roles
  return res.sendStatus(403); // Not allowed for users without the roles
};
